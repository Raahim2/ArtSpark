import React from 'react';
import { View, Text, StyleSheet, ScrollView  , Image} from 'react-native';
import ProjectItem from './ProjectItem'; 

const Projects = ({ projects, loading, error }) => {
  return (
    <View>
      <Text style={styles.header}>Projects</Text>

      {loading ? (
        <Text style={styles.loadingText}>Loading projects...</Text>
      ) : error ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 60}}>
          <Image source={require('../assets/Images/Error.png')}  />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.projectsGrid}
          showsVerticalScrollIndicator={false}
        >
          {projects.length > 0 ? (
           projects.map((project, index) => (
              <ProjectItem
                width={'50%'}
                key={index}
                title={project.title}
                type={project.category}
                imageSource={{ uri: project.thumbnail_url }}
                date={project.createdAt}
                id={project.project_id}
              />
            ))
          ) : (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 60}}>
              <Image source={require('../assets/Images/NotFound.png')}  />
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
    
  },
  projectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
    color: 'red',
  },
  noProjectsText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
    color: 'gray',
  },
});

export default Projects;
