// src/Components/Projects/Projects.jsx

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';

const ProjectCard = ({ 
  project, 
  onProjectPress,
  onEnterSelectionMode,
  isSelected, 
  isSelectionMode 
}) => {
  return (
    <TouchableOpacity 
      style={styles.cardContainer}
      onPress={() => onProjectPress(project)}
      onLongPress={() => onEnterSelectionMode(project.id)}
      delayLongPress={200}
    >
      {/* The main card now has an explicit border and potential opacity change when selected */}
      <View style={[styles.card, isSelected && styles.selectedCard]}>
        <Image 
          source={project.imageSource} 
          style={[styles.projectImage, isSelected && styles.selectedImage]} 
          resizeMode="cover"
        />
        <View style={styles.infoContainer}>
          <Text style={styles.projectTitle} numberOfLines={1}>{project.title}</Text>
          <Text style={styles.projectDate}>{new Date(project.date).toLocaleDateString()}</Text>
        </View>
      </View>

      {/* RENDER THE CHECKBOX OVERLAY WHEN IN SELECTION MODE */}
      {isSelectionMode && (
        <View style={styles.selectionOverlay}>
          {isSelected ? (
            <View style={styles.checkboxSelected}>
              <Feather name="check" size={18} color="#FFF" />
            </View>
          ) : (
            <View style={styles.checkboxNormal} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function Projects(props) {
  const { projects } = props;

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <FlatList
      data={projects}
      renderItem={({ item }) => <ProjectCard project={item} {...props} />}
      keyExtractor={item => item.id}
      numColumns={2}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  cardContainer: {
    flex: 1/2,
    padding: 5,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    // Add a default transparent border so the layout doesn't shift
    borderWidth: 2,
    borderColor: 'transparent', 
  },
  // --- STRONG SELECTION STYLES ---
  selectedCard: {
    borderColor: '#3B82F6', // A bright, obvious blue border
  },
  selectedImage: {
    opacity: 0.7, // Slightly dim the image to make the checkmark pop
  },
  projectImage: {
    width: '100%',
    height: 120,
  },
  infoContainer: {
    padding: 10,
  },
  projectTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 4,
  },
  projectDate: {
    fontSize: 12,
    color: '#718096',
  },
  // --- SELECTION OVERLAY AND CHECKBOX STYLES ---
  selectionOverlay: {
    // This view sits on top of the entire card to position the checkbox
    position: 'absolute',
    top: 12, // Position from the top of the container
    right: 12, // Position from the right of the container
    zIndex: 1, // Ensure it's on top
  },
  checkboxNormal: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    // Add a shadow to the checkbox itself for better visibility
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  checkboxSelected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});