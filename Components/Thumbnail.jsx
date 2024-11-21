import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Status from './Status';
import { useColorContext } from '../assets/Variables/colors';

export default function Thumbnail({ isGenerating, thumbnailUrl }) {
  const [colors] = useColorContext();
  const styles = createStyles(colors);

  return (
    <View style={styles.thumbnailContainer}>
      <Image
        source={isGenerating ? { uri: 'https://via.placeholder.com/400x300/FFFFFF/FFFFFF' } : { uri: thumbnailUrl }}
        style={styles.thumbnail}
      />
      {isGenerating && (
        <View style={styles.statusContainer}>
          <Status status="Generating Thumbnail" />
        </View>
      )}
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  thumbnailContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 20,
    borderColor: colors.theme,
    borderWidth: 2,
    overflow: 'hidden',
    borderRadius: 15,
    backgroundColor: colors.background,
  },
  
  thumbnail: {
    width: '100%',
    height: 'auto',
    aspectRatio: 16 / 9,
    backgroundColor: colors.lightGray,
    borderRadius: 10,
  },
  
  statusContainer: {
    position: 'absolute',
    top: '45%',
    left: '30%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    backgroundColor: colors.overlay,
    borderRadius: 5,
  },
});
