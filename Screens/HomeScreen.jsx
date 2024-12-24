import { StyleSheet, View, SafeAreaView, ScrollView , Text , TouchableOpacity, Image} from 'react-native';
import React, { useState, useRef  , useEffect , } from 'react';
import { useNavigation } from '@react-navigation/native';
import BottomNavigation from '../Components/BottomNavigation';
import UpperNavigation from '../Components/UpperNavigation';
import SideBar from '../Components/SideBar';
import WhatsNew from '../Components/WhatsNew';
import Icon from '../Components/Icon';
import SuggestionPrompt from '../Components/SuggestionPrompt';
import ProjectItem from '../Components/ProjectItem';
import VideoPlayer from '../Components/Video';
import { ActivityIndicator } from 'react-native';
import { Animated } from 'react-native';
import { useColorContext } from '../assets/Variables/colors';
import { GENTUBE_API_KEY } from '@env';



export default function HomeScreen() {
  const navigation = useNavigation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarAnimation = useRef(new Animated.Value(0)).current;
  const [colors] = useColorContext();
  const styles = createStyles(colors);
  const apiUrl = 'https://api-for-test.vercel.app';  // Replace with your actual Vercel URL


  const fetchProjects = async () => {
    setLoading(true); // Set loading to true before the request

    try {
      const response = await fetch(`${apiUrl}/MongoDB/GetProjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': GENTUBE_API_KEY,
        },
        body: JSON.stringify({})  // Add an empty object or any required payload
      });
      

      if (!response.ok) {
        const errorMessage = await response.text();
        setError(`Error Fetching Projects: ${errorMessage}`); // Set error state
        setLoading(false); 
        return;
      }

      const responseData = await response.json();
      setProjects(responseData);
      setLoading(false);  // Set loading to false after successful request

    } catch (error) {
      setError(`Error: ${error.message}`);  // Update error state if there's an exception
      setLoading(false); // Set loading to false
    }
  };

  useEffect(() => {
    fetchProjects();  
  }, []);


  const VideoProjects = projects.filter((project) => {
    const categoryMatch = project.category === 'Video';
    return categoryMatch 
  });

  const ShortsProjects = projects.filter((project) => {
    const categoryMatch = project.category === 'Shorts';
    return categoryMatch 
  });

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
      {/* <VideoPlayer videoSource={"https://res.cloudinary.com/defyovyob/video/upload/v1734363387/vxyfyasg1gnjxxiyosv4.mp4"}  /> */}
      <UpperNavigation toggleSidebar={toggleSidebar} title={"Home"} />
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} animation={sidebarAnimation} />

      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
          <WhatsNew />


          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 }}>
            <TouchableOpacity onPress={() => navigation.navigate('GenerateVideo', { projectCategory: 'Video' })}>
              <Icon iconName="videocam" label="Video" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('GenerateVideo', { projectCategory: 'Shorts' })}>
              <Icon iconName="film" label="Shorts" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('GenerateVideo', { projectCategory: 'Post' })}>
              <Icon iconName="people" label="Post" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('GenerateVideo', { projectCategory: 'Thumbnail' })}>
              <Icon iconName="image" label="Thumbnail" />
            </TouchableOpacity>
          </View>

          <SuggestionPrompt />

          <View style={styles.mobileVideosSection}>
            <View style={styles.mobileVideosHeader}>
              <Text style={styles.mobileVideosTitle}>Recent Videos</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Projects')}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
                {loading ? (
                  <ActivityIndicator size="large" color="#0000ff" />
                ) : error ? (
                  <ProjectItem
                      width={170}
                      title="Error"
                      type={error}
                      imageSource={{ uri: 'https://miro.medium.com/v2/resize:fit:1400/1*MXyMqcEJ6Se0SCWcYCKZTQ.jpeg' }}
                    />
                ) : (

                  <ScrollView horizontal showsHorizontalScrollIndicator={false} >
                    
                    {VideoProjects.length > 0 ? (
                      VideoProjects.map((project, index) => (
                        <ProjectItem
                          width={170}
                          key={index}
                          title={project.title}
                          type={project.category}
                          imageSource={{ uri: project.thumbnail_url }}
                          date={project.createdAt}
                          id={project.project_id}
                        />
                      ))
                    ) : (
                      <Text style={styles.noProjectsText}>No projects found</Text>
                    )}
                      <View style={styles.addButton}>
                          <TouchableOpacity onPress={() => navigation.navigate('GenerateVideo', { projectCategory: 'Video' })}>
                            <Icon iconName="add" size={50} />
                        </TouchableOpacity>
                      </View>
                    </ScrollView> 
                )}
          </View>


          <View style={styles.mobileVideosSection}>
            <View style={styles.mobileVideosHeader}>
              <Text style={styles.mobileVideosTitle}>Recent Shorts</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Projects')}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
                {loading ? (
                  <ActivityIndicator size="large" color="#0000ff" />
                ) : error ? (
                  <ProjectItem
                      width={170}
                      title="Error"
                      type={error}
                      imageSource={{ uri: 'https://miro.medium.com/v2/resize:fit:1400/1*MXyMqcEJ6Se0SCWcYCKZTQ.jpeg' }}
                    />
                ) : (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} >
                    
                    {ShortsProjects.length > 0 ? (
                      ShortsProjects.map((project, index) => (
                        <ProjectItem
                          width={170}
                          key={index}
                          title={project.title}
                          type={project.category}
                          imageSource={{ uri: project.thumbnail_url }}
                          date={project.createdAt}
                          id={project.project_id}
                        />
                      ))
                    ) : (
                      <Text style={styles.noProjectsText}>No projects found</Text>
                    )}
                      <View style={styles.addButton}>
                          <TouchableOpacity onPress={() => navigation.navigate('GenerateVideo', { projectCategory: 'Shorts' })}>
                            <Icon iconName="add" size={50} />
                        </TouchableOpacity>
                      </View>
                    </ScrollView> 
                )}
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
  addButton: {
    width: 170,
    justifyContent: 'center',
    alignItems: 'center',
    margin:5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 5
  },
  projectItemWrapper: {
    margin: 10,
  },
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
    color: colors.theme,
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