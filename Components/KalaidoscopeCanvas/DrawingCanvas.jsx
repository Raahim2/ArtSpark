// src/components/DrawingCanvas.js
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Canvas } from '@shopify/react-native-skia';
import ViewShot from 'react-native-view-shot';
import KaleidoscopePath from './KaleidoscopePath';

const DrawingCanvas = ({
  viewShotRef,
  onLayout,
  panResponder,
  canvasInfo,
  paths,
  currentPath,
  currentColor,
  strokeWidth,
  segments,
}) => {
  return (
    <ViewShot ref={viewShotRef} style={styles.canvasContainer} options={{ format: 'png', quality: 1.0 }}>
      <View style={styles.canvasBackground} onLayout={onLayout}>
        {canvasInfo && (
          <Canvas style={styles.canvas} {...panResponder.panHandlers}>
            {paths.map((pathObject, index) => (
              <KaleidoscopePath key={`p-${index}`} {...pathObject} center={canvasInfo.center} />
            ))}
            <KaleidoscopePath
              key="current"
              path={currentPath}
              segments={segments}
              center={canvasInfo.center}
              color={currentColor}
              strokeWidth={strokeWidth}
            />
          </Canvas>
        )}
      </View>
    </ViewShot>
  );
};

const styles = StyleSheet.create({
  canvasContainer: { flex: 1, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  canvasBackground: { flex: 1, backgroundColor: '#fff' },
  canvas: { flex: 1 },
});

export default DrawingCanvas;