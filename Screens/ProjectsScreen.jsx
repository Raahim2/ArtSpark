import { StyleSheet, View, Animated } from 'react-native'
import React, { useState, useRef , useEffect } from 'react'
import { useColorContext } from '../assets/Variables/colors';
import BottomNavigation from '../Components/BottomNavigation'
import UpperNavigation from '../Components/UpperNavigation'
import SideBar from '../Components/SideBar'
import Projects from '../Components/Projects';
import SearchBar from '../Components/SearchBar';
import FilterBar from '../Components/FilterBar';
import { GENTUBE_API_KEY } from '@env';

export default function ProjectsScreen() {
  const [colors] = useColorContext();
  const styles = createStyles(colors);
  const [filteredProjects, setFilteredProjects] = useState([]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarAnimation = useRef(new Animated.Value(0)).current;

  

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = 'https://gentube.vercel.app';  

  const fetchProjects = async () => {
    setLoading(true); 

    try {
      const response = await fetch(`${apiUrl}/MongoDB/GetProjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': GENTUBE_API_KEY,
        },
        body: JSON.stringify({})  
      });
      

      if (!response.ok) {
        const errorMessage = await response.text();
        setError(`Error Fetching Projects: ${errorMessage}`); // Set error state
        setLoading(false); 
        return;
      }

      const responseData = await response.json();
      setProjects(responseData);
      setFilteredProjects(responseData);
      setLoading(false);  // Set loading to false after successful request

    } catch (error) {
      setError(`Error: ${error.message}`);  // Update error state if there's an exception
      setLoading(false); // Set loading to false
    }
  };

  useEffect(() => {
    fetchProjects();  
  }, []); 
  

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
        <SearchBar setFilteredProjects={setFilteredProjects} projects={projects} />

        <FilterBar setFilteredProjects={setFilteredProjects} projects={projects} />

        <View style={styles.projectsContainer}>
            <Projects projects={filteredProjects} loading={loading} error={error} />
        </View> 



      </View>

      <BottomNavigation target={"Projects"} />
    </>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  searchBar: {
    height: 40,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    color: colors.text,
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 5,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
  },
  filterText: {
    marginRight: 5,
    color: colors.text,
  },
  dropdown: {
    margin: 5,
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    zIndex: 1,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    color: colors.text,
  },
  projectsContainer: {
    marginTop: 10, // Default margin for the projects section
    marginBottom: 240,
  },
  dropdownOpen: {
    marginTop: 170, // Add more space when dropdown is open
  },
  
});
