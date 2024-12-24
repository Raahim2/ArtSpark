import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useColorContext } from '../assets/Variables/colors';

export default function VideoInfo({ title, description, projectCategory, createdAt, duration, script }) {

  const [colors] = useColorContext();
  const styles = createStyles(colors);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isScriptExpanded, setIsScriptExpanded] = useState(false);

  const truncateText = (text) => {
    const words = text.split(' ');
    if (words.length > 20) {
      return words.slice(0, 20).join(' ') + '...';
    }
    return text;
  };

  const handleDescriptionPress = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const handleScriptPress = () => {
    setIsScriptExpanded(!isScriptExpanded);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Category:</Text>
          <Text style={styles.detailValue}>{projectCategory}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Created:</Text>
          <Text style={styles.detailValue}>{createdAt}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Duration:</Text>
          <Text style={styles.detailValue}>{duration} seconds</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Description</Text>
      <TouchableOpacity onPress={handleDescriptionPress}>
        <View style={[styles.descriptionContainer, isDescriptionExpanded && styles.expandedContainer]}>
          <Text style={styles.descriptionText}>
            {isDescriptionExpanded ? description : truncateText(description)}
          </Text>
        </View>
      </TouchableOpacity>

      {script && (
        <>
          <Text style={styles.sectionTitle}>Script</Text>
          <TouchableOpacity onPress={handleScriptPress}>
            <View style={[styles.scriptContainer, isScriptExpanded && styles.expandedContainer]}>
              <Text style={styles.scriptText}>
                {isScriptExpanded ? script : truncateText(script)}
              </Text>
            </View>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    padding: 15,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  detailLabel: {
    fontSize: 16,
    color: colors.darkGray,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: colors.text,
  },
  descriptionContainer: {
    padding: 12,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    marginBottom: 20,
  },
  expandedContainer: {
    minHeight: 100,
  },
  descriptionText: {
    fontSize: 16,
    color: colors.darkGray,
    lineHeight: 22,
  },
  scriptContainer: {
    padding: 12,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    marginBottom: 10,
  },
  scriptText: {
    fontSize: 16,
    color: colors.darkGray,
    lineHeight: 22,
  }
});
