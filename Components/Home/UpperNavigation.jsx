// src/Components/Home/UpperNavigation.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColorContext } from '../../assets/Variables/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Component now accepts new props for selection mode
export default function UpperNavigation({ 
    toggleSidebar, 
    title,
    isSelectionMode = false,
    selectionCount = 0,
    onCancelSelection,
    onDeleteSelection 
}) {
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
            <StatusBar backgroundColor={colors.black} barStyle="light-content" hidden={false} />
            <View style={styles.navbar}>

                {/* Left Icon: Changes from Menu to Close */}
                <TouchableOpacity 
                    style={styles.iconButton} 
                    onPress={isSelectionMode ? onCancelSelection : toggleSidebar}
                >
                    {isSelectionMode ? (
                        <Ionicons name="close" size={28} color={colors.white} />
                    ) : (
                        <Ionicons name="menu" size={28} color={colors.white} />
                    )}
                </TouchableOpacity>

                {/* Title: Changes from "Projects" to "X Selected" */}
                <Text style={styles.title}>
                    {isSelectionMode ? `${selectionCount} Selected` : title}
                </Text>

                {/* Right Icon: Changes from More to Trash */}
                <TouchableOpacity 
                    style={styles.iconButton}
                    // In normal mode it toggles the sidebar, in selection mode it deletes
                    onPress={isSelectionMode ? onDeleteSelection : toggleSidebar}
                    // Disable the button if in selection mode and nothing is selected
                    disabled={isSelectionMode && selectionCount === 0}
                >
                    {isSelectionMode ? (
                        <Ionicons 
                            name="trash-outline" 
                            size={26} 
                            // Make icon look disabled if nothing is selected
                            color={selectionCount > 0 ? '#FF7B7B' : 'rgba(255, 255, 255, 0.5)'}
                        />
                    ) : (
                        <MaterialIcons name="more-vert" size={28} color={colors.white} />
                    )}
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
        paddingVertical: 5,
    },
    title: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.white,
        textAlign: 'left', // Keeping your original alignment
        marginLeft: 15,     // Add some space from the left icon
    },
});