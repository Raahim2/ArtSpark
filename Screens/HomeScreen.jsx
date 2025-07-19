// src/screens/HomeScreen.jsx

import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Animated, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';

// Your App's Components
import BottomNavigation from '../Components/Home/BottomNavigation';
import UpperNavigation from '../Components/Home/UpperNavigation';
import SideBar from '../Components/Home/SideBar';
import WhatsNew from '../Components/Home/WhatsNew';
import Icon from '../Components/Home/Icon';
import SuggestionPrompt from '../Components/Home/SuggestionPrompt';
import ProjectItem from '../Components/Projects/ProjectItem'; // Import your new, robust ProjectItem
import { useColorContext } from '../assets/Variables/colors';

const PROJECTS_STORAGE_KEY = '@creative_suite_projects';

export default function HomeScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarAnimation = useRef(new Animated.Value(0)).current;
  const [colors] = useColorContext();
  const styles = createStyles(colors);

  const [recentProjects, setRecentProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecentProjects = async () => {
      if (isFocused) {
        setIsLoading(true);
        try {
          const projectsJson = await AsyncStorage.getItem(PROJECTS_STORAGE_KEY);
          const allProjects = projectsJson ? JSON.parse(projectsJson) : [];
          // The most recent projects are at the beginning of the array
          setRecentProjects(allProjects.slice(0, 5));
        } catch (error) {
          console.error("Failed to load recent projects for home screen:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadRecentProjects();
  }, [isFocused]);

  const toggleSidebar = () => {
    const toValue = isSidebarOpen ? 0 : 1;
    Animated.timing(sidebarAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleProjectPress = (project) => {
    if (project.type === 'Pixel Art') {
      navigation.navigate('PixelArt', { project });
    } else if (project.type === 'Kaleidoscope') {
      navigation.navigate('KaleidoscopeCanvas', { project });
    } else if (project.type === 'Logo Design') {
      navigation.navigate('LogoGenerator', { project });
    } else if (project.type === 'Mockup') {
      navigation.navigate('MockUp', { project });
    } else {
      Alert.alert("Unknown Project", "Could not determine the project type to open.");
    }
  };
  
  const handleAddNewProject = () => {
    navigation.navigate('KaleidoscopeCanvas', {}); 
  };

  return (
      <SafeAreaView style={styles.container}>
        <UpperNavigation toggleSidebar={toggleSidebar} title={"Home"} />
        <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} animation={sidebarAnimation} />

        <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
          <WhatsNew />

          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 }}>
            <TouchableOpacity onPress={handleAddNewProject}>
              <Icon iconName="color-palette-outline" label="Kaleidoscope" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('PixelArt')}>
              <Icon iconName="grid" label="Pixel Art" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('LogoGenerator')}>
              <Icon iconName="layers-outline" label="Logo Maker" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('MockUp')}>
              <Icon iconName="phone-portrait-outline" label="MockUp" />
            </TouchableOpacity>
          </View>

          <SuggestionPrompt />

          <View style={styles.recentProjectsSection}>
            <View style={styles.recentProjectsHeader}>
              <Text style={styles.recentProjectsTitle}>Recent Projects</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Projects')}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollView}>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.theme} />
                </View>
              ) : (
                <>
                  <TouchableOpacity style={styles.addButton} onPress={handleAddNewProject}>
                    <Feather name="plus" size={40} color={colors.text} />
                    <Text style={{color: colors.text}}>New Drawing</Text>
                  </TouchableOpacity>

                  {/* THIS IS THE FIX: We map over recentProjects and render a ProjectItem for each one */}
                  {recentProjects.map(project => (
                    // The key is now on the wrapper View
                    <View key={project.id} style={{ width: 170 }}>
                      <ProjectItem
                        project={project}
                        onPress={handleProjectPress}
                        // For home screen, long press does nothing.
                        onLongPress={() => {}} 
                        // Selection mode is always off on the home screen.
                        isSelectionMode={false}
                        isSelected={false}
                      />
                    </View>
                  ))}
                </>
              )}
            </ScrollView>
          </View>

          <View style={{ marginBottom: 100 }} />
        </ScrollView>
      
      <BottomNavigation target={'Home'}/>
      </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  horizontalScrollView: {
    paddingVertical: 10,
    paddingLeft: 10,
  },
  recentProjectsSection: {
    marginVertical: 20,
  },
  recentProjectsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  recentProjectsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  seeAll: {
    fontSize: 14,
    color: colors.theme,
    fontWeight: '600',
  },
  addButton: {
    height: 180,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 8,
    backgroundColor: colors.lightBackground,
  },
  loadingContainer: {
    width: 170, 
    height: 180, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  Title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
});