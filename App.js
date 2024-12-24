import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Screens/HomeScreen'
import GenerateVideo from './Screens/GenerateVideo'
import TemplatesScreen from './Screens/TemplatesScreen'
import ProjectsScreen from './Screens/ProjectsScreen'
import SettingsScreen from './Screens/SettingsScreen'
import VideoDetails from './Screens/VideoDetails'
import LoginScreen from './Screens/Login'
import SignUpScreen from './Screens/SignUp'
import { ColorProvider } from './assets/Variables/colors'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ColorProvider>
    <NavigationContainer>
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
      </NavigationContainer>
    </ColorProvider>
  );
}

