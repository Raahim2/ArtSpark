// ../Components/LogoGenerater/ClipartEditor.js
import React from 'react';
import { View, TextInput, FlatList, ActivityIndicator, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ClipartEditor = ({
  searchQuery,
  setSearchQuery,
  displayedIcons,
  setSelectedIcon,
  loadMoreIcons,
  isLoadingIcons,
}) => {
  const renderIconItem = ({ item }) => (
    <TouchableOpacity style={styles.gridIcon} onPress={() => setSelectedIcon(item)}>
      <MaterialCommunityIcons name={item} size={28} color="#555" />
    </TouchableOpacity>
  );

  return (
    <View>
      <TextInput style={styles.searchInput} placeholder="Search thousands of icons..." value={searchQuery} onChangeText={setSearchQuery} />
      <FlatList
        style={styles.iconGridContainer}
        data={displayedIcons}
        renderItem={renderIconItem}
        keyExtractor={(item, index) => `${item}-${index}`}
        numColumns={6}
        nestedScrollEnabled={true}
        onEndReached={loadMoreIcons}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isLoadingIcons && <ActivityIndicator size="large" color="#7C4DFF" />}
        ListEmptyComponent={<Text style={styles.noResultsText}>No icons found for "{searchQuery}"</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  iconGridContainer: {
    height: 250,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
  },
  gridIcon: {
    width: `${100 / 6}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default ClipartEditor;