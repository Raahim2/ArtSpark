import React, { useState, useCallback, useRef, useEffect } from 'react';
import { StyleSheet, View, PanResponder,  Alert, TouchableOpacity , Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Skia } from '@shopify/react-native-skia';
import UpperNavigation from '../Components/Home/UpperNavigation';
import SideBar from '../Components/Home/SideBar';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import DrawingCanvas from '../Components/KalaidoscopeCanvas/DrawingCanvas';
import ControlPanel from '../Components/KalaidoscopeCanvas/ControlPanel';

// --- Configuration ---
const PROJECTS_STORAGE_KEY = '@creative_suite_projects'; // Use a new key for the new Skia format
const COLORS = [
  '#000000', '#444444', '#888888', '#CCCCCC', '#FFFFFF',
  '#EF4444', '#F97316', '#FACC15', '#22C55E', '#3B82F6',
  '#8B5CF6', '#EC4899', '#10B981', '#14B8A6', '#EAB308',
];
const CANVAS_BACKGROUND = '#FFFFFF';
const APP_BACKGROUND = '#F0F0F0';

// --- Helper functions for shapes ---
const createPolygonPath = (center, radius, sides) => {
  const path = Skia.Path.Make();
  const angleOffset = sides === 3 ? -Math.PI / 2 : -Math.PI / sides;
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides + angleOffset;
    const x = center.x + radius * Math.cos(angle);
    const y = center.y + radius * Math.sin(angle);
    if (i === 0) path.moveTo(x, y);
    else path.lineTo(x, y);
  }
  path.close();
  return path;
};

const createStarPath = (center, outerRadius, points = 5) => {
  const path = Skia.Path.Make();
  const innerRadius = outerRadius * 0.4;
  const vertices = points * 2;
  const angleStep = (Math.PI * 2) / vertices;
  const angleOffset = -Math.PI / 2;

  for (let i = 0; i < vertices; i++) {
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = i * angleStep + angleOffset;
    const x = center.x + r * Math.cos(angle);
    const y = center.y + r * Math.sin(angle);
    if (i === 0) path.moveTo(x, y);
    else path.lineTo(x, y);
  }
  path.close();
  return path;
};

const createXPath = (center, size) => {
  const path = Skia.Path.Make();
  const half = size / 2;
  path.moveTo(center.x - half, center.y - half);
  path.lineTo(center.x + half, center.y + half);
  path.moveTo(center.x + half, center.y - half);
  path.lineTo(center.x - half, center.y + half);
  return path;
};

const createHeartPath = (center, size) => {
  const path = Skia.Path.Make();
  const w = size;
  const h = size;
  const x0 = center.x;
  const y0 = center.y - h / 4;

  path.moveTo(x0, y0 + h / 2);
  path.cubicTo(x0, y0 + h / 4, x0 - w / 2, y0 + h / 4, x0 - w / 2, y0);
  path.cubicTo(x0 - w / 2, y0 - h / 2, x0, y0 - h / 2, x0, y0);
  path.cubicTo(x0, y0 - h / 2, x0 + w / 2, y0 - h / 2, x0 + w / 2, y0);
  path.cubicTo(x0 + w / 2, y0 + h / 4, x0, y0 + h / 4, x0, y0 + h / 2);
  path.close();
  return path;
};


export default function KaleidoscopeCanvasScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // --- State ---
  const [projectId, setProjectId] = useState(null);
  const [paths, setPaths] = useState([]);
  const [current, setCurrent] = useState(Skia.Path.Make());
  const [undonePaths, setUndonePaths] = useState([]);
  const [canvasInfo, setCanvasInfo] = useState(null);
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [isReady, setIsReady] = useState(false); // Prevents premature saving
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarAnimation = useRef(new Animated.Value(0)).current;

  // --- Tool State ---
  const [currentColor, setCurrentColor] = useState(COLORS[1]);
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [segments, setSegments] = useState(6);
  const [drawingMode, setDrawingMode] = useState('doodle');
  const [startPoint, setStartPoint] = useState(null);
  
  const viewShotRef = useRef(null);

  // --- EFFECT: Load Project on Entry ---
  useEffect(() => {
    if (route.params?.project) {
      const { id, pathsData } = route.params.project;
      setProjectId(id);
      
      // Convert saved SVG strings back to Skia Path objects
      const loadedPaths = pathsData.map(p => ({
        ...p,
        path: Skia.Path.MakeFromSVGString(p.path),
      }));
      setPaths(loadedPaths || []);
    }
    // Mark as ready to prevent save-on-mount issues
    setIsReady(true);
  }, [route.params?.project]);

  // --- EFFECT: Save Project on Exit ---
  useEffect(() => {
    const saveAndExit = async () => {
      // Only save if the canvas has content and the screen is ready
      if (!isReady || paths.length === 0) return;

      try {
        const imageUri = await viewShotRef.current.capture();
        const permanentImageUri = `${FileSystem.documentDirectory}skia_${Date.now()}.png`;
        await FileSystem.moveAsync({ from: imageUri, to: permanentImageUri });

        // Convert Skia Paths to SVG strings for storage
        const serializablePaths = paths.map(p => ({
          ...p,
          path: p.path.toSVGString(),
        }));

        const projectData = {
          id: projectId || `proj-skia-${Date.now()}`,
          title: projectId ? route.params.project.title : `Design ${new Date().toLocaleTimeString()}`,
          type: 'Kaleidoscope',
          date: new Date().toISOString(),
          imageSource: { uri: permanentImageUri },
          pathsData: serializablePaths,
        };

        const existingProjectsJson = await AsyncStorage.getItem(PROJECTS_STORAGE_KEY);
        let projects = existingProjectsJson ? JSON.parse(existingProjectsJson) : [];

        if (projectId) {
          projects = projects.map(p => p.id === projectId ? projectData : p);
        } else {
          projects.unshift(projectData);
        }
        await AsyncStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
      } catch (error) {
        console.error("Failed to save project on exit:", error);
      }
    };

    const unsubscribe = navigation.addListener('beforeRemove', saveAndExit);
    return unsubscribe;
  }, [navigation, paths, projectId, isReady]);

  const toggleSidebar = () => {
      const toValue = isSidebarOpen ? 0 : 1;
      Animated.timing(sidebarAnimation, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setIsSidebarOpen(!isSidebarOpen);
    };

  const onLayout = useCallback((event) => {
    const { width, height } = event.nativeEvent.layout;
    setCanvasInfo({ width, height, center: { x: width / 2, y: height / 2 } });
  }, []);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      setUndonePaths([]);
      const { locationX: x, locationY: y } = evt.nativeEvent;
      setStartPoint({ x, y });
      if (drawingMode === 'doodle') {
        const newPath = Skia.Path.Make();
        newPath.moveTo(x, y);
        setCurrent(newPath);
      }
    },
    onPanResponderMove: (evt) => {
      if (!startPoint) return;
      const { locationX: x, locationY: y } = evt.nativeEvent;
      let newPath;
      const radius = Math.sqrt(Math.pow(x - startPoint.x, 2) + Math.pow(y - startPoint.y, 2));

      switch (drawingMode) {
        case 'doodle':
          newPath = current.copy();
          newPath.lineTo(x, y);
          break;
        case 'line':
          newPath = Skia.Path.Make();
          newPath.moveTo(startPoint.x, startPoint.y);
          newPath.lineTo(x, y);
          break;
        case 'circle':
          newPath = Skia.Path.Make();
          newPath.addCircle(startPoint.x, startPoint.y, radius);
          break;
        case 'triangle':
        case 'square':
        case 'hexagon':
          const sides = drawingMode === 'triangle' ? 3 : drawingMode === 'square' ? 4 : 6;
          newPath = createPolygonPath(startPoint, radius, sides);
          break;
        case 'star':
          newPath = createStarPath(startPoint, radius);
          break;
        case 'heart':
          newPath = createHeartPath(startPoint, radius * 2);
          break;
        case 'x-mark':
          newPath = createXPath(startPoint, radius * 2);
          break;
        default:
          newPath = current.copy();
          break;
      }
      setCurrent(newPath);
    },
    onPanResponderRelease: () => {
      if (!current.isEmpty()) {
        setPaths((prev) => [
          ...prev,
          { path: current, segments, color: currentColor, strokeWidth },
        ]);
      }
      setCurrent(Skia.Path.Make());
      setStartPoint(null);
    },
  });

  const handleUndo = () => {
    if (paths.length === 0) return;
    const lastPath = paths[paths.length - 1];
    setPaths(paths.slice(0, -1));
    setUndonePaths((prev) => [...prev, lastPath]);
  };

  const handleRedo = () => {
    if (undonePaths.length === 0) return;
    const lastUndonePath = undonePaths[undonePaths.length - 1];
    setUndonePaths(undonePaths.slice(0, -1));
    setPaths((prev) => [...prev, lastUndonePath]);
  };

  const handleClear = () => {
    Alert.alert("Clear Canvas", "Are you sure you want to erase everything?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", onPress: () => { setPaths([]); setUndonePaths([]); }, style: "destructive" },
    ]);
  };

  const captureAndGetUri = async () => {
    try {
      return await viewShotRef.current.capture();
    } catch (e) {
      console.error("Error capturing canvas", e);
      Alert.alert('Error', 'Failed to capture the drawing.');
      return null;
    }
  };

  const handleSave = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant media library permissions to save the image.');
      return;
    }
    const uri = await captureAndGetUri();
    if (uri) {
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Saved!', 'Your art has been saved to your photo gallery.');
    }
  };

  const handleShare = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert("Sharing is not available on your device.");
      return;
    }
    const uri = await captureAndGetUri();
    if (uri) {
      // For some platforms, adding 'file://' is necessary for sharing
      await Sharing.shareAsync('file://' + uri);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <UpperNavigation toggleSidebar={toggleSidebar} title={projectId ? "Edit Project" : "Kaleidoscope"} />
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} animation={sidebarAnimation} />

      <View style={styles.canvasContainer}>
          <DrawingCanvas
            viewShotRef={viewShotRef}
            onLayout={onLayout}
            panResponder={panResponder}
            canvasInfo={canvasInfo}
            paths={paths}
            currentPath={current}
            currentColor={currentColor}
            strokeWidth={strokeWidth}
            segments={segments}
          />
      </View>
      
      {!isPanelVisible && (
        <TouchableOpacity style={styles.fab} onPress={() => setIsPanelVisible(true)}>
          <Feather name="edit" size={24} color="#FFF" />
        </TouchableOpacity>
      )}

      {isPanelVisible && (
        <ControlPanel
          onSave={handleSave}
          onShare={handleShare}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onClear={handleClear}
          onHidePanel={() => setIsPanelVisible(false)}
          canUndo={paths.length > 0}
          canRedo={undonePaths.length > 0}
          canClear={paths.length > 0}
          activeTool={drawingMode}
          onToolChange={setDrawingMode}
          colors={COLORS}
          activeColor={currentColor}
          onColorChange={setCurrentColor}
          segments={segments}
          onSegmentsChange={setSegments}
          strokeWidth={strokeWidth}
          onStrokeWidthChange={setStrokeWidth}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: APP_BACKGROUND 
  },
  canvasContainer: { 
    flex: 1, 
    backgroundColor: CANVAS_BACKGROUND 
  },
  fab: { 
    position: 'absolute', 
    bottom: 30, 
    right: 30, 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    backgroundColor: '#007AFF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 4, 
    elevation: 8 
  },
});