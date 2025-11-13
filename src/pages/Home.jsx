import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  VStack,
  Button,
  Text,
  Progress,
  HStack,
  Badge,
  Image,
  Flex,
} from '@chakra-ui/react';
import { MdChat, MdLogout, MdMap, MdPerson, MdSwapHoriz } from 'react-icons/md';
import { useStore } from '../store/useStore';
import { Character } from '../components/Character';
import { CHARACTER_PERSONALITIES } from '../services/openaiService';
import { getCharacterImage } from '../utils/characterAssets';

export default function Home() {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const level = user.level;
  const xp = user.xp;
  const visitedLocations = useStore((state) => state.visitedLocations);
  const selectedCharacterId = useStore((state) => state.selectedCharacterId);
  const setInitialState = useStore((state) => state.setInitialState);

  const xpForNextLevel = level * 100;
  const xpProgress = (xp % 100);

  // Get current AI guide info
  const currentAIGuide = CHARACTER_PERSONALITIES[selectedCharacterId] || CHARACTER_PERSONALITIES['character_001'];
  return (
    <Box minH="100vh" bg="gray.50" pb={32}>
      <Container maxW="container.sm" py={8}>
        <VStack spacing={6}>
          {/* Welcome Header */}
          <Box textAlign="center">
            <Text color="gray.600">Welcome back,</Text>
            <Heading size="xl" color="brand.600">
              {user?.name || 'Traveler'}! 👋
            </Heading>
          </Box>

          {/* AI Guide Info Card */}
          <Box 
            bg="white" 
            borderRadius="2xl" 
            p={4} 
            w="100%" 
            boxShadow="md"
            borderWidth="2px"
            borderColor="pink.200"
          >
            <HStack justify="space-between" align="center">
              <HStack spacing={3}>
                {/* Character Image instead of Avatar */}
                <Box
                  boxSize="60px"
                  borderRadius="full"
                  overflow="hidden"
                  border="3px solid"
                  borderColor="pink.300"
                  bg="white"
                >
                  <Image
                    src={getCharacterImage(selectedCharacterId, 'happy')}
                    alt={currentAIGuide.name}
                    boxSize="100%"
                    objectFit="cover"
                  />
                </Box>
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold" fontSize="md">
                    Your AI Guide: {currentAIGuide.name}
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    {currentAIGuide.personality}
                  </Text>
                </VStack>
              </HStack>
              <Button
                size="sm"
                variant="outline"
                colorScheme="pink"
                leftIcon={<MdSwapHoriz />}
                onClick={() => navigate('/character-selection')}
              >
                Change
              </Button>
            </HStack>
          </Box>

          {/* Character Display */}
          <Box bg="white" borderRadius="2xl" p={6} w="100%" boxShadow="md">
           
            <Image
              src={getCharacterImage(selectedCharacterId, 'default')}
              alt={currentAIGuide.name}
              boxSize="100%"
              objectFit="cover"
              fallbackSrc="https://via.placeholder.com/50"
            />
          </Box>

          {/* Level Progress */}
          <Box bg="white" borderRadius="2xl" p={6} w="100%" boxShadow="md">
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Text fontWeight="bold" fontSize="lg">Level {level}</Text>
                <Badge colorScheme="brand" fontSize="sm" px={3} py={1}>
                  {xpProgress}/{xpForNextLevel} XP
                </Badge>
              </HStack>
              <Progress
                value={xpProgress}
                max={xpForNextLevel}
                colorScheme="brand"
                borderRadius="full"
                size="sm"
                hasStripe
                isAnimated
              />
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" color="gray.600">
                  📍 Visited {visitedLocations.length} locations
                </Text>
                {visitedLocations.length > 0 && (
                  <Badge colorScheme="green" fontSize="xs">
                    +{visitedLocations.length * 100} XP earned
                  </Badge>
                )}
              </Flex>
            </VStack>
          </Box>

          {/* Quick Stats */}
          <HStack spacing={3} w="100%">
            <Box
              flex="1"
              bg="white"
              p={4}
              borderRadius="xl"
              textAlign="center"
              boxShadow="sm"
            >
              <Text fontSize="2xl" fontWeight="bold" color="brand.500">
                {level}
              </Text>
              <Text fontSize="xs" color="gray.600">
                Level
              </Text>
            </Box>
            <Box
              flex="1"
              bg="white"
              p={4}
              borderRadius="xl"
              textAlign="center"
              boxShadow="sm"
            >
              <Text fontSize="2xl" fontWeight="bold" color="green.500">
                {visitedLocations.length}
              </Text>
              <Text fontSize="xs" color="gray.600">
                Visited
              </Text>
            </Box>
            <Box
              flex="1"
              bg="white"
              p={4}
              borderRadius="xl"
              textAlign="center"
              boxShadow="sm"
            >
              <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                {xp}
              </Text>
              <Text fontSize="xs" color="gray.600">
                Total XP
              </Text>
            </Box>
          </HStack>

          {/* Action Buttons */}
          <VStack spacing={3} w="100%">
            <Button
              leftIcon={<MdMap />}
              size="lg"
              w="100%"
              variant="outline"
              colorScheme="brand"
              onClick={() => navigate('/map')}
              _hover={{ transform: 'translateY(-2px)', bg: 'brand.50' }}
              transition="all 0.2s"
            >
              Explore Map
            </Button>
            <Button
              leftIcon={<MdPerson />}
              size="lg"
              w="100%"
              variant="ghost"
              onClick={() => navigate('/profile')}
              _hover={{ bg: 'gray.100' }}
            >
              View Profile
            </Button>
            <Button
              leftIcon={<MdLogout />}
              size="lg"
              w="100%"
              variant="ghost"
              onClick={() => {
                  navigate('/');
                  setInitialState()
                }
              }
              _hover={{ bg: 'gray.100' }}
            >
              Logout
            </Button>
          </VStack>

          {/* Quick Tip */}
          <Box
            bg="gradient"
            bgGradient="linear(to-r, pink.50, purple.50)"
            p={4}
            borderRadius="xl"
            w="100%"
            borderLeft="4px solid"
            borderColor="pink.400"
          >
            <HStack>
              <Text fontSize="2xl">💡</Text>
              <VStack align="start" spacing={0} flex="1">
                <Text fontSize="sm" fontWeight="bold" color="gray.700">
                  Pro Tip
                </Text>
                <Text fontSize="xs" color="gray.600">
                  Try saying "Take me to [location]" in the chat to instantly navigate to anime spots!
                </Text>
              </VStack>
            </HStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}