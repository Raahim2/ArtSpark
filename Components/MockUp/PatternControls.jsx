import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { PATTERNS } from './constants';
import ColorControlRow from './ColorControlRow';

const PatternControls = ({ patternProps, onPatternPropChange, onSelectPattern, onOpenColorPicker, onRandomColor }) => {
    const { id, scale, strokeWidth, color1, color2 } = patternProps;

    return (
        <View style={styles.controlSection}>
            <Text style={styles.sectionTitle}>Select Pattern</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {PATTERNS.map((pattern) => {
                    const PatternComponent = pattern.component;
                    return (
                        <TouchableOpacity 
                            key={pattern.id} 
                            style={[styles.patternThumbnail, id === pattern.id && styles.selectedThumbnail]} 
                            onPress={() => onSelectPattern(pattern.id)}
                        >
                            <PatternComponent width="70%" height="70%" fill={color1} stroke={color2} scale={1} strokeWidth={1} />
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <Text style={styles.sectionTitle}>Pattern Adjustments</Text>
            <View style={styles.sliderRow}>
                <Text style={styles.sliderLabel}>Scale</Text>
                <Slider style={styles.slider} minimumValue={0.5} maximumValue={3} value={scale} onValueChange={(val) => onPatternPropChange('scale', val)} minimumTrackTintColor="#3B82F6" maximumTrackTintColor="#D1D5DB" thumbTintColor="#3B82F6" />
                <Text style={styles.sliderValueText}>{scale.toFixed(2)}</Text>
            </View>
            <View style={styles.sliderRow}>
                <Text style={styles.sliderLabel}>Line Width</Text>
                <Slider style={styles.slider} minimumValue={0.8} maximumValue={5} value={strokeWidth} onValueChange={(val) => onPatternPropChange('strokeWidth', val)} minimumTrackTintColor="#3B82F6" maximumTrackTintColor="#D1D5DB" thumbTintColor="#3B82F6" />
                <Text style={styles.sliderValueText}>{strokeWidth.toFixed(1)}</Text>
            </View>

            <Text style={styles.sectionTitle}>Pattern Colors</Text>
            <ColorControlRow label="Color 1" color={color1} onChangePress={() => onOpenColorPicker('patternColor1', color1)} onRandomPress={() => onRandomColor('patternColor1')} />
            <ColorControlRow label="Color 2" color={color2} onChangePress={() => onOpenColorPicker('patternColor2', color2)} onRandomPress={() => onRandomColor('patternColor2')} />
        </View>
    );
};
// ... Add all the relevant styles from the original file (patternThumbnail, sliderRow, etc.)
const styles = StyleSheet.create({
    controlSection: { marginTop: 10, marginBottom: 10 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginTop: 20, marginBottom: 12 },
    sliderRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
    sliderLabel: { fontSize: 16, fontWeight: '500', color: '#374151', width: 80 },
    slider: { flex: 1, height: 40 },
    sliderValueText: { fontSize: 16, fontWeight: '600', color: '#4B5563', width: 40, textAlign: 'right' },
    patternThumbnail: { width: 90, height: 90, borderRadius: 12, marginRight: 10, borderWidth: 3, borderColor: '#E5E7EB', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    selectedThumbnail: { borderColor: '#3B82F6' },
});

export default PatternControls;