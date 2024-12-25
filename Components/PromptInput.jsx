import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Modal, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useColorContext } from '../assets/Variables/colors';
import InfoGenerator from '../VideoGenerationCode/JavaScriptReact/VideoGeneration/InfoGenerator';

const PromptInput = ({ onSend, projectCategory  , initialPrompt}) => {
  const [inputText, setInputText] = useState(initialPrompt);
  const [colors] = useColorContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState('0');
  const [selectedSeconds, setSelectedSeconds] = useState('30');
  const styles = createStyles(colors);

  const handleSend = () => {
    if (inputText.trim()) {
      const totalSeconds = parseInt(selectedMinutes) * 60 + parseInt(selectedSeconds);
      onSend(inputText, totalSeconds);
      setInputText('');
    }
  };

  const handleClockPress = () => {
    setModalVisible(true);
  };

  const handleTimeSet = () => {
    const totalSeconds = parseInt(selectedMinutes) * 60 + parseInt(selectedSeconds);
    if (
      (projectCategory === 'Shorts' && totalSeconds >= 1 && totalSeconds <= 59) || 
      (projectCategory !== 'Shorts' && totalSeconds >= 1 && totalSeconds <= 600)
    ) {
      console.log(`Time set to: ${selectedMinutes} minutes and ${selectedSeconds} seconds`);
      setModalVisible(false);
    } else {
      alert(
        projectCategory === 'Shorts'
          ? 'Please select a time between 1 second and 59 seconds.'
          : 'Please select a time between 1 second and 10 minutes.'
      );
    }
  };

  const setRandomPrompt = async() => {
    console.log("Setting Random Prompt");
    const randomPrompt = await InfoGenerator.generatePrompt();
    console.log("Random Prompt:", randomPrompt);
    setInputText(randomPrompt);
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
      <Ionicons
          name="shuffle"
          size={24}
          color={colors.theme}
          style={styles.clockIcon}
          onPress={setRandomPrompt}
        />
        <Ionicons
          name="time"
          size={24}
          color={colors.theme}
          style={styles.clockIcon}
          onPress={handleClockPress}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Prompt"
          value={inputText}
          onChangeText={setInputText}
        />
        <Ionicons
          name="send"
          size={24}
          color={colors.theme}
          style={styles.sendIcon}
          onPress={handleSend}
        />
      </View>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeIcon} onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color={colors.black} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select {projectCategory} Duration</Text>
            <View style={styles.pickerContainer}>
              {projectCategory !== 'Shorts' && (
                <Picker
                  selectedValue={selectedMinutes}
                  style={styles.picker}
                  onValueChange={(itemValue) => setSelectedMinutes(itemValue)}
                >
                  {[...Array(10).keys()].map((i) => (
                    <Picker.Item key={i} label={`${i} min`} value={`${i}`} />
                  ))}
                </Picker>
              )}
              <Picker
                selectedValue={selectedSeconds}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedSeconds(itemValue)}
              >
                {(projectCategory === 'Shorts'
                  ? [...Array(59).keys()].slice(1) // From 1 to 59 seconds
                  : [...Array(60).keys()] // From 0 to 59 seconds
                ).map((i) => (
                  <Picker.Item key={i} label={`${i} sec`} value={`${i}`} />
                ))}
              </Picker>
            </View>
            <TouchableOpacity style={styles.setButton} onPress={handleTimeSet}>
              <Text style={styles.setButtonText}>Set Duration</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};


const createStyles = (colors) => StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingBottom: 100,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    flex: 1,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.black,
  },
  sendIcon: {
    marginLeft: 10,
  },
  clockIcon: {
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: 320,
    padding: 25,
    backgroundColor: colors.white,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.theme,
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  setButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.theme,
    borderRadius: 5,
  },
  setButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
  },
  picker: {
    flex: 1,
    height: 50,
  },
});

export default PromptInput;