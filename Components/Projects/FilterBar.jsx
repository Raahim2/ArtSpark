// src/Components/Projects/FilterBar.jsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorContext } from '../../assets/Variables/colors';

const CATEGORIES = ['All', 'Kaleidoscope', 'Mockup', 'Pixel Art', 'Logo Design'];
const DATE_FILTERS = ['Any Time', 'Today', 'This Week', 'Last 30 Days'];

// Controlled component: receives values and reports changes via props.
export default function FilterBar({ 
  activeCategory, 
  onCategoryChange, 
  activeDateFilter, 
  onDateFilterChange 
}) {
  const [colors] = useColorContext();
  const styles = createStyles(colors);
  const [isCategoryOpen, setCategoryOpen] = useState(false);
  const [isDateOpen, setDateOpen] = useState(false);

  const handleCategorySelect = (category) => {
    onCategoryChange(category);
    setCategoryOpen(false);
  };

  const handleDateSelect = (dateFilter) => {
    onDateFilterChange(dateFilter);
    setDateOpen(false);
  };

  // Resets all filters to their default state
  const clearFilters = () => {
      onCategoryChange('All');
      onDateFilterChange('Any Time');
  };

  const hasActiveFilters = activeCategory !== 'All' || activeDateFilter !== 'Any Time';

  return (
    <View style={styles.container}>
      {/* Category Filter */}
      <View>
        <TouchableOpacity style={styles.filterButton} onPress={() => { setDateOpen(false); setCategoryOpen(!isCategoryOpen); }}>
          <Text style={styles.filterText}>{activeCategory}</Text>
          <Ionicons name="chevron-down-outline" size={16} color={colors.text} />
        </TouchableOpacity>
        {isCategoryOpen && (
          <View style={[styles.dropdown, styles.categoryDropdown]}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity key={cat} onPress={() => handleCategorySelect(cat)}>
                <Text style={styles.dropdownItem}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      
      {/* Date Filter */}
      <View>
        <TouchableOpacity style={styles.filterButton} onPress={() => { setCategoryOpen(false); setDateOpen(!isDateOpen); }}>
          <Text style={styles.filterText}>{activeDateFilter}</Text>
          <Ionicons name="chevron-down-outline" size={16} color={colors.text} />
        </TouchableOpacity>
        {isDateOpen && (
          <View style={[styles.dropdown, styles.dateDropdown]}>
            {DATE_FILTERS.map(date => (
              <TouchableOpacity key={date} onPress={() => handleDateSelect(date)}>
                <Text style={styles.dropdownItem}>{date}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Clear Filters Button - only shows if a filter is active */}
      {hasActiveFilters && (
          <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Ionicons name="close-outline" size={18} color={colors.theme} />
          </TouchableOpacity>
      )}
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingBottom: 10,
    zIndex: 10, // Ensure dropdowns appear on top
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    marginRight: 10,
  },
  filterText: {
    marginRight: 5,
    color: colors.text,
    fontWeight: '500',
  },
  dropdown: {
    position: 'absolute',
    top: 45, // Position below the button
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  categoryDropdown: { 
    left: 0, 
    width: 150,
    backgroundColor: 'black',
   },
  dateDropdown: { left: 0, width: 150 ,backgroundColor: 'black',},
  dropdownItem: {
    padding: 12,
    color: 'white',
    fontSize: 15,
  },
  clearButton: {
    marginLeft: 'auto', // Pushes the button to the far right
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
});