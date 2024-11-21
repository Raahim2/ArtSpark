import React, { useState, useRef  , useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Animated, Alert, Image } from 'react-native';

import BottomNavigation from '../Components/BottomNavigation';
import UpperNavigation from '../Components/UpperNavigation';
import SideBar from '../Components/SideBar';
import PromptInput from '../Components/PromptInput';
import ProgressBar from '../Components/ProgressBar';
import Thumbnail from '../Components/Thumbnail';
import VideoInfo from '../Components/VideoInfo';
import VideoPlayer from '../Components/Video';

import generateInfo from '../VideoGenerationCode/JavaScriptReact/VideoGeneration/InfoGenerator';
import generateThumbnail from '../VideoGenerationCode/JavaScriptReact/VideoGeneration/ThumbnailGenerator';
import getPexelsVideos from '../VideoGenerationCode/JavaScriptReact/VideoGeneration/MediaGeneration';
import ConcatVideos from '../VideoGenerationCode/JavaScriptReact/VideoGeneration/Concatination';


import { useColorContext } from '../assets/Variables/colors';
import { GENTUBE_API_KEY } from '@env'


export default function GenerateVideo() {

  
  const [colors] = useColorContext();
  const styles = createStyles(colors);
  const [duration, setDuration] = useState(200);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarAnimation = useRef(new Animated.Value(0)).current;
  const [videoData, setVideoData] = useState(null);
  const [isThumbnailGenerated, setIsThumbnailGenerated] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [videoStatus, setVideoStatus] = useState("Generating Video...");
  const [videoSource, setVideoSource] = useState(null);
  const rotation = useRef(new Animated.Value(0)).current;
  const apiUrl = "https://api-for-test.vercel.app/";
  

  const toggleSidebar = () => {
    const toValue = isSidebarOpen ? 0 : 1;
    Animated.timing(sidebarAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsSidebarOpen(!isSidebarOpen);
  };

  const startLogoRotation = () => {
    rotation.setValue(0);
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  };

  useEffect(() => {
    startLogoRotation();
  }, []);

  const rotationInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const rotatingStyle = {
    transform: [{ rotate: rotationInterpolate }],
  };


  const generateVideo = async (prompt) => {
    console.log("Before Generating Video");
    // const videoData = await generateVideoInfo(prompt);
    // const videoId = await uploadVideoData(videoData.title, videoData.description, videoData.duration, videoData.oneWord, videoData.createdAt);
    
    // setVideoStatus('Generating Thumbnail...');
    // const thumbnailUrl = await generateThumbnail(videoData.title);
    // console.log("Thumbnail URL:", thumbnailUrl);

    // setIsThumbnailGenerated(true);
    // setThumbnailUrl(thumbnailUrl);

    // const addThumbnail = await updateCollection(videoId, "thumbnail_url", thumbnailUrl)
    // console.log("\n\n"+addThumbnail.message); 

    // const urls = await getPexelsVideos(videoData.oneWord, videoData.duration);
    // const urls = await getPexelsVideos("Waterfall", 20);
    // console.log(urls);

    urls = ["https://videos.pexels.com/video-files/3173312/3173312-hd_1920_1080_30fps.mp4", "https://videos.pexels.com/video-files/3173313/3173313-uhd_2560_1440_30fps.mp4"]

    // const addUrls = await updateCollection(videoId, "video_urls", urls)
    // console.log("\n\n"+addUrls.message);
    ConcatVideos(urls, "../../assets/Videos/concat.mp4");





    
    console.log("After Video Generation");
  };

  const generateVideoInfo = async (prompt) => {j
    console.log("Prompt:", prompt);
    const initialVideoData = {
      title: "Generating...",
      description: "Generating...",
      id: null,
    };
    setVideoData(initialVideoData);
    setVideoStatus('Generating Video Information...');

    try {
      const videoInfo = await generateInfo(prompt, 10); 
      const newVideoData = {
        prompt: prompt,
        title: videoInfo["Video Title"],
        description: videoInfo["Video Description"],
        duration: videoInfo["Video Duration"],
        oneWord: videoInfo["OneWord"],
        createdAt: new Date().toLocaleDateString('en-GB'),
      };
      setVideoData(newVideoData);
      setVideoStatus('Video Information Generated Successfully');
      return newVideoData;
    } catch (error) {
      console.error('Error generating video information:', error);
      setVideoStatus('Error generating video information');
    }

  }

  const uploadVideoData = async (title, description, duration, oneWord, createdAt) => {
    console.log("Uploading Video Data...\n\n");
    setVideoStatus('Uploading Video Data...');

    try {
      const response = await fetch(`${apiUrl}uploadData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': GENTUBE_API_KEY,
        },
        body: JSON.stringify({
          title: title,
          description: description,
          duration: duration,
          oneWord: oneWord,
          createdAt: createdAt,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error('Error uploading video data:', errorMessage);
        setVideoStatus('Error uploading video data');
        return;
      }

      const responseData = await response.json();
      console.log('Project ID:', responseData.project_id);
      setVideoStatus('Video Data Uploaded Successfully');
      return responseData.project_id;

    } catch (error) {
      console.error('An error occurred while uploading video data:', error.toString());
      setVideoStatus('Error uploading video data');
    }
  };

  const updateCollection = async (projectId, key, value) => {

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': GENTUBE_API_KEY,
    };

    const payload = {
      project_id: projectId,
      key: key,
      value: value,
    };

    try {
      const response = await fetch(`${apiUrl}updateCollection`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Error updating collection:", errorMessage);
        return null;
      }

      const responseData = await response.json();
      return responseData;

    } catch (error) {
      console.error("An error occurred:", error.toString());
      return null;
    }
  };

  
  

 
  const dummyGenerateVideo = async (prompt) => {
    setVideoStatus('Initializing...');
    setVideoSource(null);
    setIsThumbnailGenerated(false);

    const dummyVideoData = {
      title: 'Dummy Video Title',
      description: 'This is a dummy description for the generated video.',
    };
    setVideoData(dummyVideoData);

    // Step 1: Process Prompt
    setVideoStatus('Processing Prompt...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 2: Generate Thumbnail
    setVideoStatus('Generating Thumbnail...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsThumbnailGenerated(true);

    // Step 3: Fetch Video Data
    setVideoStatus('Fetching Video Data...');
    await new Promise(resolve => setTimeout(resolve, 2000));


    // Step 4: Compile Video
    setVideoStatus('Compiling Video...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 5: Generate Subtitles
    setVideoStatus('Generating Subtitles...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 6: Transcribe Audio
    setVideoStatus('Transcribing Audio...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    const dummyFilePath = require('../assets/Videos/concat.mp4');
    console.log('File path:', dummyFilePath);
    setVideoSource({ uri: dummyFilePath });

    setVideoStatus('Video Generation Completed!');
    Alert.alert('Success', 'Video generation completed', [{ text: 'OK' }]);
  };






  return (
    <>
      <UpperNavigation toggleSidebar={toggleSidebar} title={"Generate Video"} />
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} animation={sidebarAnimation} />

      <ScrollView style={styles.container} >
        {videoData ? (
          <>
            <Text style={styles.videoStatus}>{videoStatus}</Text>
            <ProgressBar time={duration} />
            {videoSource ? (
              <VideoPlayer videoSource={videoSource} />
            ) : (
              <Thumbnail isGenerating={!isThumbnailGenerated} thumbnailUrl={thumbnailUrl} />
            )}
            <VideoInfo 
              title={videoData.title}
              description={videoData.description}
              visibility="Public"
              location="New York"
              isRemixingAllowed={true}
              isCommentsEnabled={true}
            />
          </>
        ) : (
          <>
          
          <View style={styles.imageContainer}>            
            <Animated.Image source={require('../assets/Images/logo.png')} style={[styles.image, rotatingStyle]} />
          </View>
          </>      
        )}
        
      </ScrollView>

      <View style={styles.promptContainer}>
        <PromptInput onSend={(prompt) => generateVideo(prompt)} />
        {/* <PromptInput onSend={uploadVideoData} /> */}

        


        {/* <PromptInput onSend={(prompt) => dummyGenerateVideo(prompt)} /> */}
      </View>

      <BottomNavigation />
    </>
  );
}

const createStyles = (colors) => StyleSheet.create({
  video: {
    width: '100%',
    height: 200,
    backgroundColor: colors.lightGray,
  },
  container: {
    padding: 15,
    display:'flex',
    backgroundColor: colors.white,
  },
  image: {
    height: 150, 
    width: 150,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    marginVertical: '50%',
  },
  videoStatus: {
    color: colors.theme,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  promptContainer: {
    backgroundColor: colors.lightGray,
  },
});
