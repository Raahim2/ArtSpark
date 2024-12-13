import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useColorContext } from '../assets/Variables/colors';
import { WEB_CLIENT_ID } from '@env';

const UploadBtn = ({ videoUrl }) => {
  // 341302253948-lorag64035t2k103dcqi42r7nflvg7jv.apps.googleusercontent.com
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [colors] = useColorContext();

  const handleUpload = async () => {
    setIsUploading(true);
    setUploadStatus('Uploading...');
    try {
      const response = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WEB_CLIENT_ID}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          snippet: {
            title: 'Uploaded Video',
            description: 'Video uploaded from Cloudinary URL',
            tags: ['video', 'upload'],
            categoryId: '22',
          },
          status: {
            privacyStatus: 'public',
          },
          videoUrl: videoUrl,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setUploadStatus('Upload Successful!');
      Alert.alert('Success', 'Video uploaded successfully to YouTube!', [{ text: 'OK' }]);
    } catch (error) {
      console.error('Error uploading video:', error);
      setUploadStatus('Upload Failed');
      Alert.alert('Error', `Failed to upload video: ${error.message}`, [{ text: 'OK' }]);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.button}>
      <Button onPress={handleUpload} title="Upload to YouTube" color={colors.theme} disabled={isUploading} />
      {uploadStatus ? <Text>{uploadStatus}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginBottom: 10,
    paddingBottom: 20,
    width: '100%',
  },
});

export default UploadBtn;




