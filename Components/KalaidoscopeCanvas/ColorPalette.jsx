import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

const ColorPalette = ({ colors, activeColor, onColorChange }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.colorPalette}
    >
      {colors.map((color) => (
        <TouchableOpacity
          key={color}
          style={styles.colorSwatchWrapper}
          onPress={() => onColorChange(color)}
        >
          <View style={[
            styles.colorSwatch,
            { backgroundColor: color },
            color === '#FFFFFF' && styles.whiteSwatch
          ]}>
            {activeColor === color && (
              <Feather 
                name="check" 
                size={24} 
                color={activeColor === '#000000' ? '#fff' : '#000'} 
              />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  colorPalette: {
    flexGrow: 0,
    marginBottom: 20,
  },
  colorSwatchWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  whiteSwatch: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
});

export default ColorPalette;