import React from 'react';
import { StyleSheet, Text, View, Image, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorContext } from '../assets/Variables/colors';

const Card = ({ thumbnail, title, channelName, views, uploadTime, duration, onPress }) => {
  const [colors] = useColorContext();
  const styles = createStyles(colors);

  return (
    <Pressable onPress={onPress} style={styles.cardContainer}>
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
        <View style={styles.durationContainer}>
          <Text style={styles.durationText}>{duration}</Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">{title}</Text>
        <Text style={styles.channelName}>{channelName}</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>{views} views • {uploadTime}</Text>
        </View>
      </View>
      <Pressable style={styles.optionsButton}>
        <Ionicons name="ellipsis-vertical" size={20} color={colors.gray} />
      </Pressable>
    </Pressable>
  );
};

const createStyles = (colors) => StyleSheet.create({
  cardContainer: {
    width: '100%',
    height: 90, // Set the height to match the image height
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: 'auto',
    marginTop: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnailContainer: {
    width: 160,
    height: 90,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  durationContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: colors.durationBackground,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: colors.black,
  },
  channelName: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 12,
    color: colors.gray,
  },
  optionsButton: {
    padding: 10,
    justifyContent: 'center',
  },
});

export default Card;
