import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SuggestionPrompts = () => {
  const navigation = useNavigation();

  const Allprompts = [
    { text: 'Create a short video intro', icon: '🎬', color: ['#FFEBEE', '#FFCDD2'] },
    { text: 'Generate a quick product demo video', icon: '📹', color: ['#E1F5FE', '#B3E5FC'] },
    { text: 'Make a promotional video', icon: '🎥', color: ['#E8F5E9', '#F0F4C3'] },
    { text: 'Create a video for social media', icon: '📱', color: ['#FCE4EC', '#F3E5F5'] },
    { text: 'Animate a logo', icon: '💫', color: ['#E3F2FD', '#E1BEE7'] },
    { text: 'Generate a tutorial video', icon: '🎓', color: ['#FFF9C4', '#FFCCBC'] },
    { text: 'Create a time-lapse video', icon: '⏱️', color: ['#FFEBEE', '#FFCDD2'] },
    { text: 'Edit a highlight reel', icon: '🎞️', color: ['#FFEBEE', '#FFCDD2'] },
    { text: 'Make an explainer video', icon: '🔍', color: ['#E1F5FE', '#B3E5FC'] },
    { text: 'Create a behind-the-scenes video', icon: '🎥', color: ['#FFEBEE', '#FFCDD2'] },
    { text: 'Generate a testimonial video', icon: '🗣️', color: ['#FFF9C4', '#FFCCBC'] },
    { text: 'Create a cinematic video', icon: '🎬', color: ['#E8F5E9', '#F0F4C3'] },
    { text: 'Generate a product unboxing video', icon: '📦', color: ['#FFEBEE', '#FFCDD2'] },
    { text: 'Create an animated character video', icon: '🧑‍🎨', color: ['#FCE4EC', '#F3E5F5'] },
    { text: 'Design a virtual tour video', icon: '🌍', color: ['#E0F7FA', '#B2EBF2'] },
    { text: 'Create a video vlog', icon: '🎤', color: ['#E8EAF6', '#C5CAE9'] },
    { text: 'Make a workout tutorial video', icon: '💪', color: ['#FFEBEE', '#FFCDD2'] },
    { text: 'Generate a cooking recipe video', icon: '🍳', color: ['#E1F5FE', '#B3E5FC'] },
    { text: 'Create an event recap video', icon: '🎉', color: ['#FCE4EC', '#F3E5F5'] },
    { text: 'Generate a fashion lookbook video', icon: '👗', color: ['#FFF9C4', '#FFCCBC'] },
    { text: 'Create a music video', icon: '🎶', color: ['#E8F5E9', '#F0F4C3'] },
    { text: 'Make a viral challenge video', icon: '💥', color: ['#FFEBEE', '#FFCDD2'] },
    { text: 'Generate a how-to video', icon: '🔧', color: ['#E1F5FE', '#B3E5FC'] },
    { text: 'Create a fashion haul video', icon: '👚', color: ['#FCE4EC', '#F3E5F5'] },
    { text: 'Produce a dance choreography video', icon: '💃', color: ['#E8F5E9', '#F0F4C3'] },
    { text: 'Generate a sports highlights video', icon: '🏆', color: ['#FFEBEE', '#FFCDD2'] },
    { text: 'Create a holiday greeting video', icon: '🎄', color: ['#FCE4EC', '#F3E5F5'] },
    { text: 'Design a time lapse of nature', icon: '🌿', color: ['#E1F5FE', '#B3E5FC'] },
    { text: 'Generate a behind-the-scenes music video', icon: '🎤', color: ['#FFEBEE', '#FFCDD2'] },
    { text: 'Create a customer testimonial video', icon: '🗣️', color: ['#FCE4EC', '#F3E5F5'] },
    { text: 'Make a video for a fundraiser', icon: '💰', color: ['#E8F5E9', '#F0F4C3'] },
    { text: 'Generate a quick ad video', icon: '📢', color: ['#FFEBEE', '#FFCDD2'] },
    { text: 'Create a travel vlog video', icon: '✈️', color: ['#E1F5FE', '#B3E5FC'] },
    { text: 'Generate a cinematic drone video', icon: '🚁', color: ['#FFF9C4', '#FFCCBC'] },
    { text: 'Create an animated explainer video', icon: '💡', color: ['#FFEBEE', '#FFCDD2'] },
    { text: 'Generate a seasonal sale video', icon: '💸', color: ['#E1F5FE', '#B3E5FC'] },
    { text: 'Design a tutorial video for beginners', icon: '📝', color: ['#FCE4EC', '#F3E5F5'] },
    { text: 'Create a video for a charity event', icon: '❤️', color: ['#FFF9C4', '#FFCCBC'] },
    { text: 'Generate a makeup tutorial video', icon: '💄', color: ['#E1F5FE', '#B3E5FC'] },
    { text: 'Create an educational video for kids', icon: '🧸', color: ['#FCE4EC', '#F3E5F5'] },
    { text: 'Design a quick stop-motion video', icon: '⏸️', color: ['#E8F5E9', '#F0F4C3'] },
    { text: 'Create a product review video', icon: '🛍️', color: ['#FFEBEE', '#FFCDD2'] },
    { text: 'Generate a fitness workout video', icon: '🏋️‍♂️', color: ['#E1F5FE', '#B3E5FC'] },
    { text: 'Design a mobile app demo video', icon: '📲', color: ['#FCE4EC', '#F3E5F5'] },
    { text: 'Create a video for a crowdfunding campaign', icon: '💡', color: ['#FFEBEE', '#FFCDD2'] },
    { text: 'Make a virtual product demo video', icon: '🖥️', color: ['#E8F5E9', '#F0F4C3'] },
    { text: 'Generate a daily routine video', icon: '⏰', color: ['#E1F5FE', '#B3E5FC'] },
    { text: 'Create a video for a tech review', icon: '💻', color: ['#FFF9C4', '#FFCCBC'] },
    { text: 'Design a customer unboxing experience video', icon: '📦', color: ['#FCE4EC', '#F3E5F5'] },
    { text: 'Generate a video for a new restaurant opening', icon: '🍽️', color: ['#FFEBEE', '#FFCDD2'] },
    { text: 'Make a behind-the-scenes at a concert video', icon: '🎶', color: ['#E8F5E9', '#F0F4C3'] },
    { text: 'Create a quick video for a special offer', icon: '🔥', color: ['#E1F5FE', '#B3E5FC'] },
    { text: 'Generate a product comparison video', icon: '🔍', color: ['#FFF9C4', '#FFCCBC'] },
    { text: 'Create a customer success story video', icon: '🏅', color: ['#FCE4EC', '#F3E5F5'] },
    { text: 'Make a motivational video', icon: '💪', color: ['#E8F5E9', '#F0F4C3'] },
    { text: 'Design a “how it’s made” video', icon: '🏭', color: ['#FFEBEE', '#FFCDD2'] },
  ];

  function getRandomPrompts(prompts, count) {
    const shuffled = prompts.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  const prompts = getRandomPrompts(Allprompts, 20);
  

  const handlePromptClick = (promptText) => {
    navigation.navigate('MockUp', {
      initialPrompt: promptText,
      projectCategory: 'Video'
    });
  };

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
            <TouchableOpacity 
              key={index} 
              style={[styles.promptButton, { backgroundColor: prompt.color[0] }]}
              onPress={() => handlePromptClick(prompt.text)}
            >
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
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'column',
    marginHorizontal: 5,
    flexShrink: 1,
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
