import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorContext } from '../assets/Variables/colors';

const PromptInput = ({ onSend }) => {
  const [inputText, setInputText] = useState('');
  const [colors] = useColorContext();
  const styles = createStyles(colors);

  const handleSend = () => {
    if (inputText.trim()) {
      onSend(inputText);
      setInputText('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Video Generation Prompt"
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
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    // borderWidth: 1,
    // borderColor: colors.theme,
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
});

export default PromptInput;
