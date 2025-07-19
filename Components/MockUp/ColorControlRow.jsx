import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ColorControlRow = ({ label, color, onChangePress, onRandomPress }) => (
    <View style={styles.colorControlRow}>
        <Text style={styles.colorControlLabel}>{label}</Text>
        <View style={styles.colorControlButtons}>
            <TouchableOpacity style={styles.colorSelector} onPress={onChangePress}>
                <View style={[styles.colorPreview, { backgroundColor: color }]} />
                <Text style={styles.colorSelectorText}>Change</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.randomButton} onPress={onRandomPress}>
                <MaterialIcons name="casino" size={22} color="#374151" />
            </TouchableOpacity>
        </View>
    </View>
);

const styles = StyleSheet.create({
    colorControlRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
    colorControlLabel: { fontSize: 16, fontWeight: '500', color: '#374151' },
    colorControlButtons: { flexDirection: 'row', alignItems: 'center' },
    colorSelector: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E5E7EB' },
    colorPreview: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: '#E5E7EB', marginRight: 15 },
    colorSelectorText: { fontSize: 16, fontWeight: '500', color: '#374151' },
    randomButton: { marginLeft: 10, padding: 12, backgroundColor: '#F9FAFB', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
});

export default ColorControlRow;