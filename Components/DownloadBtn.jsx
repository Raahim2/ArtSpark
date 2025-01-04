import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useColorContext } from '../assets/Variables/colors';

export default function DownloadBtn({ videoUrl, title, downloading, setDownloading }) {
  const [colors] = useColorContext();
  const [progress, setProgress] = useState(0); // Track progress percentage
  const styles = createStyles(colors);

  const downloadVideo = async () => {
    try {
      // Request permissions to access the media library
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to save videos');
        return;
      }

      setDownloading(true);

      if (!videoUrl) {
        Alert.alert('Error', 'Video URL not found');
        return;
      }

      // Create filename from title or use default
      const filename = `${title || 'video'}.mp4`;

      // Use cacheDirectory or externalStorageDirectory for Android
      const fileUri = FileSystem.cacheDirectory + filename; // For Android, use cacheDirectory

      // Download the file to the document directory
      const downloadResumable = FileSystem.createDownloadResumable(
        videoUrl,
        fileUri,
        {},
        (downloadProgress) => {
          const currentProgress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          setProgress(currentProgress); // Update progress
        }
      );

      const { uri } = await downloadResumable.downloadAsync();

      // Save the downloaded video to the media library (gallery)
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('Downloads', asset, false);

      Alert.alert('Success', 'Video saved to your gallery!');
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download video ' + error);
    } finally {
      setDownloading(false);
      setProgress(0); // Reset progress after download completes
    }
  };

  return (
    <TouchableOpacity 
      style={styles.downloadButton}
      onPress={downloadVideo}
      disabled={downloading}
    >
      <Text style={styles.buttonText}>
        {downloading ? `Downloading... ${Math.round(progress * 100)}%` : 'Download Video'}
      </Text>
    </TouchableOpacity>
  );
}

const createStyles = (colors) => StyleSheet.create({
  downloadButton: {
    backgroundColor: colors.theme,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
