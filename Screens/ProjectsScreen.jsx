// src/screens/ProjectsScreen.jsx

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, View, Animated, Text, Alert, FlatList, TouchableOpacity } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BottomNavigation from '../Components/Home/BottomNavigation';
import UpperNavigation from '../Components/Home/UpperNavigation';
import SideBar from '../Components/Home/SideBar';
import SearchBar from '../Components/Projects/SearchBar';
import FilterBar from '../Components/Projects/FilterBar';
import ProjectItem from '../Components/Projects/ProjectItem'; // Your new, upgraded component
import { SafeAreaView } from 'react-native-safe-area-context';

const PROJECTS_STORAGE_KEY = '@creative_suite_projects';
const APP_BACKGROUND = '#F0F2F5';

export default function ProjectsScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarAnimation = useRef(new Animated.Value(0)).current;

  // --- All State Management ---
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDateFilter, setActiveDateFilter] = useState('Any Time');

  // --- Central Filtering Logic ---
  useEffect(() => {
    let result = [...projects];
    if (searchQuery) {
      result = result.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (activeCategory !== 'All') {
      result = result.filter(p => p.type === activeCategory);
    }
    if (activeDateFilter !== 'Any Time') {
      const now = new Date();
      result = result.filter(p => {
        const projectDate = new Date(p.date);
        if (activeDateFilter === 'Today') return projectDate.toDateString() === now.toDateString();
        if (activeDateFilter === 'This Week') {
          const lastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
          return projectDate >= lastWeek;
        }
        if (activeDateFilter === 'Last 30 Days') {
          const lastMonth = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
          return projectDate >= lastMonth;
        }
        return true;
      });
    }
    setFilteredProjects(result);
  }, [searchQuery, activeCategory, activeDateFilter, projects]);

  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const projectsJson = await AsyncStorage.getItem(PROJECTS_STORAGE_KEY);
      const savedProjects = projectsJson ? JSON.parse(projectsJson) : [];
      setProjects(savedProjects);
    } catch (error) { Alert.alert("Error", "Could not load projects."); } 
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => {
    if (isFocused) {
      setIsSelectionMode(false);
      setSelectedProjects([]);
      loadProjects();
    }
  }, [isFocused, loadProjects]);

  // --- ALL HANDLER FUNCTIONS ---
  const toggleSidebar = () => {
    if (isSelectionMode) return;
    Animated.timing(sidebarAnimation, { toValue: isSidebarOpen ? 0 : 1, duration: 300, useNativeDriver: false }).start(() => setIsSidebarOpen(!isSidebarOpen));
  };
  
  const handleEnterSelectionMode = (projectId) => {
    setIsSelectionMode(true);
    setSelectedProjects([projectId]);
  };

  const handleToggleSelection = (projectId) => {
    const newSelection = selectedProjects.includes(projectId)
      ? selectedProjects.filter(id => id !== projectId)
      : [...selectedProjects, projectId];
    setSelectedProjects(newSelection);
    if (newSelection.length === 0) setIsSelectionMode(false);
  };

  const handleCancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedProjects([]);
  };

  const handleDeleteSelected = () => {
    if (selectedProjects.length === 0) return;
    Alert.alert(`Delete ${selectedProjects.length} Project(s)`, "Are you sure? This action cannot be undone.",
      [{ text: "Cancel", style: "cancel" }, { text: "Delete", style: "destructive", onPress: async () => {
        const remainingProjects = projects.filter(p => !selectedProjects.includes(p.id));
        try {
          await AsyncStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(remainingProjects));
          setProjects(remainingProjects);
          handleCancelSelection();
        } catch (error) { Alert.alert("Error", "Failed to delete projects."); }
      }}]);
  };
  
  const handleProjectPress = (project) => {
    if (isSelectionMode) {
      handleToggleSelection(project.id);
    } else {
      if (project.type === 'Pixel Art') navigation.navigate('PixelArt', { project });
      else if (project.type === 'Kaleidoscope') navigation.navigate('KaleidoscopeCanvas', { project });
      else if (project.type === 'Logo Design') navigation.navigate('LogoGenerator', { project });
      else if (project.type === 'Mockup') navigation.navigate('MockUp', { project });
      else Alert.alert("Unknown Project", "Could not determine the project type to open.");
    }
  };

  const handleAddNewProject = () => {
    navigation.navigate('KaleidoscopeCanvas', {});
  };

  return (
      <SafeAreaView style={styles.safeArea}>
        <UpperNavigation 
          title={"Projects"} 
          toggleSidebar={toggleSidebar}
          isSelectionMode={isSelectionMode}
          selectionCount={selectedProjects.length}
          onCancelSelection={handleCancelSelection}
          onDeleteSelection={handleDeleteSelected}
        />
        <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} animation={sidebarAnimation}/>
        
        <View style={styles.controlsContainer}>
            <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />
            <FilterBar 
                activeCategory={activeCategory} 
                onCategoryChange={setActiveCategory}
                activeDateFilter={activeDateFilter}
                onDateFilterChange={setActiveDateFilter}
            />
        </View>

        {isLoading ? (
          <View style={styles.centered}><Text style={styles.infoText}>Loading projects...</Text></View>
        ) : (
          <FlatList
            data={filteredProjects}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
            // renderItem is now clean and passes the correct props
            renderItem={({ item }) => (
              <ProjectItem
                project={item}
                onPress={handleProjectPress}
                onLongPress={handleEnterSelectionMode}
                isSelectionMode={isSelectionMode}
                isSelected={selectedProjects.includes(item.id)}
              />
            )}
            ListEmptyComponent={() => (
              <View style={styles.centered}>
                <Text style={styles.infoText}>No Projects Found</Text>
                { (searchQuery || activeCategory !== 'All' || activeDateFilter !== 'Any Time') && 
                  <Text style={styles.infoSubText}>Try adjusting your search or filters.</Text>
                }
                { !(searchQuery || activeCategory !== 'All' || activeDateFilter !== 'Any Time') && projects.length === 0 &&
                  <TouchableOpacity style={styles.createButton} onPress={handleAddNewProject}>
                    <Text style={styles.createButtonText}>Create Your First Project</Text>
                  </TouchableOpacity>
                }
              </View>
            )}
          />
        )}
        <BottomNavigation target={"Projects"}/>
      </SafeAreaView>      
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: APP_BACKGROUND },
  controlsContainer: {
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: APP_BACKGROUND,
  },
  listContainer: {
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: -50,
  },
  infoText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A5568',
    textAlign: 'center',
  },
  infoSubText: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginTop: 8,
  },
  createButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});