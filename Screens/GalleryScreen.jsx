// src/screens/GalleryScreen.jsx

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Animated, TouchableOpacity, FlatList, Image, Alert, ActivityIndicator, Dimensions } from 'react-native';
import BottomNavigation from '../Components/Home/BottomNavigation';
import UpperNavigation from '../Components/Home/UpperNavigation';
import SideBar from '../Components/Home/SideBar';
import { useColorContext } from '../assets/Variables/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

// --- SKELETON LOADER COMPONENT ---
// This component shows a placeholder while the main feed is loading.
const PostSkeleton = () => (
  <View style={styles.postContainer}>
    <View style={styles.skeletonHeader}>
      <View style={styles.skeletonAvatar} />
      <View style={styles.skeletonTextLine} styles={{ width: '30%', height: 10 }} />
    </View>
    <View style={styles.skeletonImage} />
    <View style={styles.skeletonActionBar} />
  </View>
);

// --- MAIN POST CARD COMPONENT ---
const PostCard = ({ item }) => {
  const [colors] = useColorContext();
  const styles = createPostCardStyles(colors);

  // Calculate the image's height to maintain its aspect ratio
  const imageAspectRatio = item.height / item.width;
  const imageHeight = screenWidth * imageAspectRatio;

  const showDevelopmentAlert = (action) => {
    Alert.alert("Feature In Development", `The "${action}" feature is coming soon!`);
  };

  return (
    <View style={styles.postContainer}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <Image
          source={{ uri: `https://picsum.photos/id/${item.id}/50/50` }}
          style={styles.avatar}
        />
        <Text style={styles.authorName}>{item.author}</Text>
        <TouchableOpacity style={styles.moreOptions} onPress={() => showDevelopmentAlert('More Options')}>
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Main Image */}
      <Image
        source={{ uri: item.download_url }}
        style={[styles.postImage, { height: imageHeight }]}
      />

      {/* Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionButton} onPress={() => showDevelopmentAlert('Like')}>
          <Ionicons name="heart-outline" size={28} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => showDevelopmentAlert('Comment')}>
          <Ionicons name="chatbubble-outline" size={26} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => showDevelopmentAlert('Share')}>
          <Ionicons name="paper-plane-outline" size={26} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { marginLeft: 'auto' }]} onPress={() => showDevelopmentAlert('Save')}>
          <Ionicons name="bookmark-outline" size={26} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Post Info */}
      <View style={styles.postInfo}>
        <Text style={styles.likes}>Liked by <Text style={{fontWeight: 'bold'}}>user</Text> and <Text style={{fontWeight: 'bold'}}>{(Math.random() * 1000).toFixed(0)} others</Text></Text>
        <Text style={styles.caption}><Text style={{fontWeight: 'bold'}}>{item.author}</Text> A beautiful shot!</Text>
      </View>
    </View>
  );
};

// --- MAIN SCREEN COMPONENT ---
export default function GalleryScreen() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarAnimation = useRef(new Animated.Value(0)).current;
  const [colors] = useColorContext();
  
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const fetchPosts = useCallback(async (currentPage) => {
    if (isFetchingMore) return; // Prevent multiple fetches at once

    if (currentPage === 1) setIsLoading(true);
    else setIsFetchingMore(true);

    try {
      // Fetching 10 items at a time
      const response = await fetch(`https://picsum.photos/v2/list?page=${currentPage}&limit=10`);
      const newPosts = await response.json();
      
      setPosts(prevPosts => currentPage === 1 ? newPosts : [...prevPosts, ...newPosts]);

    } catch (error) {
      console.error("Failed to fetch posts:", error);
      Alert.alert("Error", "Could not load the feed.");
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, [isFetchingMore]);

  useEffect(() => {
    fetchPosts(1); // Fetch initial posts
  }, []);

  const handleLoadMore = () => {
    const newPage = page + 1;
    setPage(newPage);
    fetchPosts(newPage);
  };

  const toggleSidebar = () => {
      const toValue = isSidebarOpen ? 0 : 1;
      Animated.timing(sidebarAnimation, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setIsSidebarOpen(!isSidebarOpen);
    };

  if (isLoading) {
    // Show a list of skeletons during the very first load
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <UpperNavigation toggleSidebar={() => {}} title={"Gallery"} />
        <View>
          <PostSkeleton />
          <PostSkeleton />
        </View>
        <BottomNavigation target={"Gallery"}/>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <UpperNavigation toggleSidebar={toggleSidebar} title={"Gallery"} />
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} animation={sidebarAnimation} />
      
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostCard item={item} />}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.8}
        ListFooterComponent={isFetchingMore ? <ActivityIndicator style={{ marginVertical: 20 }} size="large" color={colors.theme} /> : null}
      />
      
      <BottomNavigation target={"Templates"}/>
    </SafeAreaView>
  );
}

// Styles for the main PostCard component
const createPostCardStyles = (colors) => StyleSheet.create({
  postContainer: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 8,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  authorName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  moreOptions: {
    marginLeft: 'auto',
  },
  postImage: {
    width: screenWidth,
    backgroundColor: '#F0F0F0', // Placeholder color
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionButton: {
    padding: 8,
  },
  postInfo: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  likes: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  caption: {
    fontSize: 14,
    color: colors.text,
  },
});

// Styles for the Skeleton loading placeholder
const styles = StyleSheet.create({
    postContainer: {
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EAEAEA',
        marginBottom: 8,
    },
    skeletonHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    skeletonAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#EAEAEA',
        marginRight: 10,
    },
    skeletonTextLine: {
        height: 12,
        borderRadius: 4,
        backgroundColor: '#EAEAEA',
    },
    skeletonImage: {
        width: '100%',
        height: 400,
        backgroundColor: '#EAEAEA',
    },
    skeletonActionBar: {
        height: 40,
        width: '100%',
        marginTop: 10,
        backgroundColor: '#F5F5F5',
    }
});