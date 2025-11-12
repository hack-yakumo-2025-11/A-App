// Character emotion images
const characterAssets = {
  character_001: { // Sakura
    default: '/src/assets/characters/sakura/default.png',
    happy: '/src/assets/characters/sakura/happy.png',
    thinking: '/src/assets/characters/sakura/thinking.png',
    excited: '/src/assets/characters/sakura/excited.png',
    sad: '/src/assets/characters/sakura/sad.png',
  },
  character_002: { // Kenji
    default: '/src/assets/characters/kenji/Main-1.png',
    happy: '/src/assets/characters/kenji/Main-1.png',
    thinking: '/src/assets/characters/kenji/Thinking-1.png',
    excited: '/src/assets/characters/kenji/Cheering-1.png',
    sad: '/src/assets/characters/kenji/Thinking-1.png',
  },
  character_003: { // Miko
    default: '/src/assets/characters/miko/default.png',
    happy: '/src/assets/characters/miko/happy.png',
    thinking: '/src/assets/characters/miko/thinking.png',
    excited: '/src/assets/characters/miko/excited.png',
    sad: '/src/assets/characters/miko/sad.png',
  },
};

// Get character image based on emotion
export const getCharacterImage = (characterId, emotion = 'default') => {
  const character = characterAssets[characterId];
  return character ? (character[emotion] || character.default) : characterAssets.character_001.default;
};

// Detect emotion from AI response text
export const detectEmotionFromText = (text) => {
  const lowerText = text.toLowerCase();
  
  // Excited emotions
  if (lowerText.includes('sugoi') || 
      lowerText.includes('yatta') || 
      lowerText.includes('waaah') ||
      lowerText.includes('let\'s go') ||
      lowerText.includes('exciting') ||
      lowerText.includes('amazing')) {
    return 'excited';
  }
  
  // Happy emotions
  if (lowerText.includes('ne~') || 
      lowerText.includes('😊') || 
      lowerText.includes('🌸') ||
      lowerText.includes('great') ||
      lowerText.includes('wonderful')) {
    return 'happy';
  }
  
  // Thinking emotions
  if (lowerText.includes('hmm') || 
      lowerText.includes('let me') || 
      lowerText.includes('think') ||
      lowerText.includes('consider') ||
      lowerText.includes('🤔')) {
    return 'thinking';
  }
  
  // Sad emotions
  if (lowerText.includes('gomen') || 
      lowerText.includes('sorry') || 
      lowerText.includes('unfortunately') ||
      lowerText.includes('trouble')) {
    return 'sad';
  }
  
  return 'default';
};

export default characterAssets;