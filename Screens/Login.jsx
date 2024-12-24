import React from 'react';
import { View, StyleSheet, ImageBackground, Text, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation();
  return (
    
    <ImageBackground source={require('../assets/Images/Background.png')} style={styles.container}>

      <View style={styles.loginContainer}>
        <Text style={styles.title}>Login</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput 
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#A9A9A9"
          />
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput 
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry
            placeholderTextColor="#A9A9A9"
          />
          
        </View>
       
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.registerContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.registerText}>New Here? <Text style={styles.registerLink}>Register</Text></Text>
          </TouchableOpacity>
        </View>
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
});

export default LoginScreen;
