import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Animated, Alert, TextInput } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import VideoPlayer from '../Components/Video';
import { useColorContext } from '../assets/Variables/colors';
import { GENTUBE_API_KEY } from '@env';
import UpperNavigation from '../Components/UpperNavigation';
import BottomNavigation from '../Components/BottomNavigation';
import SideBar from '../Components/SideBar';
import { useNavigation } from '@react-navigation/native';

export default function VideoDetails({ route }) {
  const { username } = route.params;
  const [colors] = useColorContext();
  const styles = createStyles(colors);
  const navigation = useNavigation();
  const { videoId } = route.params;
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [project, setProject] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarAnimation = useRef(new Animated.Value(0)).current;
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  const apiUrl = "https://gentube.vercel.app";

  const fetchProject = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/MongoDB/GetProjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': GENTUBE_API_KEY,
        },
        body: JSON.stringify({
          filter_key: "project_id",
          filter_value: videoId
        })
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        setError(`Error Fetching Projects: ${errorMessage}`);
        setLoading(false);
        return;
      }

      const responseData = await response.json();
      // Since the API returns an array, get the first item
      setProject(responseData[0]);
      setEditedTitle(responseData[0]?.title || '');
      setEditedDescription(responseData[0]?.description || '');
      setLoading(false);

    } catch (error) {
      setError(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  const handleEdit = async () => {
    if (isEditing) {
      try {
        const response = await fetch(`${apiUrl}/MongoDB/updateProject`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': GENTUBE_API_KEY,
          },
          body: JSON.stringify({
            project_id: videoId,
            key: 'title',
            value: editedTitle
          })
        });

        if (response.ok) {
          const descResponse = await fetch(`${apiUrl}/MongoDB/updateProject`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': GENTUBE_API_KEY,
            },
            body: JSON.stringify({
              project_id: videoId,
              key: 'description',
              value: editedDescription
            })
          });

          if (descResponse.ok) {
            setProject(prev => ({
              ...prev,
              title: editedTitle,
              description: editedDescription
            }));
            Alert.alert("Success", "Project updated successfully");
          }
        } else {
          // Alert.alert("Error", "Failed to update project");
          console.log("Failed to update project");
        }
      } catch (error) {
        // Alert.alert("Error", "Failed to update project");
        console.error(error);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Video",
      "Are you sure you want to delete this video?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const response = await fetch(`${apiUrl}/MongoDB/deleteDataById`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': GENTUBE_API_KEY,
                },
                body: JSON.stringify({
                  project_id: videoId
                })
              });

              const data = await response.json();
              console.log('Delete response:', data);

              if (response.ok) {
                Alert.alert("Success", "Video deleted successfully");
                navigation.navigate('Home');
              } else {
                Alert.alert("Error", data.message || "Failed to delete video");
              }
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert("Error", "Failed to delete video");
            }
          },
          style: "destructive"
        }
      ]
    );
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

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={colors.theme} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <MaterialIcons name="error-outline" size={60} color="red" />
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.centeredContainer}>
        <MaterialIcons name="error-outline" size={60} color={colors.theme} />
        <Text style={styles.errorText}>No project found</Text>
      </View>
    );
  }

  return (
    <>
      <UpperNavigation title={"Video Details"} toggleSidebar={toggleSidebar} />
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} animation={sidebarAnimation} username={username}/>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {project?.FinalURL && (
          <Animated.View style={styles.videoContainer}>
            <VideoPlayer
              videoSource={project.FinalURL}
              projectCategory={project.category || 'Video'}
            />
          </Animated.View>
        )}

        <View style={styles.cardContainer}>
          <View style={[styles.cardGradient, isEditing && styles.editingCard]}>
            <View style={styles.headerRow}>
              {isEditing ? (
                <View style={styles.editingInputContainer}>
                  <MaterialIcons name="edit" size={24} color={colors.theme} style={styles.editIcon} />
                  <TextInput
                    style={styles.titleInputEditing}
                    value={editedTitle}
                    onChangeText={setEditedTitle}
                    placeholder={project?.title}
                    placeholderTextColor={colors.subtext}
                  />
                </View>
              ) : (
                <Text style={styles.title}>{project?.title}</Text>
              )}
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  onPress={handleEdit} 
                  style={[styles.iconButton, isEditing && styles.saveButton]}
                >
                  <Ionicons
                    name={isEditing ? "checkmark-circle" : "create-outline"}
                    size={28}
                    color={isEditing ? '#fff' : colors.theme}
                  />
                  {isEditing && <Text style={styles.saveButtonText}>Save</Text>}
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
                  <MaterialIcons name="delete-outline" size={28} color={colors.theme} />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.views}>
              {project?.createdAt}
            </Text>
              
            <View style={styles.gradientDivider} />

            <Text style={styles.sectionTitle}>Description</Text>
            {isEditing ? (
              <View style={styles.editingDescriptionContainer}>
                <TextInput
                  style={styles.descriptionInputEditing}
                  value={editedDescription}
                  onChangeText={setEditedDescription}
                  placeholder="Enter description"
                  placeholderTextColor={colors.subtext}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
                <MaterialIcons name="description" size={24} color={colors.theme} style={styles.descriptionIcon} />
              </View>
            ) : (
              <Text style={styles.description}>
                {project?.description}
              </Text>
            )}

            <View style={styles.gradientDivider} />

            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailsRow}>
              <Text style={styles.detailLabel}>Duration:</Text>
              <Text style={styles.detailValue}>{project?.duration} seconds</Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={styles.detailLabel}>Category:</Text>
              <Text style={styles.detailValue}>{project?.category || 'Uncategorized'}</Text>
            </View>
          </View>
        </View>
        <View style={styles.bottomMargin} />
      </ScrollView>
      <BottomNavigation username={username}/>
    </>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  videoContainer: {
    overflow: 'hidden',
  },
  cardContainer: {
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 20,
    backgroundColor: colors.background,
  },
  editingCard: {
    backgroundColor: colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  editingInputContainer: {
    backgroundColor: '#EAEAEA',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  editIcon: {
    marginRight: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 15,
    padding: 8,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.theme,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  saveButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  titleInputEditing: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    padding: 10,
  },
  views: {
    fontSize: 14,
    color: colors.subtext,
    marginBottom: 8,
  },
  gradientDivider: {
    height: 2,
    marginVertical: 16,
    borderRadius: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.theme,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 10,
  },
  editingDescriptionContainer: {
    backgroundColor: '#EAEAEA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  descriptionInputEditing: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    minHeight: 120,
    backgroundColor: 'transparent',
  },
  descriptionIcon: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    opacity: 0.5,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.theme}30`,
  },
  detailLabel: {
    fontSize: 16,
    color: colors.subtext,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.theme,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  bottomMargin: {
    marginBottom: 100,
  },
});
