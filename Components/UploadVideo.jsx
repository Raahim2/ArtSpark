import React from 'react';
import { Button, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';

const UploadBtn = ({ videoUrl, accessToken, title = "Default Title", description = "Default Description" }) => {
  const uploadVideo = async () => {
    if (!videoUrl || !accessToken) {
      Alert.alert("Error", "Missing video URL or access token.");
      return;
    }

    try {
      console.log("Step 1: Downloading video from URL");
      const videoFileUri = `${FileSystem.cacheDirectory}video.mp4`;
      const videoDownload = await FileSystem.downloadAsync(videoUrl, videoFileUri);

      console.log("Step 2: Starting resumable upload session");
      const metadata = {
        snippet: {
          title: title,
          description: description,
          tags: ["sample", "video"],
          categoryId: "22", // 22 = People & Blogs
        },
        status: {
          privacyStatus: "private", // or "public", "unlisted"
        },
      };

      const startUploadResponse = await fetch(
        "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(metadata),
        }
      );

      if (!startUploadResponse.ok) {
        const errorText = await startUploadResponse.text();
        console.error("Failed to start resumable upload:", errorText);
        Alert.alert("Error", "Failed to start upload session. Please try again.");
        return;
      }

      const uploadUrl = startUploadResponse.headers.get("Location");

      console.log("Step 3: Uploading video in chunks");

      const videoFileStat = await FileSystem.getInfoAsync(videoFileUri, { size: true });
      const videoFileSize = videoFileStat.size;

      // Read the video file as binary
      const videoFileData = await FileSystem.readAsStringAsync(videoFileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      // Convert the Base64 data to binary (Uint8Array)
      const videoData = Uint8Array.from(atob(videoFileData), (c) => c.charCodeAt(0));

      // Initialize variables for chunked upload
      const chunkSize = 5 * 1024 * 1024; // 5MB chunk size
      let offset = 0;

      // Upload the video in chunks
      while (offset < videoFileSize) {
        const chunk = videoData.slice(offset, offset + chunkSize);

        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Length": chunk.byteLength.toString(),
            "Content-Range": `bytes ${offset}-${offset + chunk.byteLength - 1}/${videoFileSize}`,
            "Content-Type": "video/mp4",
          },
          body: chunk,
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error("Upload chunk error:", errorText);
          Alert.alert("Error", "Failed to upload video chunk. Please try again.");
          return;
        }

        offset += chunkSize;
        console.log(`Uploaded chunk ${offset} of ${videoFileSize}`);
      }

      console.log("Step 4: Handling API response");
      Alert.alert("Success", "Video uploaded successfully!", [{ text: "OK" }]);

    } catch (error) {
      console.error("Video upload failed:", error);
      Alert.alert("Error", "Failed to upload video. Please try again.");
    }
  };

  return <Button title="Upload Video" onPress={uploadVideo} />;
};

export default UploadBtn;
