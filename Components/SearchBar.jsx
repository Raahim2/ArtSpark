import { StyleSheet, View, TextInput } from 'react-native';
import React, { useState } from 'react';
import { useColorContext } from '../assets/Variables/colors';

export default function SearchBar({ setFilteredProjects, projects }) {
  const [colors] = useColorContext();
  const [searchQuery, setSearchQuery] = useState(''); 
  const styles = createStyles(colors);

  const handleSearch = (query) => {
    setSearchQuery(query);

    // Filter projects by title (case insensitive)
    const filtered = projects.filter((project) =>
      project.title.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredProjects(filtered); // Pass filtered results to parent
  };

  return (
    <View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search projects..."
        placeholderTextColor={colors.text}
        value={searchQuery}
        onChangeText={handleSearch} // Update state and filter projects
      />
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  searchBar: {
    height: 40,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    color: colors.text,
  },
});
