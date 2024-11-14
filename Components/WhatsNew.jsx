import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useColorContext } from '../assets/Variables/colors';
const WhatsNew = () => {
    const [colors] = useColorContext();
    const styles = createStyles(colors);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover Droptober</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>See what’s new in Print</Text>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    margin:8,
    backgroundColor: colors.theme,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: colors.theme,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WhatsNew;
