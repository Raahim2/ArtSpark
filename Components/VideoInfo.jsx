import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useColorContext } from '../assets/Variables/colors';

export default function VideoInfo({ title, description }) {
  const [visibility, setVisibility] = useState('Private');
  const [location, setLocation] = useState('');
  const [isRemixingAllowed, setIsRemixingAllowed] = useState(false);
  const [isCommentsEnabled, setIsCommentsEnabled] = useState(true);
  const [colors] = useColorContext();
  const styles = createStyles(colors);

  // const UploadVideo = async () => {
  //   console.log("Uploading Video")
  //   try {
  //     Alert.alert('Uploading Video', 'Please wait while we upload your video...');
  //     const response = await fetch('http://192.168.0.104:5000/uploadVideo2', {
  //       method: 'GET',
  //     });
  //     const data = await response.json();
  //     if (response.ok) {
  //       alert(`Video uploaded successfully!`);
  //     } else {
  //       alert(`Error: ${data.error}`);
  //     }
  //   } catch (error) {
  //     alert(`An error occurred while uploading the video: ${error.message}`);
  //   }

  // };



  const truncateDescription = (desc) => {
    const words = desc.split(' ');
    if (words.length > 20) {
      return words.slice(0, 20).join(' ') + '...';
    }
    return desc;
  };

  const handleDescriptionPress = () => {
    Alert.alert('Full Description', description, [{ text: 'OK' }]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>

  
      {/* Description Input */}
      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.linkText}>Add description</Text>
      </TouchableOpacity>

      {/* Description Container */}
      <TouchableOpacity onPress={handleDescriptionPress}>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{truncateDescription(description)}</Text>
        </View>
      </TouchableOpacity>

      {/* Visibility */}
      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.linkText}>Visibility: {visibility}</Text>
      </TouchableOpacity>

      {/* Location Input */}
      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.linkText}>Location</Text>
      </TouchableOpacity>


      {/* Next Button */}
      <View style={styles.buttonContainer}>
        {/* <Button title="Upload Video" onPress={UploadVideo} color={colors.theme} /> */}
        {/* <UploadButton /> */}
      </View>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    padding: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    borderColor: colors.lightGray,
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    borderRadius: 8,
  },
  linkText: {
    fontSize: 16,
    color: colors.theme,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 10,
    backgroundColor: colors.theme,
  },
  descriptionContainer: {
    padding: 10,
    backgroundColor: colors.lightGray,
    borderRadius: 5,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: colors.darkGray,
  },
});
