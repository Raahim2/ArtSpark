import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert, Platform, ScrollView,  ActivityIndicator, Text  , Animated} from 'react-native';
import { useFonts } from 'expo-font';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

// Local Imports
import UpperNavigation from '../Components/Home/UpperNavigation';
import SideBar from '../Components/Home/SideBar';
import CustomColorPickerModal from '../Components/LogoGenerater/CustomColorPickerModal';
import { allMaterialCommunityIcons, ICONS_PER_PAGE, loadedFonts } from '../Components/LogoGenerater/constants';
import LogoPreview from '../Components/LogoGenerater/LogoPreview';
import EditorTabs from '../Components/LogoGenerater/EditorTabs';
import ClipartEditor from '../Components/LogoGenerater/ClipartEditor';
import TextEditor from '../Components/LogoGenerater/TextEditor';
import ImageEditor from '../Components/LogoGenerater/ImageEditor';
import SharedControls from '../Components/LogoGenerater/SharedControls';

const PROJECTS_STORAGE_KEY = '@creative_suite_projects';

const LogoGeneratorScreen = () => {
  // Navigation and Routing Hooks
  const navigation = useNavigation();
  const route = useRoute();
  
  // State Management
  const [projectId, setProjectId] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [activeTab, setActiveTab] = useState('Clipart');
  const [shape, setShape] = useState('Squircle');
  const [iconColor, setIconColor] = useState('#7C4DFF');
  const [padding, setPadding] = useState(25);
  const [logoText, setLogoText] = useState('Logo');
  const [logoImage, setLogoImage] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState('rocket-launch');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredIcons, setFilteredIcons] = useState([]);
  const [displayedIcons, setDisplayedIcons] = useState([]);
  const [iconPage, setIconPage] = useState(1);
  const [isLoadingIcons, setIsLoadingIcons] = useState(false);
  const [backgroundType, setBackgroundType] = useState('Color');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [gradientStart, setGradientStart] = useState('#8A2BE2');
  const [gradientEnd, setGradientEnd] = useState('#4682B4');
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [colorTarget, setColorTarget] = useState(null);
  const [fontSize, setFontSize] = useState(60);
  const [fontFamily, setFontFamily] = useState('Roboto');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarAnimation = useRef(new Animated.Value(0)).current;

  const viewShotRef = useRef();
  const [fontsLoaded] = useFonts(loadedFonts);

  // EFFECT: Load Project on Entry
  useEffect(() => {
    const passedProject = route.params?.project;
    if (passedProject && passedProject.type === 'Logo Design') {
      const { id, projectState } = passedProject;
      setProjectId(id);
      
      setActiveTab(projectState.activeTab);
      setShape(projectState.shape);
      setIconColor(projectState.iconColor);
      setPadding(projectState.padding);
      setLogoText(projectState.logoText);
      setLogoImage(projectState.logoImage);
      setSelectedIcon(projectState.selectedIcon);
      setBackgroundType(projectState.backgroundType);
      setBackgroundColor(projectState.backgroundColor);
      setGradientStart(projectState.gradientStart);
      setGradientEnd(projectState.gradientEnd);
      setFontSize(projectState.fontSize);
      setFontFamily(projectState.fontFamily);
    }
    setIsReady(true);
  }, [route.params?.project]);

  // EFFECT: Save Project on Exit
  useEffect(() => {
    const saveDraft = async () => {
      if (!isReady) return;
      if (logoText === 'Logo' && selectedIcon === 'rocket-launch' && !logoImage && !projectId) {
          return;
      }

      try {
        const imageUri = await viewShotRef.current.capture();
        const permanentImageUri = `${FileSystem.documentDirectory}logo_${Date.now()}.png`;
        await FileSystem.moveAsync({ from: imageUri, to: permanentImageUri });

        const projectState = {
          activeTab, shape, iconColor, padding, logoText, logoImage,
          selectedIcon, backgroundType, backgroundColor, gradientStart,
          gradientEnd, fontSize, fontFamily,
        };

        const projectData = {
          id: projectId || `proj-logo-${Date.now()}`,
          title: projectId ? route.params.project.title : `Logo: ${logoText.substring(0, 15)}`,
          type: 'Logo Design',
          date: new Date().toISOString(),
          imageSource: { uri: permanentImageUri },
          projectState: projectState,
        };

        const existingProjectsJson = await AsyncStorage.getItem(PROJECTS_STORAGE_KEY);
        let projects = existingProjectsJson ? JSON.parse(existingProjectsJson) : [];

        const existingIndex = projects.findIndex(p => p.id === projectData.id);
        if (existingIndex > -1) {
          projects[existingIndex] = projectData;
        } else {
          projects.unshift(projectData);
        }
        await AsyncStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
      } catch (error) {
        console.error("Failed to save logo draft on exit:", error);
      }
    };

    const unsubscribe = navigation.addListener('beforeRemove', saveDraft);
    return unsubscribe;
  }, [navigation, isReady, projectId, activeTab, shape, iconColor, padding, logoText, logoImage, selectedIcon, backgroundType, backgroundColor, gradientStart, gradientEnd, fontSize, fontFamily]);

  // Icon search effect
  useEffect(() => {
    const results = searchQuery 
      ? allMaterialCommunityIcons.filter(icon => icon.toLowerCase().includes(searchQuery.toLowerCase()))
      : allMaterialCommunityIcons;
    setFilteredIcons(results);
    setDisplayedIcons(results.slice(0, ICONS_PER_PAGE));
    setIconPage(1);
  }, [searchQuery]);

  
    const toggleSidebar = () => {
      const toValue = isSidebarOpen ? 0 : 1;
      Animated.timing(sidebarAnimation, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setIsSidebarOpen(!isSidebarOpen);
    };

  // Infinite scroll for icons
  const loadMoreIcons = useCallback(() => {
    if (isLoadingIcons || displayedIcons.length >= filteredIcons.length) return;
    setIsLoadingIcons(true);
    const nextPage = iconPage + 1;
    const newIcons = filteredIcons.slice(0, nextPage * ICONS_PER_PAGE);
    setDisplayedIcons(newIcons);
    setIconPage(nextPage);
    setIsLoadingIcons(false);
  }, [iconPage, isLoadingIcons, displayedIcons.length, filteredIcons.length]);

  // Handler Functions
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled) {
      setLogoImage(result.assets[0].uri);
      setActiveTab('Image');
    } else {
      Alert.alert("Notice", "You did not select any image.");
    }
  };
  
  const onSaveImageAsync = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need permission to save photos to your device.');
        return;
      }
    }
    try {
      const uri = await viewShotRef.current.capture();
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Success!', 'Your logo has been saved to your photo gallery.');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'There was an issue saving your logo.');
    }
  };
  
  const onShareImageAsync = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert('Unavailable', 'Sharing is not available on your platform.');
      return;
    }
    try {
      const uri = await viewShotRef.current.capture();
      await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Share your new logo!' });
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'There was an issue sharing your logo.');
    }
  };

  const openColorPicker = (target) => {
    setColorTarget(target);
    setPickerVisible(true);
  };

  const handleColorConfirm = (color) => {
    switch(colorTarget) {
      case 'icon': setIconColor(color); break;
      case 'background': setBackgroundColor(color); break;
      case 'gradientStart': setGradientStart(color); break;
      case 'gradientEnd': setGradientEnd(color); break;
    }
    setPickerVisible(false);
  };

  const getPickerInitialColor = () => {
    switch (colorTarget) {
        case 'icon': return iconColor;
        case 'background': return backgroundColor;
        case 'gradientStart': return gradientStart;
        case 'gradientEnd': return gradientEnd;
        default: return '#000000';
    }
  };

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C4DFF" />
        <Text style={styles.loadingText}>Loading Fonts...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <UpperNavigation toggleSidebar={toggleSidebar} title={projectId ? "Edit Logo" : "Logo Generator"} />
        <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} animation={sidebarAnimation} />

      
      <LogoPreview 
        viewShotRef={viewShotRef}
        backgroundType={backgroundType}
        gradientStart={gradientStart}
        gradientEnd={gradientEnd}
        backgroundColor={backgroundColor}
        shape={shape}
        padding={padding}
        activeTab={activeTab}
        selectedIcon={selectedIcon}
        iconColor={iconColor}
        logoText={logoText}
        fontFamily={fontFamily}
        fontSize={fontSize}
        logoImage={logoImage}
      />

      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.editor}>
          <EditorTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === 'Clipart' && (
            <ClipartEditor 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              displayedIcons={displayedIcons}
              setSelectedIcon={setSelectedIcon}
              loadMoreIcons={loadMoreIcons}
              isLoadingIcons={isLoadingIcons}
            />
          )}

          {activeTab === 'Text' && (
            <TextEditor 
              logoText={logoText}
              setLogoText={setLogoText}
              fontSize={fontSize}
              setFontSize={setFontSize}
              fontFamily={fontFamily}
              setFontFamily={setFontFamily}
            />
          )}

          {activeTab === 'Image' && <ImageEditor onPickImage={pickImageAsync} />}
          
          <SharedControls
            iconColor={iconColor}
            openColorPicker={openColorPicker}
            padding={padding}
            setPadding={setPadding}
            backgroundType={backgroundType}
            setBackgroundType={setBackgroundType}
            backgroundColor={backgroundColor}
            gradientStart={gradientStart}
            gradientEnd={gradientEnd}
            shape={shape}
            setShape={setShape}
            onSave={onSaveImageAsync}
            onShare={onShareImageAsync}
          />
        </View>
      </ScrollView>

      <CustomColorPickerModal 
        visible={isPickerVisible} 
        initialColor={getPickerInitialColor()} 
        onClose={() => setPickerVisible(false)} 
        onConfirm={handleColorConfirm}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  editor: { 
    padding: 16 
  },
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 10
  }
});

export default LogoGeneratorScreen;