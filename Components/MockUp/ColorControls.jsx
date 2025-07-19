import React from 'react';
import { View, StyleSheet } from 'react-native';
import ColorControlRow from './ColorControlRow';

const ColorControls = ({ color, onColorChangePress, onRandomPress }) => (
    <View style={styles.controlSection}>
        <ColorControlRow 
            label="Product Color" 
            color={color} 
            onChangePress={onColorChangePress} 
            onRandomPress={onRandomPress} 
        />
    </View>
);

const styles = StyleSheet.create({
    controlSection: { marginTop: 10, marginBottom: 10 },
});

export default ColorControls;