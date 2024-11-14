import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Screens/HomeScreen'
import GenerateVideo from './Screens/GenerateVideo'
import SearchScreen from './Screens/SearchScreen'
import ProjectsScreen from './Screens/ProjectsScreen'
import SettingsScreen from './Screens/SettingsScreen'
import { ColorProvider } from './assets/Variables/colors'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ColorProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="New" component={GenerateVideo} options={{ headerShown: false }} />
        <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Projects" component={ProjectsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ColorProvider>
  );
}

