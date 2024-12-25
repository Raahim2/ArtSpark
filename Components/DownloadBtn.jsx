import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, Linking } from 'react-native';
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

      // Simulate download delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Open video URL in browser/external player
      if (videoUrl.uri) {
        await Linking.openURL(videoUrl.uri);
      } else {
        await Linking.openURL(videoUrl);
      }

      Alert.alert('Success', 'Video opened successfully!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to open video');
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
        {downloading ? 'Opening...' : 'Open Video'}
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
