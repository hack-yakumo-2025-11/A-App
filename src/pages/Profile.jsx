import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  IconButton,
  Progress,
  Badge,
  SimpleGrid,
  Divider,
  Avatar,
  Image,
} from '@chakra-ui/react';
import { MdArrowBack, MdLogout } from 'react-icons/md';
import { useStore } from '../store/useStore';
import { Character } from '../components/Character';
import { getCharacterImage } from '../utils/characterAssets';

export default function Profile() {
  const navigate = useNavigate();
  
  const user = useStore((state) => state.user);
  const character = useStore((state) => state.character);
  const level = useStore((state) => state.level);
  const xp = useStore((state) => state.xp);
  const visitedLocations = useStore((state) => state.visitedLocations);
  const locations = useStore((state) => state.locations);
  const achievements = useStore((state) => state.achievements);
  const dailyMissions = useStore((state) => state.dailyMissions);
  const selectedCharacterId = useStore((state) => state.selectedCharacterId);

  const xpProgress = xp % 100;
  const xpForNextLevel = 100;
  const totalLocations = locations.length;
  const completionPercentage = Math.round((visitedLocations.length / totalLocations) * 100);

  // Get unique anime visited
  const visitedAnime = [...new Set(
    visitedLocations.map(id => locations.find(loc => loc.id === id)?.anime).filter(Boolean)
  )];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out? Your progress will be saved.')) {
      navigate('/');
    }
  };

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="white" borderBottomWidth="1px" py={3} px={4}>
        <HStack justify="space-between">
          <HStack>
            <IconButton
              icon={<MdArrowBack />}
              variant="ghost"
              onClick={() => navigate('/home')}
            />
            <Text fontWeight="bold" fontSize="lg">
              Profile
            </Text>
          </HStack>
          <IconButton
            icon={<MdLogout />}
            variant="ghost"
            colorScheme="red"
            onClick={handleLogout}
          />
        </HStack>
      </Box>

      <Container maxW="container.sm" py={6}>
        <VStack spacing={6}>
          {/* User Info */}
          <Box bg="white" p={6} borderRadius="xl" w="100%" boxShadow="md">
            <VStack spacing={4}>
              <Avatar name={user?.name} size="xl" bg="brand.500" />
              <Heading size="lg">{user?.name}</Heading>
              <HStack spacing={3}>
                <Badge colorScheme="brand" fontSize="md" px={3} py={1}>
                  Level {level}
                </Badge>
                <Badge colorScheme="purple" fontSize="md" px={3} py={1}>
                  {visitedLocations.length} Visited
                </Badge>
              </HStack>
            </VStack>
          </Box>

          {/* Character Info */}
          <Box bg="white" p={6} borderRadius="xl" w="100%" boxShadow="md">
            <VStack spacing={4}>
              <Text fontWeight="bold" fontSize="lg">
                Your Companion
              </Text>
              <Image
                src={getCharacterImage(selectedCharacterId, 'default')}
                alt={character.name}
                boxSize="100%"
                objectFit="cover"
                fallbackSrc="https://via.placeholder.com/50"
              />
            </VStack>
          </Box>

          {/* XP Progress */}
          <Box bg="white" p={6} borderRadius="xl" w="100%" boxShadow="md">
            <VStack spacing={4} align="stretch">
              <Heading size="md">Experience</Heading>
              <HStack justify="space-between">
                <Text fontWeight="bold">Level {level}</Text>
                <Text color="gray.600">
                  {xpProgress}/{xpForNextLevel} XP
                </Text>
              </HStack>
              <Progress
                value={xpProgress}
                max={xpForNextLevel}
                colorScheme="brand"
                borderRadius="full"
                size="lg"
              />
              <Text fontSize="sm" color="gray.600" textAlign="center">
                {xpForNextLevel - xpProgress} XP until Level {level + 1}
              </Text>
            </VStack>
          </Box>

          {/* Stats */}
          <Box bg="white" p={6} borderRadius="xl" w="100%" boxShadow="md">
            <VStack spacing={4} align="stretch">
              <Heading size="md">Statistics</Heading>
              <SimpleGrid columns={2} spacing={4}>
                <Box textAlign="center" p={4} bg="pink.50" borderRadius="lg">
                  <Text fontSize="3xl" fontWeight="bold" color="brand.600">
                    {visitedLocations.length}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Locations Visited
                  </Text>
                </Box>
                <Box textAlign="center" p={4} bg="purple.50" borderRadius="lg">
                  <Text fontSize="3xl" fontWeight="bold" color="purple.600">
                    {completionPercentage}%
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Completion
                  </Text>
                </Box>
                <Box textAlign="center" p={4} bg="orange.50" borderRadius="lg">
                  <Text fontSize="3xl" fontWeight="bold" color="orange.600">
                    {visitedAnime.length}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Anime Series
                  </Text>
                </Box>
                <Box textAlign="center" p={4} bg="green.50" borderRadius="lg">
                  <Text fontSize="3xl" fontWeight="bold" color="green.600">
                    {achievements.length}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Achievements
                  </Text>
                </Box>
              </SimpleGrid>
            </VStack>
          </Box>

          {/* Daily Missions */}
          <Box bg="white" p={6} borderRadius="xl" w="100%" boxShadow="md">
            <VStack spacing={4} align="stretch">
              <Heading size="md">Daily Missions</Heading>
              {dailyMissions.map((mission) => (
                <Box
                  key={mission.id}
                  p={4}
                  bg={mission.completed ? 'green.50' : 'gray.50'}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={mission.completed ? 'green.200' : 'gray.200'}
                >
                  <HStack justify="space-between" mb={2}>
                    <Text fontWeight="bold">{mission.title}</Text>
                    {mission.completed ? (
                      <Badge colorScheme="green">Completed ✓</Badge>
                    ) : (
                      <Badge colorScheme="orange">In Progress</Badge>
                    )}
                  </HStack>
                  <Text fontSize="sm" color="gray.600" mb={2}>
                    {mission.description}
                  </Text>
                  {mission.progress !== undefined && (
                    <Progress
                      value={mission.progress}
                      max={mission.target}
                      colorScheme="brand"
                      size="sm"
                      borderRadius="full"
                    />
                  )}
                  <Text fontSize="xs" color="gray.500" mt={2}>
                    Reward: +{mission.xpReward} XP
                  </Text>
                </Box>
              ))}
            </VStack>
          </Box>

          {/* Achievements */}
          {achievements.length > 0 && (
            <Box bg="white" p={6} borderRadius="xl" w="100%" boxShadow="md">
              <VStack spacing={4} align="stretch">
                <Heading size="md">Achievements 🏆</Heading>
                <SimpleGrid columns={2} spacing={3}>
                  {achievements.includes('first-visit') && (
                    <Box textAlign="center" p={4} bg="yellow.50" borderRadius="lg">
                      <Text fontSize="3xl">🌟</Text>
                      <Text fontSize="sm" fontWeight="bold" mt={2}>
                        First Steps
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        Visited first location
                      </Text>
                    </Box>
                  )}
                  {achievements.includes('explorer') && (
                    <Box textAlign="center" p={4} bg="blue.50" borderRadius="lg">
                      <Text fontSize="3xl">🗺️</Text>
                      <Text fontSize="sm" fontWeight="bold" mt={2}>
                        Explorer
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        Visited 5 locations
                      </Text>
                    </Box>
                  )}
                </SimpleGrid>
              </VStack>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
}