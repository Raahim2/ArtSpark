import { StyleSheet, View, Text, Animated, TouchableOpacity, ScrollView, Image, Alert } from 'react-native'
import React, { useState, useRef } from 'react'
import BottomNavigation from '../Components/BottomNavigation'
import UpperNavigation from '../Components/UpperNavigation'
import SideBar from '../Components/SideBar'
import { useColorContext } from '../assets/Variables/colors';

export default function TemplatesScreen() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarAnimation = useRef(new Animated.Value(0)).current;
  const [colors] = useColorContext();
  const styles = createStyles(colors);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const toggleSidebar = () => {
    const toValue = isSidebarOpen ? 0 : 1;
    Animated.timing(sidebarAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsSidebarOpen(!isSidebarOpen);
  };

  const showDevelopmentAlert = () => {
    Alert.alert(
      "Under Development",
      "This feature is currently under development.",
      [{ text: "OK" }]
    );
  };

  const categories = ['All', 'Trending', 'Popular', 'Recent'];
  const featuredTemplates = [
    {
      id: 1,
      title: 'Gaming Stream Overlay',
      description: 'Perfect for Twitch and YouTube Gaming',
      image: require('../assets/Images/Background.png'),
      downloads: '2.3k'
    },
    {
      id: 2,
      title: 'Podcast Cover Art',
      description: 'Professional podcast thumbnails',
      image: require('../assets/Images/Background.png'),
      downloads: '1.8k'
    },
    // Add more templates as needed
  ];

  return (
    <>
      <UpperNavigation toggleSidebar={toggleSidebar} title={"Templates"} />
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} animation={sidebarAnimation} />
      
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Discover Templates</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((category) => (
            <TouchableOpacity 
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategory
              ]}
              onPress={showDevelopmentAlert}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText
              ]}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.templatesGrid}>
          {featuredTemplates.map((template) => (
            <TouchableOpacity key={template.id} style={styles.templateCard} onPress={showDevelopmentAlert}>
              <Image source={template.image} style={styles.templateImage} />
              <View style={styles.templateInfo}>
                <Text style={styles.templateTitle}>{template.title}</Text>
                <Text style={styles.templateDescription}>{template.description}</Text>
                <View style={styles.templateStats}>
                  <Text style={styles.downloads}>↓ {template.downloads}</Text>
                  <TouchableOpacity style={styles.useButton} onPress={showDevelopmentAlert}>
                    <Text style={styles.useButtonText}>Use Template</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      <BottomNavigation target={"Templates"}/>
    </>
  )
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.theme,
    margin: 20,
  },
  categoryScroll: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
  },
  selectedCategory: {
    backgroundColor: colors.theme,
  },
  categoryText: {
    fontSize: 16,
    color: colors.text,
  },
  selectedCategoryText: {
    color: colors.white,
  },
  templatesGrid: {
    padding: 15,
  },
  templateCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  templateImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  templateInfo: {
    padding: 15,
  },
  templateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  templateDescription: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 10,
  },
  templateStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  downloads: {
    fontSize: 14,
    color: colors.gray,
  },
  useButton: {
    backgroundColor: colors.theme,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  useButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
})
