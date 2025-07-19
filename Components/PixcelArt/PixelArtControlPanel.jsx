// ../Components/PixcelArt/PixelArtControlPanel.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ColorPickerModal from './ColorPickerModal';
import StickerModal from './StickerModal';

// Separate UI sections into their own components for clarity
const TopActionBar = ({ onSticker, onSave, onShare, onUndo, onRedo, onClear, onHide, canUndo, canRedo }) => (
  <View style={styles.row}>
    <TouchableOpacity onPress={onSticker} style={styles.button}><Feather name="image" size={24} color="#333" /></TouchableOpacity>
    <TouchableOpacity onPress={onSave} style={styles.button}><Feather name="download" size={24} color="#333" /></TouchableOpacity>
    <TouchableOpacity onPress={onShare} style={styles.button}><Feather name="share-2" size={24} color="#333" /></TouchableOpacity>
    <TouchableOpacity onPress={onUndo} disabled={!canUndo} style={styles.button}><Feather name="rotate-ccw" size={24} color={canUndo ? "#333" : "#CCC"} /></TouchableOpacity>
    <TouchableOpacity onPress={onRedo} disabled={!canRedo} style={styles.button}><Feather name="rotate-cw" size={24} color={canRedo ? "#333" : "#CCC"} /></TouchableOpacity>
    <TouchableOpacity onPress={onClear} style={styles.button}><Feather name="trash-2" size={24} color="#333" /></TouchableOpacity>
    <TouchableOpacity onPress={onHide} style={styles.button}><Feather name="chevron-down" size={28} color="#555" /></TouchableOpacity>
  </View>
);

const ToolSelector = ({ activeTool, onToolChange }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.row, styles.toolRow]}>
    <Text style={styles.label}>Tool:</Text>
    <TouchableOpacity onPress={() => onToolChange('draw')} style={[styles.toolButton, activeTool === 'draw' && styles.activeTool]}><Feather name="edit-3" size={20} color={activeTool === 'draw' ? '#FFF' : '#333'} /><Text style={[styles.toolText, activeTool === 'draw' && { color: '#FFF' }]}>Draw</Text></TouchableOpacity>
    <TouchableOpacity onPress={() => onToolChange('erase')} style={[styles.toolButton, activeTool === 'erase' && styles.activeTool]}><Feather name="delete" size={20} color={activeTool === 'erase' ? '#FFF' : '#333'} /><Text style={[styles.toolText, activeTool === 'erase' && { color: '#FFF' }]}>Erase</Text></TouchableOpacity>
    <TouchableOpacity onPress={() => onToolChange('line')} style={[styles.toolButton, activeTool === 'line' && styles.activeTool]}><Feather name="minus" size={20} color={activeTool === 'line' ? '#FFF' : '#333'} /><Text style={[styles.toolText, activeTool === 'line' && { color: '#FFF' }]}>Line</Text></TouchableOpacity>
    <TouchableOpacity onPress={() => onToolChange('square')} style={[styles.toolButton, activeTool === 'square' && styles.activeTool]}><Feather name="square" size={20} color={activeTool === 'square' ? '#FFF' : '#333'} /><Text style={[styles.toolText, activeTool === 'square' && { color: '#FFF' }]}>Square</Text></TouchableOpacity>
    <TouchableOpacity onPress={() => onToolChange('circle')} style={[styles.toolButton, activeTool === 'circle' && styles.activeTool]}><Feather name="circle" size={20} color={activeTool === 'circle' ? '#FFF' : '#333'} /><Text style={[styles.toolText, activeTool === 'circle' && { color: '#FFF' }]}>Circle</Text></TouchableOpacity>
    <TouchableOpacity onPress={() => onToolChange('fill')} style={[styles.toolButton, activeTool === 'fill' && styles.activeTool]}><Feather name="droplet" size={20} color={activeTool === 'fill' ? '#FFF' : '#333'} /><Text style={[styles.toolText, activeTool === 'fill' && { color: '#FFF' }]}>Fill</Text></TouchableOpacity>
  </ScrollView>
);

