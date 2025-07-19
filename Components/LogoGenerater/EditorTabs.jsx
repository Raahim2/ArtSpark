// ../Components/LogoGenerater/EditorTabs.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const TABS = ['Clipart', 'Text', 'Image'];

const EditorTabs = ({ activeTab, setActiveTab }) => (
  <View style={styles.tabs}>
    {TABS.map((tab) => (
      <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.activeTab]} onPress={() => setActiveTab(tab)}>
        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#F3F4F6',
  },
  activeTab: {
    backgroundColor: '#E8E0FF',
    borderWidth: 1,
    borderColor: '#7C4DFF',
  },
  tabText: {
    color: '#333',
  },
  activeTabText: {
    color: '#7C4DFF',
    fontWeight: 'bold',
  },
});

export default EditorTabs;