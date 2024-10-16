import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useColorContext } from '../assets/Variables/colors';

const Status = ({ status }) => {
  const [colors] = useColorContext();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.theme} />
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
  },
  statusText: {
    marginLeft: 10,
    fontSize: 16,
    color: colors.textPrimary,
  },
});

export default Status;
