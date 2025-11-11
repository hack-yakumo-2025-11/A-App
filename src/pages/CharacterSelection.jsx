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
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { useStore } from '../store/useStore';
import { CHARACTER_PERSONALITIES } from '../services/openaiService';

const CHARACTERS = [
  {
    id: 'character_001',
    name: 'Sakura',
    description: 'Energetic and enthusiastic',
    color: 'pink',
    isPremium: false,
  },
  {
    id: 'character_002',
    name: 'Kenji',
    description: 'Calm and knowledgeable',
    color: 'blue',
    isPremium: false,
  },
  {
    id: 'character_003',
    name: 'Miko',
    description: 'Playful and mysterious',
    color: 'purple',
    isPremium: false,
  },
];

export default function CharacterSelection() {
  const navigate = useNavigate();
  const toast = useToast();
  const { selectedCharacterId, setSelectedCharacter } = useStore();

  const handleSelectCharacter = (characterId) => {
    setSelectedCharacter(characterId);
    toast({
      title: 'Character updated!',
      description: `${CHARACTER_PERSONALITIES[characterId].name} is now your guide`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8}>
        <VStack spacing={2}>
          <Heading>Choose Your Guide</Heading>
          <Text color="gray.600">
            Select the anime character who will accompany you on your pilgrimage
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
          {CHARACTERS.map((char) => {
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
                  <Avatar
                    size="2xl"
                    name={char.name}
                    bg={`${char.color}.400`}
                    color="white"
                  >
                    <Text fontSize="4xl">{characterInfo.avatar}</Text>
                  </Avatar>

                  <VStack spacing={1}>
                    <Heading size="md">{char.name}</Heading>
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                      {char.description}
                    </Text>
                  </VStack>

                  {char.isPremium && (
                    <Badge colorScheme="yellow" fontSize="sm">
                      👑 Premium
                    </Badge>
                  )}

                  <Text fontSize="xs" color="gray.500" textAlign="center">
                    "{characterInfo.personality}"
                  </Text>
                </VStack>
              </Box>
            );
          })}
        </SimpleGrid>

        <Button
          size="lg"
          colorScheme="pink"
          onClick={() => navigate('/home')}
          w={{ base: 'full', md: 'auto' }}
        >
          Continue
        </Button>
      </VStack>
    </Container>
  );
}