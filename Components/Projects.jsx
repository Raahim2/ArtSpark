import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProjectItem from './ProjectItem';


const Projects = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Designs</Text>
      <ScrollView contentContainerStyle={styles.projectsGrid} showsVerticalScrollIndicator={false}>
        {Array(16).fill().map((_, index) => (
          <ProjectItem
            key={index}
            title="Soft Watercolour No Copy P..."
            type="Phone Wallpaper"
            imageSource={require('../assets/Images/image.png')}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  projectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  projectItem: {
    width: '48%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 5,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 5,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  iconButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
});

export default Projects;
