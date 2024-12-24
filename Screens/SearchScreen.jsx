import { StyleSheet, View, Text, Animated, TouchableOpacity } from 'react-native'
import React, { useState, useRef } from 'react'
import BottomNavigation from '../Components/BottomNavigation'
import UpperNavigation from '../Components/UpperNavigation'
import SideBar from '../Components/SideBar'
import { useColorContext } from '../assets/Variables/colors';

export default function SearchScreen({ route }) {
  const { username } = route.params;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarAnimation = useRef(new Animated.Value(0)).current;
  const [colors, setColors] = useColorContext();
  const styles = createStyles(colors);

  // Manually change the theme to a new color for all pages and components
  const handleButtonPress = () => {
    console.log('Button pressed');
    const newThemeColor = '#FF5733'; // Example new color
    setColors((prevColors) => ({
      ...prevColors,
      theme: newThemeColor,
    }));
  };

  const toggleSidebar = () => {
    const toValue = isSidebarOpen ? 0 : 1;
    Animated.timing(sidebarAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <UpperNavigation toggleSidebar={toggleSidebar} title={"Search"} />

      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} animation={sidebarAnimation} username={username}/>
      <View style={styles.container}>
        <Text style={styles.heading}>Search</Text>

      <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
        <Text style={styles.buttonText}>Press Me</Text>
      </TouchableOpacity>

      </View>
      <BottomNavigation target={"Search"} username={username}/>
    </>
  )
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.theme,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.theme,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
})
