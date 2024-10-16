import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import React, { useState, useRef } from 'react';
import BottomNavigation from '../Components/BottomNavigation';
import UpperNavigation from '../Components/UpperNavigation';
import UserProfile from '../Components/UserProfile';
import Card from '../Components/Card';
import SideBar from '../Components/SideBar';
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
        <UserProfile avatar={'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/perplexity-ai-icon.png'} username={'Perplexity AI'} subscribers={'3.5M'} />
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={true}>
          {Array.from({ length: 10 }).map((_, index) => (
            <Card 
              key={index} 
              thumbnail={'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/perplexity-ai-icon.png'} 
              title={"This Is A Video's Title"} 
              channelName={"Channel Name"} 
              views={"1M"} 
              uploadTime={"1 day ago"} 
              duration={"10:00"} 
              onPress={() => console.log('Card pressed')}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
      
      <BottomNavigation target={'Home'}/>
    </>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
});