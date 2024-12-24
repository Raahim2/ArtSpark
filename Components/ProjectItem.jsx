import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ProjectItem = ({ title, type, imageSource, date, width, id }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('VideoDetails', {
      videoId: id,
    });
  };

  // Truncate title to 10 characters
  const truncatedTitle = title
    .replace(/\s+/g, ' ') // Replace all newlines and extra spaces with a single space
    .trim() // Remove leading and trailing spaces
    .split(' ') // Split the title into words
    .slice(0, 2) // Take the first two words
    .join(' ') + // Join them back with a space
    (title.split(/\s+/).length > 2 ? '...' : ''); // Add ellipsis if there are more than two words

  return (
    <View style={{ width: width }}>
      <TouchableOpacity onPress={handlePress} style={styles.projectItem}>
        <View style={styles.imageContainer}>
          <Image source={imageSource} style={styles.image} />
        </View>
        <Text style={styles.title}>{truncatedTitle}</Text>
        <Text style={styles.subtitle}>{type}</Text>
        <Text style={styles.subtitle}>{date}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  projectItem: {
    margin: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 5
  },
  imageContainer: {
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
});

export default ProjectItem;
