import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Animated } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useColorContext } from '../../assets/Variables/colors';
import { useNavigation } from '@react-navigation/native';

const SideBar = ({ isOpen, toggleSidebar  }) => {
  const sidebarAnimation = useRef(new Animated.Value(0)).current;
  const [colors] = useColorContext();
  const styles = createStyles(colors);
  const navigation = useNavigation();

  

  useEffect(() => {
    Animated.timing(sidebarAnimation, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
    toggleSidebar();
  };

  const navigateAndClose = (routeName) => {
    handleToggleSidebar();
    navigation.navigate(routeName);
  };



  const sidebarTranslateX = sidebarAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-250, 0], // Adjust the value based on the sidebar width
  });
  
  return (
    <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarTranslateX }] }]}>
      <ScrollView style={styles.sidebarContainer}>
      <View style={styles.profileContainer}>
        <Image
          source={require('../../assets/Images/logo.png')}
          style={styles.profileImage}
        />
      </View>

      <TouchableOpacity style={styles.closeButton} onPress={handleToggleSidebar}>
        <Ionicons name="close" size={24} color={colors.theme} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigateAndClose('Home')}>
        <Ionicons name="home" size={24} color={colors.theme} />
        <Text style={styles.menuItemText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigateAndClose('Projects')}>
        <Ionicons name="folder" size={24} color={colors.theme} />
        <Text style={styles.menuItemText}>Projects</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigateAndClose('Kaleidoscope')}>
        <Ionicons name="color-palette" size={24} color={colors.theme}/>
        <Text style={styles.menuItemText}>Kaleidoscope</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigateAndClose('PixelArt')}>
        <Ionicons name="grid" size={24} color={colors.theme} />
        <Text style={styles.menuItemText}>Pixel Art</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigateAndClose('LogoGenerator')}>
        <Ionicons name="layers-outline" size={24} color={colors.theme} />
        <Text style={styles.menuItemText}>Logo Maker</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigateAndClose('MockUp')}>
        <Ionicons name="phone-portrait-outline" size={24} color={colors.theme} />
        <Text style={styles.menuItemText}>MockUp</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigateAndClose('Gallery')}>
        <MaterialIcons name="description" size={24} color={colors.theme} />
        <Text style={styles.menuItemText}>Gallery</Text>
      </TouchableOpacity>
    
      <TouchableOpacity style={styles.menuItem} onPress={() => navigateAndClose('Settings')}>
        <Ionicons name="settings" size={24} color={colors.theme} />
        <Text style={styles.menuItemText}>Settings</Text>
      </TouchableOpacity>



      
    </ScrollView>
    </Animated.View>

    
  );
};

const createStyles = (colors) => StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 250, // Adjust the value based on the sidebar width
    zIndex: 1000,
    marginTop: 30,
  },
  sidebarContainer: {
    flex: 1,
    backgroundColor: colors.lightGray,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  username: {
    color: colors.black,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
  },
  menuItemText: {
    color: colors.black,
    fontSize: 18,
    marginLeft: 15,
  },
});

export default SideBar;
