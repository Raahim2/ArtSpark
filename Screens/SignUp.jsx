import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, Text, TextInput, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateAccount = () => {
    if (!username || !email || !password) {
      Alert.alert(
        "Missing Information",
        "Please fill in all fields before creating account",
        [{ text: "OK" }]
      );
      return;
    }

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
  }
});

export default SignUpScreen;
