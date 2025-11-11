import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useCharacter } from '../../context/CharacterContext';
import CharacterDisplay from '../CharacterChatbot/CharacterDisplay';
import { getCharacterInfo } from '../../services/openaiService';

const CHARACTERS = [
  {
    id: 'character_001',
    name: 'Sakura',
    description: 'Energetic and enthusiastic',
    isPremium: false,
  },
  {
    id: 'character_002',
    name: 'Kenji',
    description: 'Calm and knowledgeable',
    isPremium: false,
  },
  {
    id: 'character_003',
    name: 'Miko',
    description: 'Playful and mysterious',
    isPremium: false,
  },
  // Future premium characters
  // {
  //   id: 'character_004',
  //   name: 'Licensed Character',
  //   description: 'From [Anime Name]',
  //   isPremium: true,
  // },
];

const CharacterSelection = () => {
  const { selectedCharacter, saveCharacterSettings, characterOutfit, characterAccessories } = useCharacter();

  const handleSelectCharacter = async (characterId) => {
    await saveCharacterSettings(characterId, characterOutfit, characterAccessories);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Choose Your Guide</Text>
      
      <View style={styles.charactersGrid}>
        {CHARACTERS.map((character) => (
          <TouchableOpacity
            key={character.id}
            style={[
              styles.characterCard,
              selectedCharacter === character.id && styles.selectedCard
            ]}
            onPress={() => handleSelectCharacter(character.id)}
            disabled={character.isPremium}
          >
            <CharacterDisplay
              characterId={character.id}
              size="large"
            />
            <Text style={styles.characterName}>{character.name}</Text>
            <Text style={styles.characterDescription}>
              {character.description}
            </Text>
            
            {character.isPremium && (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumText}>👑 Premium</Text>
              </View>
            )}
            
            {selectedCharacter === character.id && (
              <View style={styles.selectedBadge}>
                <Text style={styles.selectedText}>✓ Selected</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'center',
  },
  charactersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  characterCard: {
    width: '45%',
    backgroundColor: '#F9F9F9',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#FF69B4',
    backgroundColor: '#FFF5F8',
  },
  characterName: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    color: '#333',
  },
  characterDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  premiumBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 10,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '600',
  },
  selectedBadge: {
    backgroundColor: '#FF69B4',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 10,
  },
  selectedText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default CharacterSelection;