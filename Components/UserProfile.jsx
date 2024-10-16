import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useColorContext } from '../assets/Variables/colors';

import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ProfileSection = ({ avatar, username, subscribers, onEdit }) => {
    const [colors] = useColorContext();
    const styles = createStyles(colors);

    return (
        <View style={styles.container}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <View style={styles.infoContainer}>
                <Text style={styles.username}>{username}</Text>
                <Text style={styles.subscribers}>{subscribers} Subscribers</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={onEdit}>
              <Ionicons name="pencil" size={26} color={colors.theme} />
            </TouchableOpacity>
        </View>
    );
};

const createStyles = (colors) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15, 
        paddingHorizontal: 15,
        backgroundColor: colors.white, 
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
        height: 50, // Set a fixed height for the info container
    },
    username: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    subscribers: {
        fontSize: 12,
        color: colors.gray,
    },
    editButton: {
        padding: 5,
    },
});

export default ProfileSection;
