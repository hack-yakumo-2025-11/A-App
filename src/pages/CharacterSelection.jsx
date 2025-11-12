import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  VStack,
  Text,
  Avatar,
  Badge,
  Button,
  useToast,
  HStack,
} from '@chakra-ui/react';
import { CheckCircleIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useStore } from '../store/useStore';
import { CHARACTER_PERSONALITIES } from '../services/openaiService';

export const CHARACTERS_MAIN = [
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

export default function CharacterSelection() {
  const navigate = useNavigate();
  const toast = useToast();
  const selectedCharacterId = useStore((state) => state.selectedCharacterId);
  const setSelectedCharacter = useStore((state) => state.setSelectedCharacter);
  const clearConversationHistory = useStore((state) => state.clearConversationHistory);

  const handleSelectCharacter = (characterId) => {
    setSelectedCharacter(characterId);
    clearConversationHistory(); // Clear chat history when switching
    
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
            <Heading size="xl">Choose Your Guide</Heading>
            <Text color="gray.600" textAlign="center">
              Select the anime character who will accompany you on your pilgrimage
            </Text>
          </VStack>

          {/* Character Grid */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
            {CHARACTERS_MAIN.map((char) => {
              const characterInfo = CHARACTER_PERSONALITIES[char.id];
              const isSelected = selectedCharacterId === char.id;

              return (
                <Box
                  key={char.id}
                  position="relative"
                  p={6}
                  bg="white"
                  borderRadius="xl"
                  boxShadow="md"
                  border="3px solid"
                  borderColor={isSelected ? `${char.color}.400` : 'transparent'}
                  cursor="pointer"
                  onClick={() => handleSelectCharacter(char.id)}
                  transition="all 0.3s"
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
                    />
                  )}

                  <VStack spacing={4}>
                    {/* Character Avatar */}
                    <Avatar
                      size="2xl"
                      name={char.name}
                      bg={`${char.color}.400`}
                      color="white"
                    >
                      <Text fontSize="4xl">{characterInfo.avatar}</Text>
                    </Avatar>

                    {/* Character Info */}
                    <VStack spacing={2}>
                      <Heading size="md" color={`${char.color}.600`}>
                        {char.name}
                      </Heading>
                      <Badge colorScheme={char.color} fontSize="xs">
                        {char.description}
                      </Badge>
                    </VStack>

                    {/* Personality Description */}
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

                    {/* Premium Badge */}
                    {char.isPremium && (
                      <Badge colorScheme="yellow" fontSize="sm">
                        👑 Premium
                      </Badge>
                    )}

                    {/* Example Message */}
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
                        {char.id === 'character_002' && '"I can guide you to authentic anime locations."'}
                        {char.id === 'character_003' && '"Ara ara~ Ready for an adventure? ⛩️"'}
                      </Text>
                    </Box>
                  </VStack>
                </Box>
              );
            })}
          </SimpleGrid>

          {/* Action Buttons */}
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