import React, { useState, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Video } from 'expo-av';
import { useColorContext } from '../assets/Variables/colors';

const VideoPlayer = ({ videoSource }) => {
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);
  const [colors] = useColorContext();

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#fff" style={styles.loading} />}
      <Video
        ref={videoRef}
        source={{ uri: videoSource }}
        style={styles.video}
        onLoad={() => {
          setLoading(false);
        }}
        onError={(e) => console.error(e)}
        resizeMode="contain"
        useNativeControls={true}
        isLooping={true}
      />
    </View>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      width: '100%',
      aspectRatio: 16 / 9,
      backgroundColor: '#000',
      overflow: 'hidden',
    },
    video: {
      width: '100%',
      height: '100%',
    },
    loading: {
      position: 'absolute',
    }
  });

export default VideoPlayer;
