// src/Components/Projects/SearchBar.jsx

import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorContext } from '../../assets/Variables/colors';

// This component is now simpler and more reusable.
// It receives the current query and a function to call when the query changes.
export default function SearchBar({ query, onQueryChange }) {
  const [colors] = useColorContext();
  const styles = createStyles(colors);

  return (
    <View style={styles.searchContainer}>
      <Ionicons name="search-outline" size={20} color={colors.textSecondary} style={styles.searchIcon} />
      <TextInput
        style={styles.searchBar}
        placeholder="Search projects by title..."
        placeholderTextColor={colors.textSecondary}
        value={query}
        onChangeText={onQueryChange}
      />
      {/* Show a clear button only if there is text */}
      {query.length > 0 && (
        <TouchableOpacity onPress={() => onQueryChange('')} style={styles.clearIcon}>
          <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: colors.text,
  },
  clearIcon: {
    marginLeft: 8,
  },
});