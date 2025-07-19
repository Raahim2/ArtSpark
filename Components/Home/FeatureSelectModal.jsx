import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useColorContext } from '../../assets/Variables/colors'; // Assuming you have this context for colors

const CreateModal = ({ isVisible, onClose, onSelect }) => {
  const [colors] = useColorContext(); // Get colors from your context
  const styles = createModalStyles(colors);

  const options = [
    { key: 'kaleidoscope', icon: 'color-palette-outline', label: 'Kaleidoscope Canvas', color: '#4A90E2' },
    { key: 'pixelArt', icon: 'grid-outline', label: 'Pixel Art', color: '#50E3C2' },
    { key: 'logoMaker', icon: 'layers-outline', label: 'Logo Maker', color: '#F5A623' },
    { key: 'mockUp', icon: 'phone-portrait-outline', label: 'MockUp', color: '#9013FE' }
  ];

  return (
    // ✅ FIXED: Using standard Modal with correct props
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose} // Handles Android back button press
    >
      {/* Allows closing modal by tapping the background */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          {/* Prevents modal from closing when tapping inside the content */}
          <TouchableWithoutFeedback>
            <SafeAreaView style={styles.modalContent}>
              <View style={styles.grabber} />
              <Text style={styles.title}>Create New</Text>
              
              {options.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={styles.optionContainer}
                  onPress={() => onSelect(option.key)}
                >
                  <View style={[styles.iconWrapper, { backgroundColor: option.color }]}>
                    <Ionicons name={option.icon} size={24} color={colors.white} />
                  </View>
                  <Text style={styles.optionText}>{option.label}</Text>
                  <Ionicons name="chevron-forward" size={22} color={colors.light} />
                </TouchableOpacity>
              ))}

            </SafeAreaView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// ✨ NEW: Better, theme-aware styles for the modal
const createModalStyles = (colors) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  grabber: {
    width: 40,
    height: 5,
    backgroundColor: colors.lightGray,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 25,
    textAlign: 'center',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionText: {
    flex: 1, // Allows chevron to be pushed to the end
    fontSize: 17,
    color: colors.dark,
    fontWeight: '500',
  },
});


export default CreateModal;