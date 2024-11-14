import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useColorContext } from '../assets/Variables/colors';

const Icon = ({ iconName, label }) => {
  const [colors] = useColorContext();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.iconBackground}>
        <Ionicons name={iconName} size={35} color={colors.white} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  iconBackground: {
    backgroundColor: colors.theme,
    borderRadius: 100,
    padding: 10,
  },
  label: {
    marginTop: 5,
    color: colors.theme,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Icon;
