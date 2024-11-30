import React, { useState, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useColorContext } from '../assets/Variables/colors';

const VideoPlayer = ({ videoSource }) => {
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const [colors] = useColorContext();
  const styles = createStyles(colors);

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pauseAsync();
    } else {
      videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
    setShowIcon(true);
    setTimeout(() => setShowIcon(false), 500); // Hide icon after 0.5 seconds
  };

  const handleSliderValueChange = async (value) => {
    const seekPosition = value * duration;
    await videoRef.current.setPositionAsync(seekPosition);
    setPosition(seekPosition);
  };

  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator
          size="large"
          color="#fff"
          style={styles.loading}
        />
      )}
      <View style={styles.videoContainer} onTouchEnd={handlePlayPause}>
        <Video
          ref={videoRef}
          source={{ uri: videoSource }}
          style={styles.video}
          onLoad={(status) => {
            setLoading(false);
            setDuration(status.durationMillis);
          }}
          onError={(e) => console.error(e)}
          resizeMode="cover"
          shouldPlay={false}
          onPlaybackStatusUpdate={(status) => {
            setPosition(status.positionMillis);
            if (status.didJustFinish) {
              setIsPlaying(false);
            }
          }}
        />
        {showIcon && (
          <View style={styles.playPauseButton}>
            <MaterialIcons
              name={isPlaying ? "pause" : "play-arrow"}
              size={32}
              color="#fff"
            />
          </View>
        )}
      </View>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={position / duration}
        onValueChange={handleSliderValueChange}
        minimumTrackTintColor={colors.theme}
        maximumTrackTintColor="#fff"
        thumbTintColor={colors.theme}
      />
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    marginVertical: 20,
    overflow: 'hidden',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.theme,
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playPauseButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -16 }, { translateY: -16 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slider: {
    width: '100%',
    position: 'absolute',
    bottom: 10,
  },
});

export default VideoPlayer;
