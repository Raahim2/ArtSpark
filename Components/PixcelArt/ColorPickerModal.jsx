// ../Components/PixcelArt/ColorPickerModal.js
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';

const ColorPickerModal = ({ visible, initialColor, onConfirm, onClose }) => {
  const [pickerColor, setPickerColor] = useState(initialColor);

  useEffect(() => {
    setPickerColor(initialColor);
  }, [initialColor]);

  const handleConfirm = () => {
    onConfirm(pickerColor);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select a Color</Text>
          <View style={styles.previewContainer}>
            <View style={[styles.colorPreview, { backgroundColor: pickerColor }]} />
            <Text style={styles.colorHexText}>{pickerColor.toUpperCase()}</Text>
          </View>
          <View style={styles.pickerWrapper}>
            <ColorPicker
              color={pickerColor}
              onColorChangeComplete={setPickerColor} // Use onComplete to reduce re-renders
              thumbSize={40}
              sliderSize={30}
              noSnap={true}
              row={false}
            />
          </View>
          <TouchableOpacity style={styles.modalDoneButton} onPress={handleConfirm}>
            <Text style={styles.modalDoneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Paste the relevant styles from the original control panel here
const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  modalContent: { width: '85%', maxWidth: 320, backgroundColor: '#F8F8F8', borderRadius: 24, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 10 },
  modalTitle: { fontSize: 22, fontWeight: '600', color: '#333', marginBottom: 15 },
  previewContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, backgroundColor: '#FFF', borderRadius: 16, padding: 10, width: '100%', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  colorPreview: { width: 50, height: 50, borderRadius: 25, marginRight: 15, borderWidth: 2, borderColor: '#E0E0E0' },
  colorHexText: { fontSize: 20, fontWeight: '500', color: '#555', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  pickerWrapper: { width: '100%', height: 250, marginBottom: 20 },
  modalDoneButton: { width: '100%', backgroundColor: '#007AFF', paddingVertical: 14, borderRadius: 18, alignItems: 'center', elevation: 2 , marginTop: 30},
  modalDoneButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default ColorPickerModal;