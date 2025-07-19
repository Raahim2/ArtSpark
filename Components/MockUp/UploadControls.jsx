import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const UploadControls = ({ onChoosePhoto, uploadedImageUri }) => (
    <View style={styles.controlSection}>
        <TouchableOpacity style={styles.uploadButton} onPress={onChoosePhoto}>
            <Text style={styles.uploadButtonText}>Choose from Library</Text>
        </TouchableOpacity>
        {uploadedImageUri && (
            <View style={styles.imagePreviewContainer}>
                <Text style={styles.previewText}>Current Image:</Text>
                <Image source={{ uri: uploadedImageUri }} style={styles.imagePreview} />
            </View>
        )}
    </View>
);

const styles = StyleSheet.create({
    controlSection: { marginTop: 10, marginBottom: 10 },
    uploadButton: { backgroundColor: '#3B82F6', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
    uploadButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    imagePreviewContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 15, backgroundColor: '#F9FAFB', padding: 10, borderRadius: 12 },
    previewText: { fontSize: 14, color: '#374151', marginRight: 10 },
    imagePreview: { width: 50, height: 50, borderRadius: 8 },
});

export default UploadControls;