import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  VStack,
  Text,
  Image,
  Badge,
  Button,
  useToast,
  HStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { CheckCircleIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useStore } from '../store/useStore';
import { CHARACTER_PERSONALITIES } from '../services/openaiService';
import { getCharacterImage } from '../utils/characterAssets';

const CHARACTERS = [
  {
    id: 'character_001',
    name: 'Sakura',
    description: 'Energetic and enthusiastic',
    personality: 'Uses "sugoi!", "ne~", lots of emojis',
    color: 'pink',
    isPremium: false,
  },
  {
    id: 'character_002',
    name: 'Kenji',
    description: 'Calm and knowledgeable',
    personality: 'Informative, factual, educational',
    color: 'blue',
    isPremium: false,
  },
  {
    id: 'character_003',
    name: 'Miko',
    description: 'Playful and mysterious',
    personality: 'Uses "ara ara~", mystical vibes',
    color: 'purple',
    isPremium: false,
  },
];

const EMOTIONS = ['default', 'happy', 'thinking', 'excited', 'sad'];

export default function CharacterSelection() {
  const navigate = useNavigate();
  const toast = useToast();
  const selectedCharacterId = useStore((state) => state.selectedCharacterId);
  const setSelectedCharacter = useStore((state) => state.setSelectedCharacter);
  const clearConversationHistory = useStore((state) => state.clearConversationHistory);

  const [previewEmotion, setPreviewEmotion] = useState('default');

  const handleSelectCharacter = (characterId) => {
    setSelectedCharacter(characterId);
    clearConversationHistory();
    
    const characterInfo = CHARACTER_PERSONALITIES[characterId];
    toast({
      title: '✨ Character updated!',
      description: `${characterInfo.name} is now your guide`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box minH="100vh" bg="gray.50" py={8} pb={32}>
      <Container maxW="container.lg">
        <VStack spacing={8}>
          {/* Header */}
          <VStack spacing={2}>
            <HStack spacing={4} w="full">
              <Button
                leftIcon={<ArrowBackIcon />}
                variant="ghost"
                onClick={() => navigate('/home')}
              >
                Back
              </Button>
            </HStack>
            <Heading size="xl">Choose Your AI Guide</Heading>
            <Text color="gray.600" textAlign="center">
              Select your anime companion with multiple emotions
            </Text>
          </VStack>

          {/* Character Grid */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
            {CHARACTERS.map((char) => {
              const isSelected = selectedCharacterId === char.id;

              return (
                <Box
                  key={char.id}
                  position="relative"
                  bg="white"
                  borderRadius="xl"
                  boxShadow="md"
                  border="3px solid"
                  borderColor={isSelected ? `${char.color}.400` : 'transparent'}
                  cursor="pointer"
                  onClick={() => handleSelectCharacter(char.id)}
                  transition="all 0.3s"
                  overflow="hidden"
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: 'xl',
                    borderColor: `${char.color}.300`,
                  }}
                >
                  {isSelected && (
                    <CheckCircleIcon
                      position="absolute"
                      top={4}
                      right={4}
                      color={`${char.color}.400`}
                      boxSize={6}
                      zIndex={2}
                    />
                  )}

                  {/* Character Image Preview with Emotion Tabs */}
                  <Box bg={`${char.color}.50`}>
                    <Tabs
                      size="sm"
                      variant="soft-rounded"
                      colorScheme={char.color}
                      onChange={(index) => setPreviewEmotion(EMOTIONS[index])}
                    >
                      <TabList justifyContent="center" p={2}>
                        {EMOTIONS.map((emotion) => (
                          <Tab key={emotion} fontSize="xs">
                            {emotion === 'default' && '😊'}
                            {emotion === 'happy' && '😄'}
                            {emotion === 'thinking' && '🤔'}
                            {emotion === 'excited' && '🎉'}
                            {emotion === 'sad' && '😢'}
                          </Tab>
                        ))}
                      </TabList>

                      <Box
                        h="280px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        p={4}
                      >
                        <Image
                          src={getCharacterImage(char.id, previewEmotion)}
                          alt={`${char.name} - ${previewEmotion}`}
                          maxH="100%"
                          maxW="100%"
                          objectFit="contain"
                          transition="all 0.3s"
                        />
                      </Box>
                    </Tabs>
                  </Box>

                  {/* Character Info */}
                  <VStack spacing={3} p={6}>
                    <Heading size="md" color={`${char.color}.600`}>
                      {char.name}
                    </Heading>
                    <Badge colorScheme={char.color} fontSize="xs">
                      {char.description}
                    </Badge>

                    <Box
                      bg={`${char.color}.50`}
                      p={3}
                      borderRadius="lg"
                      w="full"
                    >
                      <Text fontSize="sm" color="gray.700" textAlign="center">
                        {char.personality}
                      </Text>
                    </Box>

                    <Box
                      bg="gray.50"
                      p={3}
                      borderRadius="lg"
                      w="full"
                      borderLeft="3px solid"
                      borderColor={`${char.color}.400`}
                    >
                      <Text fontSize="xs" color="gray.600" fontStyle="italic">
                        {char.id === 'character_001' && '"Sugoi! Let\'s explore, ne~! 🌸"'}
                        {char.id === 'character_002' && '"I can guide you to authentic locations."'}
                        {char.id === 'character_003' && '"Ara ara~ Ready for an adventure? ⛩️"'}
                      </Text>
                    </Box>
                  </VStack>
                </Box>
              );
            })}
          </SimpleGrid>

          <HStack spacing={4} w="full" justify="center">
            <Button
              size="lg"
              colorScheme="pink"
              onClick={() => navigate('/home')}
              w={{ base: 'full', md: 'auto' }}
            >
              Continue with {CHARACTER_PERSONALITIES[selectedCharacterId].name}
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}