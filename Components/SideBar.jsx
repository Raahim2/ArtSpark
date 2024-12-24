import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Animated } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useColorContext } from '../assets/Variables/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const SideBar = ({ isOpen, toggleSidebar  }) => {
  const sidebarAnimation = useRef(new Animated.Value(0)).current;
  const [colors] = useColorContext();
  const styles = createStyles(colors);
  const [username, setUsername] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername); // Set the retrieved username to state
        } else {
          console.log('No username found');
        }
      } catch (error) {
        console.error('Error retrieving username:', error);
      }
    };

    fetchUsername();
  }, []);


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

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.navigate('Login');
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
          source={require('../assets/Images/logo.png')}
          style={styles.profileImage}
        />
        <Text style={styles.username}>{username}</Text>
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

      <TouchableOpacity style={styles.menuItem} onPress={() => navigateAndClose('GenerateVideo')}>
        <MaterialIcons name="video-library" size={24} color={colors.theme} />
        <Text style={styles.menuItemText}>Create Video</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigateAndClose('Templates')}>
        <MaterialIcons name="description" size={24} color={colors.theme} />
        <Text style={styles.menuItemText}>Templates</Text>
      </TouchableOpacity>
    
      <TouchableOpacity style={styles.menuItem} onPress={() => navigateAndClose('Settings')}>
        <Ionicons name="settings" size={24} color={colors.theme} />
        <Text style={styles.menuItemText}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
        <Ionicons name="log-out" size={24} color={colors.theme} />
        <Text style={styles.menuItemText}>Logout</Text>
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
