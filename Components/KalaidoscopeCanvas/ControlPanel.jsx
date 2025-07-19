import React from 'react';
import { View, StyleSheet } from 'react-native';
import ActionButtons from './ActionButtons';
import DrawingTools from './DrawingTools';
import ColorPalette from './ColorPalette';
import OptionSliders from './OptionSliders';

const ControlPanel = ({
  onSave,
  onShare,
  onUndo,
  onRedo,
  onClear,
  onHidePanel,
  canUndo,
  canRedo,
  canClear,
  activeTool,
  onToolChange,
  colors,
  activeColor,
  onColorChange,
  segments,
  onSegmentsChange,
  strokeWidth,
  onStrokeWidthChange,
}) => {
  return (
    <View style={styles.controlsContainer}>
      <ActionButtons
        onSave={onSave}
        onShare={onShare}
        onUndo={onUndo}
        onRedo={onRedo}
        onClear={onClear}
        onHidePanel={onHidePanel}
        canUndo={canUndo}
        canRedo={canRedo}
        canClear={canClear}
      />
      <DrawingTools 
        activeTool={activeTool}
        onToolChange={onToolChange}
      />
      <ColorPalette
        colors={colors}
        activeColor={activeColor}
        onColorChange={onColorChange}
      />
      <OptionSliders
        segments={segments}
        onSegmentsChange={onSegmentsChange}
        strokeWidth={strokeWidth}
        onStrokeWidthChange={onStrokeWidthChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  controlsContainer: {
    paddingTop: 15,
    paddingBottom: 25,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 20,
  },
});

export default ControlPanel;