// src/components/ActionButtons.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const ActionButtons = ({ 
  onSave, 
  onShare, 
  onUndo, 
  onRedo, 
  onClear, 
  onHidePanel, 
  canUndo, 
  canRedo,
  canClear
}) => {
  return (
    <View style={styles.topActions}>
      <TouchableOpacity onPress={onSave} style={styles.actionButton}>
        <Feather name="download" size={24} color={'#333'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onShare} style={styles.actionButton}>
        <Feather name="share-2" size={24} color={'#333'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onUndo} disabled={!canUndo} style={styles.actionButton}>
        <Feather name="corner-up-left" size={24} color={canUndo ? '#333' : '#BDBDBD'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onRedo} disabled={!canRedo} style={styles.actionButton}>
        <Feather name="corner-up-right" size={24} color={canRedo ? '#333' : '#BDBDBD'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onClear} disabled={!canClear} style={styles.actionButton}>
        <Feather name="trash-2" size={24} color={canClear ? '#333' : '#BDBDBD'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onHidePanel} style={styles.actionButton}>
        <Feather name="chevron-down" size={28} color={'#555'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  actionButton: {
    padding: 5,
  },
});

export default ActionButtons;