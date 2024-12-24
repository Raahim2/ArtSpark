import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, Platform, Linking } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useColorContext } from '../assets/Variables/colors';

export default function DownloadBtn({ videoUrl, title, downloading, setDownloading }) {
  const [colors] = useColorContext();
  const styles = createStyles(colors);

  const downloadVideo = async () => {
    try {
      setDownloading(true);

      if (!videoUrl) {
        Alert.alert('Error', 'Video URL not found');
        return;
      }

      // Create filename from title or use default
      const filename = `${title || 'video'}.mp4`;

      if (Platform.OS === 'web') {
        // For web, open video in new tab for download
        window.open(videoUrl, '_blank');
      } else {
        // For mobile, download using FileSystem then share
        const fileUri = FileSystem.documentDirectory + filename;
        const downloadResumable = FileSystem.createDownloadResumable(
          videoUrl,
          fileUri,
          {},
          (downloadProgress) => {
            const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
            // Could add progress indicator here
          }
        );

        const { uri } = await downloadResumable.downloadAsync();

        // Share the downloaded file
        if (Platform.OS === 'ios') {
          Linking.openURL(`shareddocuments://${uri}`);
        } else {
          // For Android, you may need a different sharing approach
          // One option is to use Share API if available
          try {
            await Linking.openURL(`content://${uri}`);
          } catch (err) {
            Alert.alert('Info', 'File downloaded to: ' + uri);
          }
        }
      }

      Alert.alert('Success', 'Video downloaded successfully!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to download video');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.downloadButton}
      onPress={downloadVideo}
      disabled={downloading}
    >
      <Text style={styles.buttonText}>
        {downloading ? 'Downloading...' : 'Download Video'}
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
    marginVertical: 10
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500'
  }
});


// old method
// import React from 'react';
// import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
// import * as FileSystem from 'expo-file-system';
// import * as MediaLibrary from 'expo-media-library';
// import { useColorContext } from '../assets/Variables/colors';

// export default function DownloadBtn({ videoUrl, title, downloading, setDownloading }) {
//   const [colors] = useColorContext();
//   const styles = createStyles(colors);

//   const downloadVideo = async () => {
//     try {
//       // Request permissions
//       const { status } = await MediaLibrary.requestPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission needed', 'Please grant permission to save videos');
//         return;
//       }

//       setDownloading(true);

//       if (!videoUrl) {
//         Alert.alert('Error', 'Video URL not found');
//         return;
//       }

//       // Create filename from title or use default
//       const filename = `${title || 'video'}.mp4`;

//       // Download to temp directory first
//       const fileUri = FileSystem.documentDirectory + filename;
//       const downloadResumable = FileSystem.createDownloadResumable(
//         videoUrl,
//         fileUri,
//         {},
//         (downloadProgress) => {
//           const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
//           // Could add progress indicator here
//         }
//       );

//       const { uri } = await downloadResumable.downloadAsync();

//       // Save to media library
//       const asset = await MediaLibrary.createAssetAsync(uri);
//       await MediaLibrary.createAlbumAsync('GenTube', asset, false);

//       Alert.alert('Success', 'Video saved to your gallery!');
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'Failed to download video');
//     } finally {
//       setDownloading(false);
//     }
//   };

//   return (
//     <TouchableOpacity 
//       style={styles.downloadButton}
//       onPress={downloadVideo}
//       disabled={downloading}
//     >
//       <Text style={styles.buttonText}>
//         {downloading ? 'Downloading...' : 'Download Video'}
//       </Text>
//     </TouchableOpacity>
//   );
// }

// const createStyles = (colors) => StyleSheet.create({
//   downloadButton: {
//     backgroundColor: colors.theme,
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginVertical: 10
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '500'
//   }
// });
