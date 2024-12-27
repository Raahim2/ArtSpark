import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NoInternetScreen = () => {
  const [isConnected, setIsConnected] = useState(false);
  const navigation = useNavigation();

  // Check initial network connection and handle navigation based on userId
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected) {
        checkUserStatus();
      }
    });

    // Check the initial connection status
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected) {
        checkUserStatus();
      }
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, []);

  // Function to check if user is logged in
  const checkUserStatus = async () => {
    const userId = await AsyncStorage.getItem('userid');
    if (userId) {
      navigation.replace('Home'); // Navigate to HomeScreen if user is logged in
    } else {
      navigation.replace('Login'); // Navigate to LoginScreen if no userId
    }
  };

  // Handle retry logic for checking network
  const handleRetry = async () => {
    const state = await NetInfo.fetch();
    setIsConnected(state.isConnected);
    if (state.isConnected) {
      checkUserStatus();
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/Images/noInternet.png')} // Your custom "No Internet" image
        style={styles.icon}
      />
      <Text style={styles.title}>No Internet Connection</Text>
      <Text style={styles.subtitle}>Please check your internet connection and try again.</Text>
      <Button title="Retry" onPress={handleRetry} color="#000" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // White background
    padding: 20,
    textAlign: 'center',
  },
  icon: {
    width: 120,
    height: 120,
    marginBottom: 20,
    tintColor: '#000', // Black icon color
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000', // Black text
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#000', // Black text
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#000', // Black button
    padding: 10,
    borderRadius: 5,
    color: '#fff', // White button text
  },
});

export default NoInternetScreen;
