import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColorContext } from '../assets/Variables/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UpperNavigation({ toggleSidebar , title }) {
    const [colors, setColors] = useColorContext();
    const styles = createStyles(colors);

    useEffect(() => {
        const loadThemeColor = async () => {
            try {
                const savedColor = await AsyncStorage.getItem('themeColor');
                if (savedColor) {
                    setColors(prevColors => ({
                        ...prevColors,
                        theme: savedColor
                    }));
                }
            } catch (error) {
                console.error('Error loading theme color:', error);
            }
        };
        loadThemeColor();
    }, []);

    return (
        <>
            <StatusBar backgroundColor={colors.background} barStyle="light-content" hidden={false} />
            <View style={styles.navbar}>
                <TouchableOpacity style={styles.iconButton} onPress={toggleSidebar}>
                    <Ionicons name="menu" size={28} color={colors.white} />
                </TouchableOpacity>

                <Text style={styles.title}>{title}</Text>

                <TouchableOpacity style={styles.iconButton} onPress={toggleSidebar}>
                    <MaterialIcons name="more-vert" size={28} color={colors.white} />
                </TouchableOpacity>
            </View>
        </>
    );
}

const createStyles = (colors) => StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: colors.theme,
        elevation: 5,
    },
    iconButton: {
        paddingHorizontal: 10,
    },
    title: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.white,
        // textAlign: 'center', // Center title
    },
});
