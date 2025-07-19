// PixelArtScreen.js
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, PanResponder, Alert, TouchableOpacity , Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Canvas, Rect } from '@shopify/react-native-skia';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Local Imports
import UpperNavigation from '../Components/Home/UpperNavigation';
import SideBar from '../Components/Home/SideBar';
import PixelArtControlPanel from '../Components/PixcelArt/PixelArtControlPanel';
import CheckerboardBackground from '../Components/PixcelArt/CheckerboardBackground';
import { createEmptyGrid, bresenhamLine, floodFill, GRID_SIZE } from '../Components/PixcelArt/utils';

const PROJECTS_STORAGE_KEY = '@creative_suite_projects';
const PREDEFINED_COLORS = ['#000000', '#FFFFFF', '#EF4444', '#F97316', '#FACC15', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899'];
const APP_BACKGROUND = '#F0F0F0';

export default function PixelArtScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const [grid, setGrid] = useState(createEmptyGrid);
  const [previewGrid, setPreviewGrid] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [activeTool, setActiveTool] = useState('draw');
  const [currentColor, setCurrentColor] = useState(PREDEFINED_COLORS[0]);
  const [colorPalette, setColorPalette] = useState(PREDEFINED_COLORS);
  const [mirrorMode, setMirrorMode] = useState('none');
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [canvasLayout, setCanvasLayout] = useState({ width: 0, height: 0, cellSize: 0 });
  const [isReady, setIsReady] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarAnimation = useRef(new Animated.Value(0)).current;

  const viewShotRef = useRef(null);
  const lastPaintedCell = useRef(null);

  // --- Effects ---
  useEffect(() => {
    if (route.params?.project) {
      const { id, gridData } = route.params.project;
      setProjectId(id);
      if (Array.isArray(gridData) && gridData.length > 0) {
        setGrid(gridData);
      } else {
        setGrid(createEmptyGrid());
      }
    }
    setIsReady(true);
  }, [route.params?.project]);

  useEffect(() => {
    const saveAndExit = async () => {
      const hasContent = grid.some(row => row.some(cell => cell !== null));
      if (!isReady || !hasContent) return;
      try {
        const imageUri = await viewShotRef.current.capture();
        const permanentImageUri = `${FileSystem.documentDirectory}pixel_${Date.now()}.png`;
        await FileSystem.moveAsync({ from: imageUri, to: permanentImageUri });
        const projectData = {
          id: projectId || `proj-pixel-${Date.now()}`,
          title: projectId ? route.params.project.title : `Pixel Art ${new Date().toLocaleTimeString()}`,
          type: 'Pixel Art',
          date: new Date().toISOString(),
          imageSource: { uri: permanentImageUri },
          gridData: grid,
        };
        const existingProjectsJson = await AsyncStorage.getItem(PROJECTS_STORAGE_KEY);
        let projects = existingProjectsJson ? JSON.parse(existingProjectsJson) : [];
        if (projectId) {
          projects = projects.map(p => p.id === projectId ? projectData : p);
        } else {
          projects.unshift(projectData);
        }
        await AsyncStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
      } catch (error) { console.error("Failed to save pixel art project:", error); }
    };
    const unsubscribe = navigation.addListener('beforeRemove', saveAndExit);
    return unsubscribe;
  }, [navigation, grid, projectId, isReady, route.params?.project?.title]);

  const toggleSidebar = () => {
      const toValue = isSidebarOpen ? 0 : 1;
      Animated.timing(sidebarAnimation, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setIsSidebarOpen(!isSidebarOpen);
    };

  // --- Handlers ---
  const onCanvasLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    const size = Math.min(width, height);
    setCanvasLayout({ width: size, height: size, cellSize: size / GRID_SIZE });
  };
  
  const drawPixelWithMirror = (tempGrid, row, col, color) => {
    const draw = (r, c) => { if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) tempGrid[r][c] = color; };
    draw(row, col);
    const mid = GRID_SIZE - 1;
    if (mirrorMode === 'x' || mirrorMode === 'xy') draw(row, mid - col);
    if (mirrorMode === 'y' || mirrorMode === 'xy') draw(mid - row, col);
    if (mirrorMode === 'xy') draw(mid - row, mid - col);
  };
  
  const drawSquareOutline = (grid, x0, y0, x1, y1, color) => {
    bresenhamLine(x0, y0, x1, y0).forEach(p => drawPixelWithMirror(grid, p.y, p.x, color));
    bresenhamLine(x0, y0, x0, y1).forEach(p => drawPixelWithMirror(grid, p.y, p.x, color));
    bresenhamLine(x1, y0, x1, y1).forEach(p => drawPixelWithMirror(grid, p.y, p.x, color));
    bresenhamLine(x0, y1, x1, y1).forEach(p => drawPixelWithMirror(grid, p.y, p.x, color));
  };
  
  const drawCircleOutline = (grid, xC, yC, x1, y1, color) => {
    const radius = Math.round(Math.sqrt(Math.pow(x1 - xC, 2) + Math.pow(y1 - yC, 2)));
    let x = radius, y = 0, err = 1 - radius;
    while(x >= y) {
      drawPixelWithMirror(grid, yC + y, xC + x, color); drawPixelWithMirror(grid, yC + x, xC + y, color);
      drawPixelWithMirror(grid, yC - y, xC + x, color); drawPixelWithMirror(grid, yC - x, xC + y, color);
      drawPixelWithMirror(grid, yC - y, xC - x, color); drawPixelWithMirror(grid, yC - x, xC - y, color);
      drawPixelWithMirror(grid, yC + y, xC - x, color); drawPixelWithMirror(grid, yC + x, xC - y, color);
      y++; if (err < 0) err += 2 * y + 1; else { x--; err += 2 * (y - x) + 1; }
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      const col = Math.floor(locationX / canvasLayout.cellSize);
      const row = Math.floor(locationY / canvasLayout.cellSize);
      if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) return;
      setUndoStack(prev => [...prev, grid]); setRedoStack([]);
      switch (activeTool) {
        case 'draw': case 'erase':
          const newGrid = grid.map(r => [...r]);
          drawPixelWithMirror(newGrid, row, col, activeTool === 'draw' ? currentColor : null);
          setGrid(newGrid); lastPaintedCell.current = `${row}-${col}`; break;
        case 'line': case 'square': case 'circle': setStartPoint({ row, col }); break;
        case 'fill': setGrid(floodFill(grid, row, col, currentColor)); break;
      }
    },
    onPanResponderMove: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      const col = Math.floor(locationX / canvasLayout.cellSize);
      const row = Math.floor(locationY / canvasLayout.cellSize);
      if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) return;
      if (lastPaintedCell.current === `${row}-${col}`) return;
      switch (activeTool) {
        case 'draw': case 'erase':
          const newGrid = grid.map(r => [...r]);
          drawPixelWithMirror(newGrid, row, col, activeTool === 'draw' ? currentColor : null);
          setGrid(newGrid); lastPaintedCell.current = `${row}-${col}`; break;
        case 'line': case 'square': case 'circle':
          if (startPoint) {
            const tempGrid = grid.map(r => [...r]);
            if (activeTool === 'line') bresenhamLine(startPoint.col, startPoint.row, col, row).forEach(p => drawPixelWithMirror(tempGrid, p.y, p.x, currentColor));
            else if (activeTool === 'square') drawSquareOutline(tempGrid, startPoint.col, startPoint.row, col, row, currentColor);
            else if (activeTool === 'circle') drawCircleOutline(tempGrid, startPoint.col, startPoint.row, col, row, currentColor);
            setPreviewGrid(tempGrid);
          } break;
      }
    },
    onPanResponderRelease: () => {
      switch (activeTool) {
        case 'line': case 'square': case 'circle':
          if (previewGrid) { setGrid(previewGrid); setPreviewGrid(null); }
          setStartPoint(null); break;
      }
      lastPaintedCell.current = null;
    },
  });

  const handleColorChange = (newColor) => {
    setCurrentColor(newColor);
    if (!colorPalette.includes(newColor)) setColorPalette(prev => [...prev, newColor]);
  };
  
  const handleStickerSelect = (stickerGrid) => {
    Alert.alert("Load Sticker", "This will replace your current drawing. Are you sure?",
      [{ text: "Cancel", style: "cancel" }, { text: "Load", onPress: () => { setGrid(stickerGrid); setUndoStack([]); setRedoStack([]); }}]);
  };

  const handleUndo = () => { if (undoStack.length === 0) return; const lastState = undoStack[undoStack.length - 1]; setRedoStack(prev => [grid, ...prev]); setUndoStack(undoStack.slice(0, -1)); setGrid(lastState); };
  const handleRedo = () => { if (redoStack.length === 0) return; const nextState = redoStack[0]; setUndoStack(prev => [...prev, grid]); setRedoStack(redoStack.slice(1)); setGrid(nextState); };
  const handleClear = () => { Alert.alert("Clear Canvas", "Are you sure?", [{ text: "Cancel" }, { text: "Clear", onPress: () => { setGrid(createEmptyGrid()); setUndoStack([]); setRedoStack([]); }}]); };
  const handleSave = async () => { try { const { status } = await MediaLibrary.requestPermissionsAsync(); if (status !== 'granted') { Alert.alert('Permission Denied'); return; } const uri = await viewShotRef.current.capture(); await MediaLibrary.saveToLibraryAsync(uri); Alert.alert('Saved!'); } catch(e) { console.error(e); }};
  const handleShare = async () => { try { if (!(await Sharing.isAvailableAsync())) { Alert.alert("Sharing not available"); return; } const uri = await viewShotRef.current.capture(); await Sharing.shareAsync(uri); } catch(e) { console.error(e); } };

  const displayGrid = previewGrid || grid;

  return (
    <SafeAreaView style={styles.safeArea}>
      <UpperNavigation toggleSidebar={toggleSidebar} title={projectId ? "Edit Pixel Art" : "Pixel Art"} />
        <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} animation={sidebarAnimation} />

      <View style={styles.canvasContainer} onLayout={onCanvasLayout}>
        <ViewShot ref={viewShotRef} style={{ width: canvasLayout.width, height: canvasLayout.height }} options={{ format: 'png', quality: 1.0, result: 'tmpfile' }}>
          <Canvas style={{ width: canvasLayout.width, height: canvasLayout.height }} {...panResponder.panHandlers}>
            <CheckerboardBackground layout={canvasLayout} />
            {displayGrid.map((row, r) =>
              row.map((color, c) => color ? <Rect key={`${r}-${c}`} x={c * canvasLayout.cellSize} y={r * canvasLayout.cellSize} width={canvasLayout.cellSize} height={canvasLayout.cellSize} color={color} /> : null)
            )}
          </Canvas>
        </ViewShot>
      </View>

      {!isPanelVisible && ( <TouchableOpacity style={styles.fab} onPress={() => setIsPanelVisible(true)}><Feather name="edit" size={24} color="#FFF" /></TouchableOpacity> )}
      {isPanelVisible && (
        <PixelArtControlPanel
          onSave={handleSave} onShare={handleShare} onUndo={handleUndo} onRedo={handleRedo}
          onClear={handleClear} onHidePanel={() => setIsPanelVisible(false)} canUndo={undoStack.length > 0}
          canRedo={redoStack.length > 0} 
          onStickerSelect={handleStickerSelect}
          activeTool={activeTool} onToolChange={setActiveTool}
          colors={colorPalette} activeColor={currentColor} onColorChange={handleColorChange}
          mirrorMode={mirrorMode} onMirrorModeChange={setMirrorMode}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: APP_BACKGROUND },
  canvasContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10 },
  fab: { position: 'absolute', bottom: 30, right: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', elevation: 8 },
});