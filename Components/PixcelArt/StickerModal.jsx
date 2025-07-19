import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { stickers } from '../../assets/stickers'; // This now imports the updated data

// The old StickerThumbnail component is no longer needed and has been removed.

const StickerModal = ({ visible, onSelect, onClose }) => {
  const handleSelect = (sticker) => {
    // We still pass the original gridData, not the thumbnail.
    // This ensures the main screen's logic doesn't need to change.
    onSelect(sticker.gridData);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.stickerModalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Choose a Sticker</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#555" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={stickers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.stickerItem} onPress={() => handleSelect(item)}>
                {/* 
                  *** THE PERFORMANCE FIX ***
                  Instead of rendering 1024 views, we now render a single, fast Image component.
                */}
                <Image source={item.thumbnail} style={styles.thumbnailImage} />
                <Text style={styles.stickerName}>{item.name}</Text>
              </TouchableOpacity>
            )}
            numColumns={2}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  stickerModalContent: {
    width: '90%',
    height: '60%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 15,
  },
  modalHeader: {
    width: '100%',
    marginBottom: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginLeft: 24, // to balance the close button
  },
  closeButton: {
    padding: 5,
  },
  stickerItem: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
  },
  // New style for the Image component
  thumbnailImage: {
    width: 64, // Adjust size as needed
    height: 64, // Adjust size as needed
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF', // A background for transparent PNGs
  },
  stickerName: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default StickerModal;