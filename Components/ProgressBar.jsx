import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useColorContext } from '../assets/Variables/colors';

const ProgressBar = ({ time }) => {
  const progress = useRef(new Animated.Value(0)).current;
  const [colors] = useColorContext();
  const styles = createStyles(colors);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: time * 1000, // Convert time from seconds to milliseconds
      useNativeDriver: false,
    }).start();
  }, [time]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.progressBar, { width }]} />
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    height: 10,
    width: '100%',
    backgroundColor: colors.lightGray,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.theme,
  },
});

export default ProgressBar;
