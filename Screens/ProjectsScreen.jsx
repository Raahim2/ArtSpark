import { StyleSheet, View, Text, Animated, StatusBar, FlatList, TextInput, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState, useRef } from 'react'
import BottomNavigation from '../Components/BottomNavigation'
import UpperNavigation from '../Components/UpperNavigation'
import SideBar from '../Components/SideBar'
import { useColorContext } from '../assets/Variables/colors';
import { Ionicons } from '@expo/vector-icons';
import Thumbnail from '../Components/Thumbnail';
import Projects from '../Components/Projects';

// Add this section here make the UI Exactly as shown in the image sont even change a single thing

export default function ProjectsScreen() {
  const [colors] = useColorContext();
  const styles = createStyles(colors);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarAnimation = useRef(new Animated.Value(0)).current;

  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [dateModifiedDropdownOpen, setDateModifiedDropdownOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('Category');
  const [selectedDateModified, setSelectedDateModified] = useState('Date modified');

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
          placeholderTextColor={colors.text}
        />

        <View style={styles.filterBar}>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} onPress={() => setCategoryDropdownOpen(!categoryDropdownOpen)}>
            <Text style={styles.filterText}>{selectedCategory}</Text>
            <Ionicons name="chevron-down-outline" size={16} color={colors.text} />
          </TouchableOpacity>
          {categoryDropdownOpen && (
            <View style={styles.dropdown}>
              <Text style={styles.dropdownItem} onPress={() => { setSelectedCategory('Category'); setCategoryDropdownOpen(false); }}>Category</Text>
              <Text style={styles.dropdownItem} onPress={() => { setSelectedCategory('Video'); setCategoryDropdownOpen(false); }}>Video</Text>
              <Text style={styles.dropdownItem} onPress={() => { setSelectedCategory('Short'); setCategoryDropdownOpen(false); }}>Short</Text>
              <Text style={styles.dropdownItem} onPress={() => { setSelectedCategory('Post'); setCategoryDropdownOpen(false); }}>Post</Text>
            </View>
          )}
          <TouchableOpacity style={styles.filterButton} onPress={() => setDateModifiedDropdownOpen(!dateModifiedDropdownOpen)}>
            <Text style={styles.filterText}>{selectedDateModified}</Text>
            <Ionicons name="chevron-down-outline" size={16} color={colors.text} />
          </TouchableOpacity>
          {dateModifiedDropdownOpen && (
            <View style={styles.dropdown}>
              <Text style={styles.dropdownItem} onPress={() => { setSelectedDateModified('Date modified'); setDateModifiedDropdownOpen(false); }}>Date modified</Text>
              <Text style={styles.dropdownItem} onPress={() => { setSelectedDateModified('Today'); setDateModifiedDropdownOpen(false); }}>Today</Text>
              <Text style={styles.dropdownItem} onPress={() => { setSelectedDateModified('This Week'); setDateModifiedDropdownOpen(false); }}>This Week</Text>
              <Text style={styles.dropdownItem} onPress={() => { setSelectedDateModified('Last 30 days'); setDateModifiedDropdownOpen(false); }}>Last 30 days</Text>
            </View>
          )}
        </View>

        <Projects />


        
      </View>

      <BottomNavigation target={"Projects"} />
    </>
  )
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchBar: {
    height: 40,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    color: colors.text,
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
  },
  filterText: {
    marginRight: 5,
    color: colors.text,
  },
  dropdown: {
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
})
