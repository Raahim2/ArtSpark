import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const FILL_TYPES = ['Color', 'Pattern', 'Upload'];

const FillTypeSelector = ({ selectedType, onSelectType }) => (
    <>
        <Text style={styles.sectionTitle}>Fill Type</Text>
        <View style={styles.fillTypeSelector}>
            {FILL_TYPES.map(type => (
                <TouchableOpacity 
                    key={type} 
                    onPress={() => onSelectType(type.toLowerCase())} 
                    style={[styles.fillTypeButton, selectedType === type.toLowerCase() && styles.selectedFillTypeButton]}
                >
                    <Text style={[styles.fillTypeText, selectedType === type.toLowerCase() && styles.selectedFillTypeText]}>{type}</Text>
                </TouchableOpacity>
            ))}
        </View>
    </>
);

const styles = StyleSheet.create({
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginTop: 20, marginBottom: 12 },
    fillTypeSelector: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 12, padding: 4 },
    fillTypeButton: { flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: 'center' },
    selectedFillTypeButton: { backgroundColor: '#FFFFFF', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
    fillTypeText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
    selectedFillTypeText: { color: '#1F2937' },
});

export default FillTypeSelector;