import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

// For now, using placeholder images. You'll replace with actual character sprites
const CHARACTER_IMAGES = {
  character_001: require('../../assets/characters/sakura.png'),
  character_002: require('../../assets/characters/kenji.png'),
  character_003: require('../../assets/characters/miko.png'),
};

const CharacterDisplay = ({ characterId, size = 'small', outfit, accessories }) => {
  const sizeStyles = size === 'small' ? styles.small : styles.large;
  
  return (
    <View style={[styles.container, sizeStyles]}>
      <Image
        source={CHARACTER_IMAGES[characterId]}
        style={[styles.image, sizeStyles]}
        resizeMode="contain"
      />
      {/* Later: Add outfit and accessory layers */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  small: {
    width: 50,
    height: 50,
  },
  large: {
    width: 200,
    height: 200,
  },
});

export default CharacterDisplay;