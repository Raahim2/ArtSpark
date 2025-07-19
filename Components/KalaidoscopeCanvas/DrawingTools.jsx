import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

const TOOLS = [
  { name: 'doodle', icon: 'edit-2' },
  { name: 'line', icon: 'minus' },
  { name: 'circle', icon: 'circle' },
  { name: 'square', icon: 'square' },
  { name: 'triangle', icon: 'triangle' },
  { name: 'hexagon', icon: 'hexagon' },
  { name: 'star', icon: 'star' },
  { name: 'heart', icon: 'heart' },
  { name: 'x-mark', icon: 'x' },
];

const DrawingTools = ({ activeTool, onToolChange }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.toolPalette}
    >
      {TOOLS.map((tool) => (
        <TouchableOpacity 
          key={tool.name} 
          onPress={() => onToolChange(tool.name)} 
          style={styles.toolButtonWrapper}
        >
          <View style={[styles.toolButton, activeTool === tool.name && styles.activeToolButton]}>
            <Feather 
              name={tool.icon} 
              size={22} 
              color={activeTool === tool.name ? '#fff' : '#333'} 
            />
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  toolPalette: {
    flexGrow: 0,
    marginBottom: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EFEFEF',
    paddingVertical: 10,
  },
  toolButtonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  toolButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeToolButton: {
    backgroundColor: '#333',
    borderColor: '#333',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default DrawingTools;