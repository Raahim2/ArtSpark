import React from 'react';
import { View, Button, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

const UploadBtn = () => {
  // Function to handle the video upload
  const uploadVideoToYouTube = async () => {
    // Replace with your OAuth 2.0 Client ID and redirect URI
    const CLIENT_ID = '838387931902-u01k9esgbclijvkmb3ls5vh0g00au71l.apps.googleusercontent.com';
    const REDIRECT_URI = 'https://auth.expo.io/@raahim2/GenTube';

    // Step 1: Authenticate user
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/youtube.upload&redirect_uri=${REDIRECT_URI}&response_type=token&client_id=${CLIENT_ID}`;

    // Open the authentication URL in a browser
    const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);

    // Step 2: Extract the access token from the URL
    const { url } = result;
    const token = url.split('access_token=')[1]?.split('&')[0];

    if (!token) {
      Alert.alert('Authentication failed', 'Unable to retrieve access token.');
      return;
    }

    // Step 3: Prepare video file
    const videoUri = '../assets/Videos/GeneratedVideo170653.mp4'; // Change this to your video file path
    const file = {
      uri: videoUri,
      type: 'video/mp4',
      name: 'Temp.mp4',
    };

    // Step 4: Make the API request to upload the video
    const uploadUrl = 'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status';
    const videoMetadata = {
      snippet: {
        title: 'Test Video',
        description: 'This is a test video upload.',
        tags: ['test', 'video'],
        categoryId: '22', // Choose an appropriate category ID
      },
      status: {
        privacyStatus: 'public', // or 'private', 'unlisted'
      },
    };

    const formData = new FormData();
    formData.append('video', file);
    formData.append('metadata', JSON.stringify(videoMetadata));

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: formData,
      });

      const responseData = await response.json();
      if (response.ok) {
        Alert.alert('Success', `Video uploaded successfully! Video ID: ${responseData.id}`);
      } else {
        Alert.alert('Upload failed', responseData.error.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred during upload.');
    }
  };

  return (
    <View>
      <Button title="Upload Video" onPress={uploadVideoToYouTube} />
    </View>
  );
};

export default UploadBtn;
