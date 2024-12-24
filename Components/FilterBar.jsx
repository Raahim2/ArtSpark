import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useColorContext } from '../assets/Variables/colors';
import { Ionicons } from '@expo/vector-icons';

export default function FilterBar({setFilteredProjects , projects}) {
  const [colors] = useColorContext();
  const styles = createStyles(colors);

  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [dateModifiedDropdownOpen, setDateModifiedDropdownOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('Category');
  const [selectedDateModified, setSelectedDateModified] = useState('Date modified');

  const toggleCategoryDropdown = () => {
    setCategoryDropdownOpen(!categoryDropdownOpen);
    if (dateModifiedDropdownOpen) {
      setDateModifiedDropdownOpen(false); // Close date modified dropdown if open
    }
  };

  // Toggle date modified dropdown
  const toggleDateModifiedDropdown = () => {
    setDateModifiedDropdownOpen(!dateModifiedDropdownOpen);
    if (categoryDropdownOpen) {
      setCategoryDropdownOpen(false); // Close category dropdown if open
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCategoryDropdownOpen(false);
    filterProjects(category, selectedDateModified);  // Apply filter when category is selected
  };
  
  const handleDateModifiedSelect = (date) => {
    setSelectedDateModified(date);
    setDateModifiedDropdownOpen(false);
    filterProjects(selectedCategory, date);  // Apply filter when date modified is selected
  };
  
  const filterProjects = (category, date) => {
    console.log(category, date);


    const filtered = projects.filter((project) => {
      const categoryMatch = category === 'Category' || project.category === category;
    
      // Parse project.createdAt into a Date object
      const [day, month, year] = project.createdAt.split('/').map(Number);
      const projectDate = new Date(year, month - 1, day);
    
      // Determine the date range for filtering
      const now = new Date();
      let dateMatch = true;
    
      if (date === 'Today') {
        dateMatch = projectDate.toDateString() === now.toDateString();
      } else if (date === 'This Week') {
        const startOfWeek = new Date(now);
        // startOfWeek.setDate(now.getDate() - now.getDay()); // Start of the week (Sunday)
        startOfWeek.setDate(now.getDate() - 7); // last 7 days
        dateMatch = projectDate >= startOfWeek && projectDate <= now;
      } else if (date === 'Last 30 Days') {
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        dateMatch = projectDate >= thirtyDaysAgo && projectDate <= now;
      }
    
      return categoryMatch && dateMatch;
    });

    setFilteredProjects(filtered);  // Update filtered projects state
  };



  
  

  return (
    <View style={styles.filterBar}>
      <TouchableOpacity style={styles.filterButton}>
        <Ionicons name="options-outline" size={20} color={colors.text} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.filterButton} onPress={toggleCategoryDropdown}>
        <Text style={styles.filterText}>{selectedCategory}</Text>
        <Ionicons name="chevron-down-outline" size={16} color={colors.text} />
      </TouchableOpacity>

      

      <TouchableOpacity style={styles.filterButton} onPress={toggleDateModifiedDropdown}>
        <Text style={styles.filterText}>{selectedDateModified}</Text>
        <Ionicons name="chevron-down-outline" size={16} color={colors.text} />
      </TouchableOpacity>

      {categoryDropdownOpen && (
        <View style={styles.dropdown}>
          <Text style={styles.dropdownItem} onPress={() => { setSelectedCategory(' Category '); setCategoryDropdownOpen(false); handleCategorySelect('Category'); }}>Category</Text>
          <Text style={styles.dropdownItem} onPress={() => { setSelectedCategory('    Video    '); setCategoryDropdownOpen(false); handleCategorySelect('Video'); }}>Video</Text>
          <Text style={styles.dropdownItem} onPress={() => { setSelectedCategory('    Shorts    '); setCategoryDropdownOpen(false); handleCategorySelect('Shorts'); }}>Shorts</Text>
        </View>
      )}

      {dateModifiedDropdownOpen && (
        <View style={styles.dropdown}>
          <Text style={styles.dropdownItem} onPress={() => { setSelectedDateModified('Date modified'); setDateModifiedDropdownOpen(false); handleDateModifiedSelect('Date modified'); }}>Date modified</Text>
          <Text style={styles.dropdownItem} onPress={() => { setSelectedDateModified('      Today      '); setDateModifiedDropdownOpen(false); handleDateModifiedSelect('Today'); }}>Today</Text>
          <Text style={styles.dropdownItem} onPress={() => { setSelectedDateModified('   This Week    '); setDateModifiedDropdownOpen(false); handleDateModifiedSelect('This Week'); }}>This Week</Text>
          <Text style={styles.dropdownItem} onPress={() => { setSelectedDateModified(' Last 30 days '); setDateModifiedDropdownOpen(false); handleDateModifiedSelect('Last 30 days'); }}>Last 30 days</Text>
        </View>
      )}
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  filterBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',  
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
    marginTop: 5,  // Add space between the button and dropdown
    marginLeft: 5, // Optional: tweak this to align dropdown
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    zIndex: 1,
    width: '100%',  // Ensure the dropdown takes the full width of the parent
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    color: colors.text,
  },
});
