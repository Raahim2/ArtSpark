import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NetInfo from '@react-native-community/netinfo';
import HomeScreen from './Screens/HomeScreen';
import GenerateVideo from './Screens/GenerateVideo';
import TemplatesScreen from './Screens/TemplatesScreen';
import ProjectsScreen from './Screens/ProjectsScreen';
import SettingsScreen from './Screens/SettingsScreen';
import VideoDetails from './Screens/VideoDetails';
import LoginScreen from './Screens/Login';
import SignUpScreen from './Screens/SignUp';
import { ColorProvider } from './assets/Variables/colors';
import NoInternetScreen from './Screens/NoInternet';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isConnected, setIsConnected] = useState(false);  // Set to false to simulate no internet

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  return (
    <ColorProvider>
      <NavigationContainer>
        {isConnected ? ( // Check network connection status
          <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="GenerateVideo" component={GenerateVideo} options={{ headerShown: false }} />
            <Stack.Screen name="Templates" component={TemplatesScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Projects" component={ProjectsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="VideoDetails" component={VideoDetails} options={{ headerShown: false }} />
          </Stack.Navigator>
        ) : (
          <NoInternetScreen /> // Show No Internet screen if not connected
        )}
      </NavigationContainer>
    </ColorProvider>
  );
}
