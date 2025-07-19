import React, { forwardRef } from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { PATTERNS } from './constants';

const { width } = Dimensions.get('window');

const MockupPreview = forwardRef(({ 
    selectedMockup, 
    fillType, 
    solidColor, 
    uploadedImageUri, 
    patternProps 
}, ref) => {

    const renderBackground = () => {
        let backgroundContent = null;
        let containerBackgroundColor = '#FFF';

        switch (fillType) {
            case 'pattern':
                const PatternComponent = PATTERNS.find(p => p.id === patternProps.id)?.component;
                if (PatternComponent) {
                    backgroundContent = <PatternComponent width="100%" height="100%" fill={patternProps.color1} stroke={patternProps.color2} scale={patternProps.scale} strokeWidth={patternProps.strokeWidth} />;
                }
                break;
            case 'upload':
                if (uploadedImageUri) {
                    backgroundContent = <Image source={{ uri: uploadedImageUri }} style={styles.backgroundImage} resizeMode="cover" />;
                }
                break;
            case 'color':
            default:
                containerBackgroundColor = solidColor;
                break;
        }
        return (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: containerBackgroundColor }]}>
                {backgroundContent}
            </View>
        );
    };

    return (
        <ViewShot ref={ref} options={{ fileName: "mockup-preview", format: "png", quality: 0.9 }}>
            <View style={styles.mockupContainer}>
                {renderBackground()}
                <Image source={selectedMockup.source} style={styles.mockupImageAsMask} resizeMode="contain" />
            </View>
        </ViewShot>
    );
});

const styles = StyleSheet.create({
    mockupContainer: { width: width, height: width, justifyContent: 'center', overflow: 'hidden' },
    backgroundImage: { ...StyleSheet.absoluteFillObject },
    mockupImageAsMask: { width: '100%', height: '100%', zIndex: 10 },
});

export default MockupPreview;