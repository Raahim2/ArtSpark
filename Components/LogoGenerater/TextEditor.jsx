// ../Components/LogoGenerater/TextEditor.js
import React from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { fontPickerItems } from './constants';

const TextEditor = ({ logoText, setLogoText, fontSize, setFontSize, fontFamily, setFontFamily }) => {
  return (
    <View>
      <View style={styles.textInputSection}>
        <TextInput style={styles.textInput} placeholder="Type your logo text" value={logoText} onChangeText={setLogoText} />
      </View>

      <View style={styles.sliderControlGroup}>
        <View style={styles.sliderLabelContainer}>
          <Text style={styles.label}>Font Size</Text>
          <Text style={styles.sliderValueText}>{Math.round(fontSize)}</Text>
        </View>
        <Slider style={styles.slider} minimumValue={20} maximumValue={100} step={1} value={fontSize} onValueChange={setFontSize} minimumTrackTintColor="#7C4DFF" maximumTrackTintColor="#d3d3d3" thumbTintColor="#7C4DFF"/>
      </View>

      <View style={{ marginTop: 24, marginBottom: 8 }}>
        <Text style={[styles.label, { marginBottom: 4 }]}>Font Family</Text>
        <FlatList
          data={fontPickerItems}
          keyExtractor={item => item.value}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.fontButton,
                {
                  borderWidth: fontFamily === item.value ? 2 : 1,
                  borderColor: fontFamily === item.value ? '#7C4DFF' : '#ccc',
                  backgroundColor: fontFamily === item.value ? '#E8E0FF' : '#fff',
                }
              ]}
              onPress={() => setFontFamily(item.value)}
            >
              <Text style={[styles.fontButtonText, { fontFamily: item.value }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: { fontSize: 16, color: '#333', fontWeight: '500' },
  textInputSection: { marginVertical: 16 },
  textInput: { borderColor: '#ccc', borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16 },
  sliderControlGroup: { marginTop: 16 },
  sliderLabelContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  sliderValueText: { fontSize: 16, color: '#555', fontWeight: '500' },
  slider: { width: '100%', height: 40 },
  fontButton: {
    flex: 1,
    margin: 4,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontButtonText: {
    fontSize: 18,
    color: '#333',
  }
});

export default TextEditor;