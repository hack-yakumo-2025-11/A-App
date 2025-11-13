// Character emotion images
const characterAssets = {
  character_001: { // Sakura
    default: '/characters/sakura/default.png',
    happy: '/characters/sakura/happy.png',
    thinking: '/characters/sakura/thinking.png',
    excited: '/characters/sakura/excited.png',
    sad: '/characters/sakura/sad.png',
  },
  character_002: { // Kenji
    default: '/characters/kenji/default.png',
    happy: '/characters/kenji/happy.png',
    thinking: '/characters/kenji/thinking.png',
    excited: '/characters/kenji/excited.png',
    sad: '/characters/kenji/sad.png',
  },
  character_003: { // Miko
    default: '/characters/miko/default.png',
    happy: '/characters/miko/happy.png',
    thinking: '/characters/miko/thinking.png',
    excited: '/characters/miko/excited.png',
    sad: '/characters/miko/sad.png',
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