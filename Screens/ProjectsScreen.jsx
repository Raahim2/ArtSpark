import { StyleSheet, View, Text, Animated, StatusBar, FlatList, TextInput, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState, useRef } from 'react'
import BottomNavigation from '../Components/BottomNavigation'
import UpperNavigation from '../Components/UpperNavigation'
import SideBar from '../Components/SideBar'
import { useColorContext } from '../assets/Variables/colors';
import { Ionicons } from '@expo/vector-icons';
import Thumbnail from '../Components/Thumbnail';

export default function ProjectsScreen() {
  const [colors] = useColorContext();
  const styles = createStyles(colors);

  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState([
    { id: '1', name: 'Project 1', status: 'In Progress', deadline: '2022-12-31' },
    { id: '2', name: 'Project 2', status: 'Completed', deadline: '2022-11-30' },
    // Add more projects here
  ]);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProject = ({ item }) => (
    <View style={styles.projectCard}>
      <Text style={styles.projectName}>{item.name}</Text>
      <Text style={styles.projectStatus}>{item.status}</Text>
      <Text style={styles.projectDeadline}>Deadline: {item.deadline}</Text>
    </View>
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarAnimation = useRef(new Animated.Value(0)).current;

  const toggleSidebar = () => {
    const toValue = isSidebarOpen ? 0 : 1;
    Animated.timing(sidebarAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <UpperNavigation toggleSidebar={toggleSidebar} title={"Projects"} />

      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} animation={sidebarAnimation} />


      <View style={styles.container}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search projects..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <FlatList
          data={filteredProjects}
          renderItem={renderProject}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.projectList}
        />
        
      </View>
      <BottomNavigation target={"Projects"} />
    </>
  )
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 10,
  },
  searchBar: {
    height: 40,
    borderColor: colors.theme,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  projectList: {
    paddingBottom: 80, // To ensure the FAB doesn't cover the last item
  },
  projectCard: {
    backgroundColor: colors.cardBackground,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.theme,
  },
  projectStatus: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  projectDeadline: {
    fontSize: 12,
    color: colors.textSecondary,
  },
})
