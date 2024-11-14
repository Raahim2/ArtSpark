import { StyleSheet, View, SafeAreaView, ScrollView , Text , TouchableOpacity, Image} from 'react-native';
import React, { useState, useRef } from 'react';
import BottomNavigation from '../Components/BottomNavigation';
import UpperNavigation from '../Components/UpperNavigation';
import SideBar from '../Components/SideBar';
import WhatsNew from '../Components/WhatsNew';
import Icon from '../Components/Icon';
import SuggestionPrompt from '../Components/SuggestionPrompt';
import VideoPlayer from '../Components/Video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Animated } from 'react-native';
import { useColorContext } from '../assets/Variables/colors';


export default function HomeScreen() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarAnimation = useRef(new Animated.Value(0)).current;
  const [colors] = useColorContext();
  const styles = createStyles(colors);

  const toggleSidebar = () => {
    const toValue = isSidebarOpen ? 0 : 1;
    Animated.timing(sidebarAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <UpperNavigation toggleSidebar={toggleSidebar} title={"Home"} />
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} animation={sidebarAnimation} />

      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
          <WhatsNew />


          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 }}>
            <Icon iconName="videocam" label="Video" />
            <Icon iconName="film" label="Shorts" />
            <Icon iconName="people" label="Post" />
            <Icon iconName="image" label="Thumbnail" />
          </View>

          <SuggestionPrompt />

          <View style={styles.videoSection}>
            <View style={styles.videoHeader}>
              <Text style={styles.Title}>Recent Videos</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {Array(3).fill().map((_, index) => (
                <View key={index} style={styles.videoContainer}>
                  <VideoPlayer videoSource={{ uri: require('../assets/Videos/GeneratedVideo133316.mp4') }} style={styles.video} />
                </View>
              ))}

            <View style={[styles.videoContainer, { justifyContent: 'center', alignItems: 'center' }]}>
              <TouchableOpacity >
                <Icon iconName="add" size={50} />
              </TouchableOpacity>
            </View>
            </ScrollView>
          </View>

          <View style={styles.mobileVideosSection}>
            <View style={styles.mobileVideosHeader}>
              <Text style={styles.mobileVideosTitle}>Shorts Videos</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {Array(4).fill().map((_, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={require('../assets/Images/image.png')} style={styles.image} />
                </View>
              ))}

              <View style={[styles.imageContainer, { justifyContent: 'center', alignItems: 'center' , borderWidth: 1 , borderRadius: 10 }]}>
                <TouchableOpacity >
                  <Icon iconName="add" size={50} />
              </TouchableOpacity>
            </View>
            </ScrollView>
          </View>

          

          <View style={{ marginBottom: 100 }}>
          </View>



          
        </ScrollView>
      </SafeAreaView>
      
      <BottomNavigation target={'Home'}/>
    </>
  );
}

const createStyles = (colors) => StyleSheet.create({
 
  videoSection: {
    paddingHorizontal: 10,
    marginVertical: 20,
  },
  videoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  Title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  videoContainer: {
    marginRight: 15,
    width: 270,
  },
  video: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    backgroundColor: colors.lightGray,
  },
  videoLabel: {
    marginTop: 5,
    fontSize: 14,
    color: colors.text,
  },

  mobileVideosSection: {
    paddingHorizontal: 10,
    marginVertical: 20,
  },
  mobileVideosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mobileVideosTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
  },
  imageContainer: {
    marginRight: 15,
    width: 120,
  },
  image: {
    width: '100%',
    height:200,
    borderRadius: 10,
    backgroundColor: colors.lightGray,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  horizontalScrollView: {
    marginVertical: 20,
    paddingVertical: 10,
    backgroundColor: colors.lightBackground,
    borderRadius: 10,
  },
});