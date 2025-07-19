// src/Components/Projects/ProjectItem.jsx

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

// This is the new, robust component. Its root is a TouchableOpacity.
export default function ProjectItem({
  title,
  date,
  project,
  onPress,
  onLongPress,
  isSelected,
  isSelectionMode
}) {
  // Truncate title
  const truncatedTitle = project.title.split(' ').slice(0, 3).join(' ') + (project.title.split(' ').length > 3 ? '...' : '');

  return (
    // The entire card is one touchable area.
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => onPress(project)}
      onLongPress={() => onLongPress(project.id)}
      delayLongPress={200}
      activeOpacity={0.8}
    >
      {/* This inner View handles the visual appearance (border, etc.) */}
      <View style={[styles.card, isSelected && styles.selectedCard]}>
        <Image
          source={project.imageSource}
          style={[styles.projectImage, isSelected && styles.selectedImage]}
          resizeMode="cover"
        />
        <View style={styles.infoContainer}>
          <Text style={styles.projectTitle} numberOfLines={1}>{truncatedTitle}</Text>
          <Text style={styles.projectDate}>{new Date(project.date).toLocaleDateString()}</Text>
        </View>
      </View>

      {/* The checkbox overlay appears on top only in selection mode */}
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
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1 / 2, // This makes the card take up half the screen width for a grid
    padding: 6,
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
    borderWidth: 2,
    borderColor: 'transparent', // Default border is transparent
  },
  selectedCard: {
    borderColor: '#3B82F6', // A strong blue border when selected
  },
  selectedImage: {
    opacity: 0.7, // Dim the image slightly when selected
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
  selectionOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  checkboxNormal: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
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