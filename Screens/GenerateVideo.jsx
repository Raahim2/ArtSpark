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
import { useColorContext } from '../assets/Variables/colors';

export default function GenerateVideo() {
  const [colors] = useColorContext();
  const styles = createStyles(colors);
  const [duration, setDuration] = useState(200);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarAnimation = useRef(new Animated.Value(0)).current;
  const [videoData, setVideoData] = useState(null);
  const [isThumbnailGenerated, setIsThumbnailGenerated] = useState(false);
  const [videoStatus, setVideoStatus] = useState("Generating Video...");
  const [videoSource, setVideoSource] = useState(null);
  const rotation = useRef(new Animated.Value(0)).current;


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
    Alert.alert('Notice', 'Video generation started', [{ text: 'OK' }]);
    setIsThumbnailGenerated(false);
    setDuration(200);
    // Step 1: Generate Video Information
    setVideoStatus('Generating Video ...');
    try {
      const response = await fetch('http://192.168.0.103:5000/generateVideo/Step1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, duration: 10 }),
      });

      const data = await response.json();
      if (response.ok) {
        setVideoData({
          title: data.title,
          description: data.description,
        });
      } 
    } catch (error) {
      console.log(error);
    }

    setVideoStatus('Generating Thumbnail ...');
    // Generate Thumbnail
    try {
      const imageResponse = await fetch('http://192.168.0.103:5000/generateThumbnail', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const imageData = await imageResponse.json();
      if (imageResponse.ok) {
        Alert.alert('Success', 'Image generated successfully', [{ text: 'OK' }]);
        setIsThumbnailGenerated(true);
      } 
    } catch (error) {
      console.log(error);
    }

    setIsThumbnailGenerated(true);


    // Step 2: Generate Media
    setVideoStatus('Generating Media...');
    try {
      const mediaResponse = await fetch('http://192.168.0.103:5000/generateVideo/Step2', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.log(error);
    }


    // Step 3: Animate Media

    setVideoStatus('Animating Media...');
    try {
      const animateResponse = await fetch('http://192.168.0.103:5000/generateVideo/Step3', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.log(error);
    }

    // Step 4: Compile Video
    setVideoStatus('Compiling Video...');
    try {
      const compileResponse = await fetch('http://192.168.0.103:5000/generateVideo/Step4', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.log(error);
    }

    // Step 5: Generate Subtitles
    setVideoStatus('Generating Subtitles...');
    try {
      const subtitleResponse = await fetch('http://192.168.0.103:5000/generateVideo/Step5', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.log(error);
    }

    // Step 6: Transcribe Audio
    setVideoStatus('Transcribing Audio...');
    try {
      const transcribeResponse = await fetch('http://192.168.0.103:5000/generateVideo/Step6', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const transcribeData = await transcribeResponse.json();
      const filePath = transcribeData.file_path;
      console.log('File path:', filePath);
      setVideoSource({ uri: filePath });

     
    } catch (error) {
      console.log(error);
    }
    setVideoStatus('Video Generation Completed!');
    Alert.alert('Success', 'Video generation completed', [{ text: 'OK' }]);

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
    const dummyFilePath = require('../assets/Videos/GeneratedVideo133316.mp4');
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
              <Thumbnail isGenerating={!isThumbnailGenerated} />
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
        {/* <PromptInput onSend={(prompt) => generateVideo(prompt)} /> */}
        <PromptInput onSend={(prompt) => dummyGenerateVideo(prompt)} />
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
