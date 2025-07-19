import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet  } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useColorContext } from '../../assets/Variables/colors';
import CreateModal from './FeatureSelectModal'; // Assuming the modal file is named this
import { SafeAreaView } from 'react-native-safe-area-context';


export default function BottomNavigation({ target }) {
  const navigation = useNavigation();
  const [colors] = useColorContext();
  const [modalVisible, setModalVisible] = useState(false);

  // Assuming you have a createStyles function like the one provided
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navbar}>
        {/* Home Button */}
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={24} color={target === 'Home' ? colors.theme : colors.light} />
          <Text style={target === 'Home' ? styles.navTextActive : styles.navTextInactive}>Home</Text>
        </TouchableOpacity>

        {/* Projects Button */}
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Projects')}>
          <Ionicons name="folder" size={24} color={target === 'Projects' ? colors.theme : colors.light} />
          <Text style={target === 'Projects' ? styles.navTextActive : styles.navTextInactive}>Projects</Text>
        </TouchableOpacity>

        {/* Center Floating Button Placeholder */}
        <View style={{ flex: 1, alignItems: 'center' }} />


        {/* Templates Button */}
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Gallery')}>
          <Ionicons name="document-text-outline" size={24} color={target === 'Gallery' ? colors.theme : colors.light} />
          <Text style={target === 'Gallery' ? styles.navTextActive : styles.navTextInactive}>Gallery</Text>
        </TouchableOpacity>

        {/* Settings Button */}
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings" size={24} color={target === 'Settings' ? colors.theme : colors.light} />
          <Text style={target === 'Settings' ? styles.navTextActive : styles.navTextInactive}>Settings</Text>
        </TouchableOpacity>
      </View>
      
      {/* Center Floating Button */}
      {/* Moved outside the navbar for correct layering */}
      <View style={styles.centerButtonContainer}>
        <TouchableOpacity style={styles.centerButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={32} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* ✅ FIXED: Pass the `modalVisible` state to the isVisible prop */}
      <CreateModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={(tool) => {
          setModalVisible(false); // Close modal after selection
          if (tool === 'kaleidoscope') {
            navigation.navigate('KaleidoscopeCanvas');
          } else if (tool === 'pixelArt') {
            navigation.navigate('PixelArt');
          } else if (tool === 'logoMaker') {
            navigation.navigate('LogoGenerator');
          } else if (tool === 'mockUp') {
            navigation.navigate('MockUp');
          }
        }}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 10,
    paddingBottom: 20, // Add padding for home indicator
    shadowOffset: { width: 0, height: -3 },
    height: 80, // Give a fixed height
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTextActive: {
    color: colors.theme,
    fontSize: 12,
    marginTop: 4,
  },
  navTextInactive: {
    color: colors.light,
    fontSize: 12,
    marginTop: 4,
  },
  centerButtonContainer: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -35 }],
    zIndex: 1,
  },
  centerButton: {
    backgroundColor: colors.theme,
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.white,
    borderWidth: 1,
    shadowColor: colors.black,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    elevation: 12,
  },
});