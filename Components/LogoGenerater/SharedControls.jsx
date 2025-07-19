// ../Components/LogoGenerater/SharedControls.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

const SharedControls = ({
  iconColor,
  openColorPicker,
  padding,
  setPadding,
  backgroundType,
  setBackgroundType,
  backgroundColor,
  gradientStart,
  gradientEnd,
  shape,
  setShape,
  onSave,
  onShare,
}) => {
  return (
    <View>
      <View style={styles.controlGroup}>
        <Text style={styles.label}>Icon / Text Color</Text>
        <TouchableOpacity onPress={() => openColorPicker('icon')} style={[styles.colorPicker, { backgroundColor: iconColor }]} />
      </View>

      <View style={styles.sliderControlGroup}>
        <View style={styles.sliderLabelContainer}>
          <Text style={styles.label}>Padding</Text>
          <Text style={styles.sliderValueText}>{Math.round(padding)}%</Text>
        </View>
        <Slider style={styles.slider} minimumValue={0} maximumValue={60} step={1} value={padding} onValueChange={setPadding} minimumTrackTintColor="#7C4DFF" maximumTrackTintColor="#d3d3d3" thumbTintColor="#7C4DFF" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>BACKGROUND</Text>
        <View style={styles.buttonGroup}>
          {['Color', 'Gradient'].map((type) => (
            <TouchableOpacity key={type} style={[styles.button, backgroundType === type && styles.activeButton]} onPress={() => setBackgroundType(type)}>
              <Text style={[styles.buttonText, backgroundType === type && styles.activeButtonText]}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {backgroundType === 'Color' && (
          <View style={styles.controlGroup}>
            <Text style={styles.label}>Color</Text>
            <TouchableOpacity onPress={() => openColorPicker('background')} style={[styles.colorPicker, { backgroundColor: backgroundColor }]} />
          </View>
        )}
        {backgroundType === 'Gradient' && (
          <View style={styles.gradientControls}>
            <View style={styles.gradientColorControl}>
              <Text style={styles.label}>Start</Text>
              <TouchableOpacity onPress={() => openColorPicker('gradientStart')} style={[styles.colorPicker, { backgroundColor: gradientStart }]} />
            </View>
            <View style={styles.gradientColorControl}>
              <Text style={styles.label}>End</Text>
              <TouchableOpacity onPress={() => openColorPicker('gradientEnd')} style={[styles.colorPicker, { backgroundColor: gradientEnd }]} />
            </View>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SHAPE</Text>
        <View style={styles.buttonGroup}>
          {['Square', 'Squircle', 'Circle'].map((s) => (
            <TouchableOpacity key={s} style={[styles.button, shape === s && styles.activeButton]} onPress={() => setShape(s)}>
              <Text style={[styles.buttonText, shape === s && styles.activeButtonText]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>EXPORT</Text>
        <View style={styles.exportActionsContainer}>
          <TouchableOpacity style={[styles.exportButton, {backgroundColor: '#2563EB'}]} onPress={onSave}>
            <Ionicons name="download-outline" size={20} color="#fff" />
            <Text style={styles.exportButtonText}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.exportButton, {backgroundColor: '#4B5563'}]} onPress={onShare}>
            <Ionicons name="share-social-outline" size={20} color="#fff" />
            <Text style={styles.exportButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    controlGroup: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
    label: { fontSize: 16, color: '#333', fontWeight: '500' },
    colorPicker: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#E5E7EB' },
    section: { marginBottom: 16 },
    sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#777', letterSpacing: 0.5, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 16, marginTop: 16 },
    buttonGroup: { flexDirection: 'row', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, overflow: 'hidden', marginTop: 12 },
    button: { flex: 1, padding: 10, alignItems: 'center', backgroundColor: '#F9FAFB' },
    activeButton: { backgroundColor: '#7C4DFF' },
    buttonText: { color: '#333' },
    activeButtonText: { color: '#fff', fontWeight: 'bold' },
    sliderControlGroup: { marginTop: 16 },
    sliderLabelContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    sliderValueText: { fontSize: 16, color: '#555', fontWeight: '500' },
    slider: { width: '100%', height: 40 },
    gradientControls: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 16 },
    gradientColorControl: { alignItems: 'center', gap: 8 },
    exportActionsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 12 },
    exportButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 8, marginHorizontal: 8 },
    exportButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 8, fontSize: 16 },
});

export default SharedControls;