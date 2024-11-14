import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProjectItem = ({ title, type, imageSource }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handlePress = () => {
    setIsChecked(!isChecked);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.projectItem}>
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} />
        <TouchableOpacity style={styles.checkbox} onPress={handlePress}>
          <Ionicons name={isChecked ? "checkbox" : "square-outline"} size={18} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{type}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  projectItem: {
    width: '48%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 5,
    position: 'relative',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 5,
  },
  checkbox: {
    borderRadius: 5,
    backgroundColor: 'white',
    position: 'absolute',
    top: 5,
    left: 5,
    padding: 2,
  },
  star: {
    borderRadius: 5,
    backgroundColor: 'white',
    position: 'absolute',
    top: 5,
    right: 30,
    padding: 2,
  },
  menu: {
    borderRadius: 5,
    backgroundColor: 'white',
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 2,
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
