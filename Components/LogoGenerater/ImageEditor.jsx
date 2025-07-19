// ../Components/LogoGenerater/ImageEditor.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ImageEditor = ({ onPickImage }) => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.uploadButton} onPress={onPickImage}>
      <Ionicons name="image" size={22} color="white" style={{ marginRight: 10 }} />
      <Text style={styles.uploadButtonText}>Upload From Gallery</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: '#7C4DFF',
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ImageEditor;