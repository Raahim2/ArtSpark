import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SuggestionPrompts = () => {
  const prompts = [
    { text: 'Make me an image', icon: '🌈', color: ['#E3F2FD', '#E1BEE7'] },
    { text: 'Resize any design', icon: '🥁', color: ['#FCE4EC', '#F3E5F5'] },
    { text: 'Write my first draft', icon: '🪄', color: ['#E8F5E9', '#F0F4C3'] },
    { text: 'Remove backgrounds', icon: '🌟', color: ['#FFF9C4', '#FFCCBC'] },
    { text: 'Create a logo', icon: '🎨', color: ['#FFEBEE', '#FFCDD2'] },
    { text: 'Generate a report', icon: '📊', color: ['#E1F5FE', '#B3E5FC'] },
    { text: 'Design a flyer', icon: '📰', color: ['#E8EAF6', '#C5CAE9'] },
    { text: 'Edit a video', icon: '🎥', color: ['#F3E5F5', '#E1BEE7'] },
    { text: 'Create a presentation', icon: '📈', color: ['#E0F7FA', '#B2EBF2'] },
    { text: 'Write a blog post', icon: '✍️', color: ['#FFF3E0', '#FFE0B2'] },
  ];

  const promptRows = [];
  for (let i = 0; i < prompts.length; i += 2) {
    promptRows.push(prompts.slice(i, i + 2));
  }

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={styles.scrollContent}
    >
      {promptRows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((prompt, index) => (
            <TouchableOpacity key={index} style={[styles.promptButton, { backgroundColor: prompt.color[0] }]}>
              <Text style={styles.icon}>{prompt.icon}</Text>
              <Text style={styles.text}>{prompt.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    alignSelf: 'flex-start', // Keep content compact without stretching vertically
    borderWidth:2
  },

  row: {
    flexDirection: 'column',
    marginHorizontal: 5,
    flexShrink: 1, // Prevent extra space in each row
  },
  promptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 20,
    marginVertical: 4,
  },
  icon: {
    fontSize: 16,
    marginRight: 6,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
});

export default SuggestionPrompts;
