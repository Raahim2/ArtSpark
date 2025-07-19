// LogoGenerator/components/CustomColorPickerModal.js

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';

const CustomColorPickerModal = ({ visible, onClose, initialColor, onConfirm }) => {
  const [pickerColor, setPickerColor] = useState(initialColor);

  useEffect(() => {
    if (visible) {
      setPickerColor(initialColor);
    }
  }, [visible, initialColor]);

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose} />
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Select a Color</Text>
        <View style={styles.colorPreviewContainer}>
          <View style={[styles.colorPreview, { backgroundColor: pickerColor }]} />
          <Text style={styles.colorHexText}>{pickerColor.toUpperCase()}</Text>
        </View>
        <View style={styles.pickerWrapper}>
          <ColorPicker
            color={pickerColor}
            onColorChange={setPickerColor}
            thumbSize={30}
            sliderSize={30}
            noSnap={true}
            row={false}
          />
        </View>
        <TouchableOpacity style={styles.modalDoneButton} onPress={() => onConfirm(pickerColor)}>
          <Text style={styles.modalDoneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { position: 'absolute', bottom: '50%', left: '50%', transform: [{ translateX: -170 }, { translateY: 220 }], width: 340, backgroundColor: 'white', borderRadius: 20, padding: 20, elevation: 10, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 10 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', textAlign: 'center', marginBottom: 15 },
  colorPreviewContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20, gap: 15 },
  colorPreview: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#E5E7EB' },
  colorHexText: { fontSize: 22, fontWeight: '600', color: '#374151', fontFamily: 'monospace' },
  pickerWrapper: { height: 280, marginBottom: 15 },
  modalDoneButton: { backgroundColor: '#3B82F6', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  modalDoneButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default CustomColorPickerModal;