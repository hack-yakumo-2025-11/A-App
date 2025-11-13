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
} from '@chakra-ui/react';
import { MdChat, MdMap, MdPerson } from 'react-icons/md';
import { useStore } from '../store/useStore';
import { Character } from '../components/Character';

export default function Home() {
  const navigate = useNavigate();
  const character = useStore((state) => state.character);
  const user = useStore((state) => state.user);
  const level = useStore((state) => state.level);
  const xp = useStore((state) => state.xp);
  const visitedLocations = useStore((state) => state.visitedLocations);

  const xpForNextLevel = level * 100;
  const xpProgress = (xp % 100);

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

          {/* Character Display - NO PERSONALITY PROP */}
          <Box bg="white" borderRadius="2xl" p={6} w="100%" boxShadow="md">
            <Character
              name={character?.name || 'Yuki'}
              emotion={character?.emotion || 'happy'}
              message=""
            />
          </Box>

          {/* Level Progress */}
          <Box bg="white" borderRadius="2xl" p={6} w="100%" boxShadow="md">
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Text fontWeight="bold" fontSize="lg">Level {level}</Text>
                <Badge colorScheme="brand" fontSize="sm">
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
              <Text fontSize="sm" color="gray.600">
                📍 Visited {visitedLocations.length} locations
              </Text>
            </VStack>
          </Box>

          {/* Action Buttons */}
          <VStack spacing={3} w="100%">
            <Button
              leftIcon={<MdChat />}
              size="lg"
              w="100%"
              colorScheme="brand"
              onClick={() => navigate('/chat')}
            >
              Chat with {character?.name || 'Your Companion'}
            </Button>
            <Button
              leftIcon={<MdMap />}
              size="lg"
              w="100%"
              variant="outline"
              colorScheme="brand"
              onClick={() => navigate('/map')}
            >
              Explore Map
            </Button>
            <Button
              leftIcon={<MdPerson />}
              size="lg"
              w="100%"
              variant="ghost"
              onClick={() => navigate('/profile')}
            >
              View Profile
            </Button>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}