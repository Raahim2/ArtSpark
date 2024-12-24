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
    setTimeout(() => setShowIcon(false), 500);
  };

  const handleSliderValueChange = async (value) => {
    const seekPosition = value * duration;
    await videoRef.current.setPositionAsync(seekPosition);
    setPosition(seekPosition);
  };

  return (
    <View style={styles.container}>
      {/* Video */}
      <TouchableOpacity style={styles.videoContainer} onPress={handlePlayPause} activeOpacity={0.9}>
        {loading && <ActivityIndicator size="large" color="#fff" style={styles.loading} />}
        <Video
          ref={videoRef}
          source={{ uri: videoSource }}
          style={styles.video}
          onLoad={(status) => {
            setLoading(false);
            setDuration(status.durationMillis);
          }}
          onError={(e) => console.error(e)}
          resizeMode="contain"
          shouldPlay={false}
          onPlaybackStatusUpdate={(status) => {
            setPosition(status.positionMillis);
            if (status.didJustFinish) {
              setIsPlaying(false);
            }
          }}
        />

        {/* Play/Pause Button */}
        {showIcon && (
          <View style={styles.playPauseButton}>
            <MaterialIcons
              name={isPlaying ? "pause" : "play-arrow"}
              size={50}
              color="#fff"
            />
          </View>
        )}
      </TouchableOpacity>

      {/* Progress Slider */}
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={position / duration}
        onValueChange={handleSliderValueChange}
        minimumTrackTintColor={colors.theme}
        maximumTrackTintColor="#888"
        thumbTintColor={colors.theme}
      />
    </View>
  );
};

const createStyles = (colors ) =>
  StyleSheet.create({
    container: {
      width: '100%',
      aspectRatio: 16 / 9,
      backgroundColor: '#000',
      overflow: 'hidden',
    },
    videoContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    video: {
      width: '100%',
      height: '100%',
    },
    loading: {
      position: 'absolute',
    },
    playPauseButton: {
      position: 'absolute',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    slider: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: 20,
      zIndex: 10,
    },
  });

export default VideoPlayer;
