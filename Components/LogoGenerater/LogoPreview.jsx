// ../Components/LogoGenerater/LogoPreview.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ViewShot from 'react-native-view-shot';
import { LinearGradient } from 'expo-linear-gradient';

const LogoPreview = ({
  viewShotRef,
  backgroundType,
  gradientStart,
  gradientEnd,
  backgroundColor,
  shape,
  padding,
  activeTab,
  selectedIcon,
  iconColor,
  logoText,
  fontFamily,
  fontSize,
  logoImage,
}) => {
  const getShapeStyle = () => {
    switch (shape) {
      case 'Square': return { borderRadius: 2 };
      case 'Circle': return { borderRadius: 60 };
      default: return { borderRadius: 24 }; // Squircle
    }
  };

  const LogoContent = (
    <View style={{ transform: [{ scale: (100 - padding) / 100 }] }}>
      {activeTab === 'Clipart' && <MaterialCommunityIcons name={selectedIcon} size={80} color={iconColor} />}
      {activeTab === 'Text' && logoText ? (
        <Text style={[styles.previewText, { color: iconColor, fontFamily, fontSize }]} numberOfLines={1} adjustsFontSizeToFit>
          {logoText}
        </Text>
      ) : null}
      {activeTab === 'Image' && logoImage ? <Image source={{ uri: logoImage }} style={styles.previewImage} resizeMode="cover" /> : null}
    </View>
  );

  return (
    <View style={styles.previewContainer}>
      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }}>
        {backgroundType === 'Gradient' ? (
          <LinearGradient colors={[gradientStart, gradientEnd]} style={[styles.iconPreview, getShapeStyle()]}>
            {LogoContent}
          </LinearGradient>
        ) : (
          <View style={[styles.iconPreview, getShapeStyle(), { backgroundColor }]}>
            {LogoContent}
          </View>
        )}
      </ViewShot>
    </View>
  );
};

const styles = StyleSheet.create({
  previewContainer: {
    paddingVertical: 40,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  iconPreview: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'hidden',
  },
  previewText: {
    textAlign: 'center',
  },
  previewImage: {
    width: 120,
    height: 120,
  },
});

export default LogoPreview;