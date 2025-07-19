import React from 'react';
import { Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MOCKUPS } from './constants';

const MockupSelector = ({ selectedMockup, onSelectMockup }) => (
    <>
        <Text style={styles.sectionTitle}>Select Mockup</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScrollView}>
            {MOCKUPS.map((mockup) => (
                <TouchableOpacity 
                    key={mockup.id} 
                    style={[styles.thumbnailContainer, selectedMockup.id === mockup.id && styles.selectedThumbnail]} 
                    onPress={() => onSelectMockup(mockup)}
                >
                    <Image source={mockup.source} style={styles.thumbnailImage} />
                </TouchableOpacity>
            ))}
        </ScrollView>
    </>
);

const styles = StyleSheet.create({
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginTop: 20, marginBottom: 12 },
    selectorScrollView: { paddingBottom: 15 },
    thumbnailContainer: { width: 90, height: 90, borderRadius: 12, marginRight: 10, borderWidth: 3, borderColor: '#E5E7EB', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6' },
    thumbnailImage: { width: '80%', height: '80%', resizeMode: 'contain' },
    selectedThumbnail: { borderColor: '#3B82F6' },
});

export default MockupSelector;