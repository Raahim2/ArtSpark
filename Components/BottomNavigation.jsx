import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useColorContext } from '../assets/Variables/colors';

export default function BottomNavigation({ target  }) {
  const navigation = useNavigation();
  const [colors] = useColorContext();
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

        {/* Center Floating Button */}
        <View style={styles.centerButtonContainer}>
          <TouchableOpacity style={styles.centerButton} onPress={() => navigation.navigate('GenerateVideo', { projectCategory: 'Video' })}>
            <View style={styles.centerButtonIcon}>
              <Ionicons name="add" size={24} color={colors.white} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Button */}
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Templates')}>
          <Ionicons name="document-text-outline" size={24} color={target === 'Templates' ? colors.theme : colors.light} />
          <Text style={target === 'Templates' ? styles.navTextActive : styles.navTextInactive}>Templates</Text>
        </TouchableOpacity>

        {/* Settings Button */}
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings" size={24} color={target === 'Settings' ? colors.theme : colors.light} />
          <Text style={target === 'Settings' ? styles.navTextActive : styles.navTextInactive}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    backgroundColor: colors.lightGray, 
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 10,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -3 },
    elevation: 10, 
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
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
    bottom: 25,
    left: '50%',
    transform: [{ translateX: -35}],
    zIndex: 1,
  },
  centerButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButtonIcon: {
    backgroundColor: colors.theme, 
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.white,
    borderWidth: 5,
  },
});