const SymmetrySelector = ({ mirrorMode, onMirrorModeChange }) => {
  const toggleMirrorMode = (mode) => onMirrorModeChange(mirrorMode === mode ? 'none' : mode);
  return (
    <View style={[styles.row, { borderBottomWidth: 0, marginBottom: 15 }]}>
      <Text style={styles.label}>Symmetry:</Text>
      <TouchableOpacity onPress={() => onMirrorModeChange('none')} style={[styles.toolButton, mirrorMode === 'none' && styles.activeTool]}><Feather name="x" size={20} color={mirrorMode === 'none' ? '#FFF' : '#333'} /></TouchableOpacity>
      <TouchableOpacity onPress={() => toggleMirrorMode('x')} style={[styles.toolButton, mirrorMode === 'x' && styles.activeTool]}><Feather name="move" size={20} color={mirrorMode === 'x' ? '#FFF' : '#333'} style={{ transform: [{ rotate: '90deg' }]}} /></TouchableOpacity>
      <TouchableOpacity onPress={() => toggleMirrorMode('y')} style={[styles.toolButton, mirrorMode === 'y' && styles.activeTool]}><Feather name="move" size={20} color={mirrorMode === 'y' ? '#FFF' : '#333'} /></TouchableOpacity>
      <TouchableOpacity onPress={() => toggleMirrorMode('xy')} style={[styles.toolButton, mirrorMode === 'xy' && styles.activeTool]}><Feather name="plus" size={20} color={mirrorMode === 'xy' ? '#FFF' : '#333'} /></TouchableOpacity>
    </View>
  );
};

const ColorPalette = ({ colors, activeColor, onColorChange, onAddColor }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {colors.map(color => (
      <TouchableOpacity key={color} onPress={() => onColorChange(color)} style={[styles.colorSwatch, { backgroundColor: color }, activeColor === color && styles.activeColorSwatch, color === '#FFFFFF' && styles.whiteSwatch]} />
    ))}
    <TouchableOpacity style={styles.addColorButton} onPress={onAddColor}><Feather name="plus" size={24} color="#888" /></TouchableOpacity>
  </ScrollView>
);


const PixelArtControlPanel = ({
  onSave, onShare, onUndo, onRedo, onClear, onHidePanel,
  canUndo, canRedo, 
  onStickerSelect,
  activeTool, onToolChange,
  colors, activeColor, onColorChange,
  mirrorMode, onMirrorModeChange
}) => {
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
  const [isStickerModalVisible, setIsStickerModalVisible] = useState(false);

  const handlePickerConfirm = (newColor) => {
    onColorChange(newColor);
    setIsColorPickerVisible(false);
  };
  
  const handleStickerConfirm = (stickerGrid) => {
    onStickerSelect(stickerGrid);
    setIsStickerModalVisible(false);
  };

  return (
    <>
      <ColorPickerModal
        visible={isColorPickerVisible}
        initialColor={activeColor}
        onConfirm={handlePickerConfirm}
        onClose={() => setIsColorPickerVisible(false)}
      />
      <StickerModal
        visible={isStickerModalVisible}
        onSelect={handleStickerConfirm}
        onClose={() => setIsStickerModalVisible(false)}
      />
      <View style={styles.container}>
        <TopActionBar
          onSticker={() => setIsStickerModalVisible(true)}
          onSave={onSave} onShare={onShare} onUndo={onUndo} onRedo={onRedo}
          onClear={onClear} onHide={onHidePanel} canUndo={canUndo} canRedo={canRedo}
        />
        <ToolSelector activeTool={activeTool} onToolChange={onToolChange} />
        <SymmetrySelector mirrorMode={mirrorMode} onMirrorModeChange={onMirrorModeChange} />
        <ColorPalette
          colors={colors} activeColor={activeColor} onColorChange={onColorChange}
          onAddColor={() => setIsColorPickerVisible(true)}
        />
      </View>
    </>
  );
};

// Paste ALL the original styles here
const styles = StyleSheet.create({
  container: { paddingVertical: 15, paddingHorizontal: 10, backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, elevation: 10 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  button: { flex: 1, alignItems: 'center', padding: 5 },
  toolRow: { borderTopWidth: 1, borderColor: '#EEE', paddingVertical: 10 },
  label: { fontSize: 16, fontWeight: '500', marginRight: 15, paddingLeft: 5 },
  toolButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, borderWidth: 1, borderColor: '#DDD', marginRight: 10 },
  activeTool: { backgroundColor: '#333', borderColor: '#333' },
  toolText: { marginLeft: 8, fontWeight: '600' },
  colorSwatch: { width: 40, height: 40, borderRadius: 20, marginHorizontal: 5, borderWidth: 2, borderColor: 'transparent' },
  activeColorSwatch: { borderColor: '#007AFF', transform: [{ scale: 1.1 }] },
  whiteSwatch: { borderWidth: 1, borderColor: '#E0E0E0' },
  addColorButton: { width: 40, height: 40, borderRadius: 20, marginHorizontal: 5, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#CCC', borderStyle: 'dashed' },
});

export default PixelArtControlPanel;