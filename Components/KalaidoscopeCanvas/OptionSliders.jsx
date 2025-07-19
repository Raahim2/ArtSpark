// src/components/OptionSliders.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Feather } from '@expo/vector-icons';

const OptionSliders = ({
  segments,
  onSegmentsChange,
  strokeWidth,
  onStrokeWidthChange,
}) => {
  return (
    <View style={styles.sliderGroup}>
      <View style={styles.sliderContainer}>
        <Feather name="pen-tool" size={20} color="#555" style={styles.sliderIcon} />
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={20}
          step={0.5}
          value={strokeWidth}
          onValueChange={onStrokeWidthChange}
          minimumTrackTintColor="#333"
          maximumTrackTintColor="#ddd"
        />
      </View>
      <View style={styles.sliderContainer}>
        <Feather name="aperture" size={20} color="#555" style={styles.sliderIcon} />
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={32}
          step={1}
          value={segments}
          onValueChange={onSegmentsChange}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#ddd"
        />
        <Text style={styles.segmentText}>{segments}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderGroup: {
    paddingHorizontal: 10,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  sliderIcon: {
    marginRight: 15,
  },
  slider: {
    flex: 1,
  },
  segmentText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    width: 25,
    textAlign: 'right',
  },
});

export default OptionSliders;