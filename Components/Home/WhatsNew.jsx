import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorContext } from '../../assets/Variables/colors';
import { useNavigation } from '@react-navigation/native';

const WhatsNew = () => {
  const [colors] = useColorContext();
  const styles = createStyles(colors);
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('Gallery');
  };

  return ( 
    <LinearGradient colors={['#FF0096', '#00C8FF', '#FFC800']} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={styles.container}> 
      <Text style={styles.title}>Discover ArtSpark</Text>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>See what's new in ArtSpark</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    margin: 8,
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
