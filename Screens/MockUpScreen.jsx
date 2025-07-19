import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, ScrollView, Alert, View , Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

// Local Component Imports
import UpperNavigation from '../Components/Home/UpperNavigation.jsx';
import SideBar from '../Components/Home/SideBar';
import CustomColorPickerModal from '../Components/LogoGenerater/CustomColorPickerModal.jsx';

// Refactored Component Imports
import { MOCKUPS, PATTERNS, generateRandomColor } from '../Components/MockUp/constants.jsx';
import MockupPreview from '../Components/MockUp/MockupPreview';
import ActionButtons from '../Components/MockUp/ActionButtons';
import FillTypeSelector from '../Components/MockUp/FillTypeSelector';
import MockupSelector from '../Components/MockUp/MockupSelector';
import ColorControls from '../Components/MockUp/ColorControls';
import PatternControls from '../Components/MockUp/PatternControls';
import UploadControls from '../Components/MockUp/UploadControls';

// Use the same storage key as your other screens
const PROJECTS_STORAGE_KEY = '@creative_suite_projects';

const MockUpScreen = () => {
    const viewShotRef = useRef(null);
    const route = useRoute();
    const navigation = useNavigation();

    // State
    const [projectId, setProjectId] = useState(null);
    const [isReady, setIsReady] = useState(false); // Prevents saving on initial load

    const [selectedMockup, setSelectedMockup] = useState(MOCKUPS[0]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
      const sidebarAnimation = useRef(new Animated.Value(0)).current;
    const [fillType, setFillType] = useState('color');
    const [uploadedImageUri, setUploadedImageUri] = useState(null);
    const [solidColor, setSolidColor] = useState('#3B82F6');
    const [patternProps, setPatternProps] = useState({
        id: PATTERNS[0]?.id,
        color1: '#000000ff',
        color2: '#ffffffff',
        scale: 1,
        strokeWidth: 1,
    });
    
    // Color Picker Modal State
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [colorPickerTarget, setColorPickerTarget] = useState(null);
    const [pickerInitialColor, setPickerInitialColor] = useState('#000000');

    // EFFECT: Load project data if editing
    useEffect(() => {
        if (route.params?.project) {
            const { id, projectData } = route.params.project;
            setProjectId(id);

            if (projectData) {
                const mockupToLoad = MOCKUPS.find(m => m.id === projectData.selectedMockupId) || MOCKUPS[0];
                setSelectedMockup(mockupToLoad);
                setFillType(projectData.fillType || 'color');
                setUploadedImageUri(projectData.uploadedImageUri || null);
                setSolidColor(projectData.solidColor || '#3B82F6');
                setPatternProps(projectData.patternProps || { id: PATTERNS[0]?.id, color1: '#000', color2: '#fff', scale: 1, strokeWidth: 1 });
            }
        }
        // Once initial state is set, we are ready.
        setIsReady(true);
    }, [route.params?.project]);

    // EFFECT: Save Project on Exit
    useEffect(() => {
        const autoSaveOnExit = async () => {
            if (!isReady || !viewShotRef.current) {
                return;
            }

            // Smart save: only save if not the default state or if it's an existing project
            const isDefaultState = !projectId &&
                                   selectedMockup.id === MOCKUPS[0].id &&
                                   fillType === 'color' &&
                                   solidColor === '#3B82F6' &&
                                   !uploadedImageUri;

            if (isDefaultState) {
                return; // Nothing meaningful changed, so don't create a new project
            }

            try {
                const thumbnailUri = await viewShotRef.current.capture();
                const permanentImageUri = `${FileSystem.documentDirectory}mockup_${Date.now()}.png`;
                await FileSystem.moveAsync({ from: thumbnailUri, to: permanentImageUri });

                const draftData = {
                    id: projectId || `proj-mockup-${Date.now()}`,
                    title: projectId ? route.params.project.title : `Mockup ${new Date().toLocaleDateString()}`,
                    type: 'Mockup',
                    date: new Date().toISOString(),
                    imageSource: { uri: permanentImageUri },
                    projectData: {
                        selectedMockupId: selectedMockup.id,
                        fillType,
                        uploadedImageUri,
                        solidColor,
                        patternProps,
                    },
                };

                const existingProjectsJson = await AsyncStorage.getItem(PROJECTS_STORAGE_KEY);
                let projects = existingProjectsJson ? JSON.parse(existingProjectsJson) : [];

                if (projectId) {
                    projects = projects.map(p => (p.id === projectId ? draftData : p));
                } else {
                    projects.unshift(draftData);
                }

                await AsyncStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
            } catch (error) {
                console.error("Failed to auto-save draft:", error);
            }
        };

        const unsubscribe = navigation.addListener('beforeRemove', autoSaveOnExit);
        return unsubscribe;

    }, [navigation, isReady, projectId, selectedMockup, fillType, solidColor, patternProps, uploadedImageUri]);
    
    const toggleSidebar = () => {
        const toValue = isSidebarOpen ? 0 : 1;
        Animated.timing(sidebarAnimation, {
          toValue,
          duration: 300,
          useNativeDriver: false,
        }).start();
        setIsSidebarOpen(!isSidebarOpen);
      };

    // Handlers
    const openColorPicker = (target, initialColor) => {
        setColorPickerTarget(target);
        setPickerInitialColor(initialColor);
        setPickerVisible(true);
    };

    const handleColorConfirm = (color) => {
        if (colorPickerTarget === 'solid') setSolidColor(color);
        if (colorPickerTarget === 'patternColor1') setPatternProps(prev => ({ ...prev, color1: color }));
        if (colorPickerTarget === 'patternColor2') setPatternProps(prev => ({ ...prev, color2: color }));
        setPickerVisible(false);
    };

    const handleRandomColor = (target) => {
        const newColor = generateRandomColor();
        if (target === 'solid') setSolidColor(newColor);
        if (target === 'patternColor1') setPatternProps(prev => ({ ...prev, color1: newColor }));
        if (target === 'patternColor2') setPatternProps(prev => ({ ...prev, color2: newColor }));
    };

    const handleChoosePhoto = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions!');
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 1,
        });
        if (!result.canceled) {
            setUploadedImageUri(result.assets[0].uri);
            setFillType('upload');
        }
    };

    const handleDownload = async () => {
        try {
            const uri = await viewShotRef.current.capture();
            await MediaLibrary.saveToLibraryAsync(uri);
            Alert.alert('Success!', 'Your mockup has been saved to your photos.');
        } catch (error) { Alert.alert('Error', 'Could not save the image.'); }
    };

    const handleShare = async () => {
        try {
            const uri = await viewShotRef.current.capture();
            if (!(await Sharing.isAvailableAsync())) {
                Alert.alert('Sharing not available on this device.');
                return;
            }
            await Sharing.shareAsync(uri);
        } catch (error) { Alert.alert('Error', 'Could not share the image.'); }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <UpperNavigation toggleSidebar={toggleSidebar} title={projectId ? "Edit Mockup" : "Mockup Generator"} />
        <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} animation={sidebarAnimation} />

            <View style={styles.container}>
                <MockupPreview
                    ref={viewShotRef}
                    selectedMockup={selectedMockup}
                    fillType={fillType}
                    solidColor={solidColor}
                    uploadedImageUri={uploadedImageUri}
                    patternProps={patternProps}
                />

                <ActionButtons 
                    onDownload={handleDownload} 
                    onShare={handleShare} 
                />

                <ScrollView style={styles.controlsContainer} showsVerticalScrollIndicator={false}>
                    <FillTypeSelector selectedType={fillType} onSelectType={setFillType} />
                    
                    <MockupSelector selectedMockup={selectedMockup} onSelectMockup={setSelectedMockup} />

                    {fillType === 'color' && (
                        <ColorControls 
                            color={solidColor}
                            onColorChangePress={() => openColorPicker('solid', solidColor)}
                            onRandomPress={() => handleRandomColor('solid')}
                        />
                    )}

                    {fillType === 'pattern' && (
                        <PatternControls
                            patternProps={patternProps}
                            onSelectPattern={(id) => setPatternProps(prev => ({ ...prev, id }))}
                            onPatternPropChange={(prop, value) => setPatternProps(prev => ({ ...prev, [prop]: value }))}
                            onOpenColorPicker={openColorPicker}
                            onRandomColor={handleRandomColor}
                        />
                    )}

                    {fillType === 'upload' && (
                        <UploadControls onChoosePhoto={handleChoosePhoto} uploadedImageUri={uploadedImageUri} />
                    )}
                </ScrollView>
            </View>

            <CustomColorPickerModal 
                visible={isPickerVisible} 
                onClose={() => setPickerVisible(false)} 
                initialColor={pickerInitialColor} 
                onConfirm={handleColorConfirm} 
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
    container: { flex: 1, alignItems: 'center' },
    controlsContainer: { flex: 1, width: '100%', paddingHorizontal: 20, backgroundColor: '#FFFFFF' },
});

export default MockUpScreen;