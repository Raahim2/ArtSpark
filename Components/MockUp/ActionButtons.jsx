import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const ActionButtons = ({ onDownload, onShare }) => (
    <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={onDownload}>
            <Feather name="download" size={20} color="#374151" />
            <Text style={styles.actionButtonText}>Download</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onShare}>
            <Feather name="share-2" size={20} color="#374151" />
            <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    actionButtonsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', paddingVertical: 10, backgroundColor: '#F9FAFB', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
    actionButtonText: { marginLeft: 8, fontSize: 16, fontWeight: '600', color: '#374151' },
});

export default ActionButtons;