import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Screens/HomeScreen';
import GalleryScreen from './Screens/GalleryScreen';
import ProjectsScreen from './Screens/ProjectsScreen';
import SettingsScreen from './Screens/SettingsScreen';
import KaleidoscopeCanvasScreen from './Screens/KaleidoscopeCanvas';
import PixcelArtScreen from './Screens/PixelArtScreen';
import LogoGeneratorScreen from './Screens/LogoGeneraterScreen';
import MockUpScreen from './Screens/MockUpScreen';
import { ColorProvider } from './assets/Variables/colors';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

export default function App() {
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ColorProvider>
        <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
              <Stack.Screen name="KaleidoscopeCanvas" component={KaleidoscopeCanvasScreen} options={{ headerShown: false }} />
              <Stack.Screen name="PixelArt" component={PixcelArtScreen} options={{ headerShown: false }} />
              <Stack.Screen name="LogoGenerator" component={LogoGeneratorScreen} options={{ headerShown: false }} />
              <Stack.Screen name="MockUp" component={MockUpScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Gallery" component={GalleryScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Projects" component={ProjectsScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
      </ColorProvider>
    </GestureHandlerRootView>

  );
}

// Can add more MockUp images
// More Fonts
// More Stickers
// More Patterns
