import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, Text, TextInput, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {GENTUBE_API_KEY} from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height, width } = Dimensions.get('window');
const BASE_URL = 'https://gentube.vercel.app'; 

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const hasLowerCase = (password) => /[a-z]/.test(password);
  const hasUpperCase = (password) => /[A-Z]/.test(password);
  const hasNumber = (password) => /\d/.test(password);
  const isLongEnough = (password) => password.length >= 6;

  const validatePassword = (password) => {
    return hasLowerCase(password) && hasUpperCase(password) && hasNumber(password) && isLongEnough(password);
  };

  const handleCreateAccount = async () => {
    if (!username || !email || !password) {
      Alert.alert(
        "Missing Information",
        "Please fill in all fields before creating account",
        [{ text: "OK" }]
      );
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert(
        "Invalid Email",
        "Please enter a valid email address",
        [{ text: "OK" }]
      );
      return;
    }

    if (!validatePassword(password)) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/MongoDB/createUser`, {
        method: 'POST',
        headers: {
          'Authorization': GENTUBE_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password
        })
      });

      const data = await response.json();
      console.log(data);

      if (data.user_id) {
        await AsyncStorage.setItem('username', username);
        await AsyncStorage.setItem('userid', data.user_id);
        
        Alert.alert(
          "Success",
          "Account created successfully!",
          [
            { 
              text: "OK",
              onPress: () => navigation.navigate('Home')
            }
          ]
        );
      } else {
        Alert.alert(
          "Error",
          "Username or email already exists",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Username or email already exists",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <ImageBackground source={require('../assets/Images/Background.png')} style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={styles.title}>SignUp</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Username</Text>
          <TextInput 
            style={styles.input}
            placeholder="Enter your username"
            placeholderTextColor="#A9A9A9"
            value={username}
            onChangeText={setUsername}
          />
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput 
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#A9A9A9"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput 
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry
            placeholderTextColor="#A9A9A9"
            value={password}
            onChangeText={setPassword}
          />
          <View style={styles.passwordRequirements}>
            <Text style={[styles.requirement, {color: hasLowerCase(password) ? 'green' : 'red'}]}>
              • One lowercase letter
            </Text>
            <Text style={[styles.requirement, {color: hasUpperCase(password) ? 'green' : 'red'}]}>
              • One uppercase letter
            </Text>
            <Text style={[styles.requirement, {color: hasNumber(password) ? 'green' : 'red'}]}>
              • One number
            </Text>
            <Text style={[styles.requirement, {color: isLongEnough(password) ? 'green' : 'red'}]}>
              • Minimum 6 characters
            </Text>
          </View>
        </View>
       
        <TouchableOpacity style={styles.loginButton} onPress={handleCreateAccount}>
          <Text style={styles.loginButtonText}>Create Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.registerContainer} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.registerText}>Already have an account? <Text style={styles.registerLink}>Login</Text></Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height+30,
    width: width,
    resizeMode: 'cover',
  },
  loginContainer: {
    marginTop: 100,
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#000',
    marginBottom: 30,
    marginLeft: 20,
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  loginButton: {
    alignItems: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    marginHorizontal: 20,
    borderRadius: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  registerContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  registerText: {
    marginTop: 20,
  },
  registerLink: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  passwordRequirements: {
    marginTop: -10,
    marginBottom: 15,
  },
  requirement: {
    fontSize: 12,
    marginBottom: 2,
  }
});

export default SignUpScreen;
