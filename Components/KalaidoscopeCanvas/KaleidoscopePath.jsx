// src/components/KaleidoscopePath.js
import React from 'react';
import { Path, Group } from '@shopify/react-native-skia';

const KaleidoscopePath = ({ path, segments, center, color, strokeWidth }) => {
  const rotations = Array.from({ length: segments }, (_, i) => i);
  return (
    <>
      {rotations.map((i) => {
        const angle = (i * (2 * Math.PI)) / segments;
        return (
          <Group key={i} origin={center} transform={[{ rotate: angle }]}>
            <Path 
              path={path} 
              color={color} 
              style="stroke" 
              strokeWidth={strokeWidth} 
              strokeJoin="round" 
              strokeCap="round" 
            />
          </Group>
        );
      })}
    </>
  );
};

export default KaleidoscopePath;