import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Image,
  HStack,
  IconButton,
  useToast,
  Badge,
  Progress,
} from '@chakra-ui/react';
import { MdArrowBack, MdCameraAlt } from 'react-icons/md';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Character } from '../components/Character';

const MotionBox = motion(Box);

export default function Checkin() {
  const { locationId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const fileInputRef = useRef(null);

  const locations = useStore((state) => state.locations);
  const visitLocation = useStore((state) => state.visitLocation);
  const visitedLocations = useStore((state) => state.visitedLocations);
  const character = useStore((state) => state.character);
  const level = useStore((state) => state.level);
  const xp = useStore((state) => state.xp);

  const [photo, setPhoto] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const location = locations.find((loc) => loc.id === locationId);
  const isAlreadyVisited = visitedLocations.includes(locationId);

  if (!location) {
    return (
      <Container maxW="container.sm" py={8}>
        <Text>Location not found</Text>
        <Button onClick={() => navigate('/map')} mt={4}>
          Back to Map
        </Button>
      </Container>
    );
  }

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckin = () => {
    if (!photo) {
      toast({
        title: 'Photo required',
        description: 'Please take a photo to check in!',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    // Visit location (adds XP, updates missions)
    visitLocation(locationId);
    setIsCheckedIn(true);

    toast({
      title: '🎉 Check-in successful!',
      description: `+${location.xpReward} XP earned!`,
      status: 'success',
      duration: 5000,
    });

    // Navigate back after 3 seconds
    setTimeout(() => {
      navigate('/map');
    }, 3000);
  };

  if (isCheckedIn) {
    const newXp = xp % 100;
    const newLevel = Math.floor(xp / 100) + 1;
    const leveledUp = newLevel > level;

    return (
      <Container maxW="container.sm" py={8}>
        <VStack spacing={6}>
          <MotionBox
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            <Text fontSize="6xl">🎉</Text>
          </MotionBox>

          <Heading size="xl" textAlign="center">
            Check-in Complete!
          </Heading>

          <Character
            name={character?.name}
            emotion="celebrating"
            message={
              leveledUp
                ? `Woah! You leveled up to Level ${newLevel}! Amazing! 🌟`
                : `Great job! Keep exploring! 💪`
            }
          />

          <Box bg="white" p={6} borderRadius="xl" w="100%" boxShadow="md">
            <VStack spacing={4}>
              <HStack justify="space-between" w="100%">
                <Text fontWeight="bold">XP Gained</Text>
                <Badge colorScheme="brand" fontSize="lg">
                  +{location.xpReward} XP
                </Badge>
              </HStack>

              {leveledUp && (
                <Box w="100%" p={4} bg="yellow.50" borderRadius="md">
                  <Text fontWeight="bold" color="yellow.700" textAlign="center">
                    🎊 Level Up! Now Level {newLevel}! 🎊
                  </Text>
                </Box>
              )}

              <Box w="100%">
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="sm">Progress to next level</Text>
                  <Text fontSize="sm" color="gray.600">
                    {newXp}/100 XP
                  </Text>
                </HStack>
                <Progress value={newXp} max={100} colorScheme="brand" borderRadius="full" />
              </Box>
            </VStack>
          </Box>

          <Button colorScheme="brand" onClick={() => navigate('/map')} w="100%">
            Continue Exploring
          </Button>
        </VStack>
      </Container>
    );
  }

  if (isAlreadyVisited) {
    return (
      <Container maxW="container.sm" py={8}>
        <VStack spacing={6}>
          <IconButton
            icon={<MdArrowBack />}
            variant="ghost"
            alignSelf="flex-start"
            onClick={() => navigate('/map')}
          />

          <Box textAlign="center">
            <Text fontSize="5xl" mb={4}>
              ✅
            </Text>
            <Heading size="lg" mb={2}>
              Already Visited
            </Heading>
            <Text color="gray.600">You've already checked in to this location!</Text>
          </Box>

          <Image
            src={location.image}
            alt={location.name}
            borderRadius="xl"
            maxH="300px"
            objectFit="cover"
          />

          <Button onClick={() => navigate('/map')} w="100%">
            Back to Map
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="white" borderBottomWidth="1px" py={3} px={4}>
        <HStack>
          <IconButton
            icon={<MdArrowBack />}
            variant="ghost"
            onClick={() => navigate('/map')}
          />
          <Text fontWeight="bold" fontSize="lg">
            Check In
          </Text>
        </HStack>
      </Box>

      <Container maxW="container.sm" py={6}>
        <VStack spacing={6}>
          {/* Location Info */}
          <Box bg="white" p={6} borderRadius="xl" w="100%" boxShadow="md">
            <VStack spacing={3} align="start">
              <HStack>
                <Badge colorScheme="pink">{location.anime}</Badge>
                <Badge colorScheme="purple">+{location.xpReward} XP</Badge>
              </HStack>
              <Heading size="lg">{location.name}</Heading>
              <Text color="gray.600">{location.description}</Text>
            </VStack>
          </Box>

          {/* Reference Image */}
          <Box w="100%">
            <Text fontWeight="bold" mb={2}>
              Reference Photo:
            </Text>
            <Image
              src={location.image}
              alt={location.name}
              borderRadius="xl"
              w="100%"
              maxH="250px"
              objectFit="cover"
              boxShadow="md"
            />
          </Box>

          {/* Photo Upload */}
          <Box bg="white" p={6} borderRadius="xl" w="100%" boxShadow="md">
            <VStack spacing={4}>
              <Text fontWeight="bold">Your Photo:</Text>

              {photo ? (
                <Box position="relative" w="100%">
                  <Image
                    src={photo}
                    alt="Your photo"
                    borderRadius="xl"
                    w="100%"
                    maxH="250px"
                    objectFit="cover"
                  />
                  <Button
                    size="sm"
                    position="absolute"
                    top="8px"
                    right="8px"
                    onClick={() => fileInputRef.current.click()}
                  >
                    Change Photo
                  </Button>
                </Box>
              ) : (
                <Button
                  leftIcon={<MdCameraAlt />}
                  onClick={() => fileInputRef.current.click()}
                  size="lg"
                  w="100%"
                  h="200px"
                  variant="outline"
                  colorScheme="brand"
                >
                  Take or Upload Photo
                </Button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: 'none' }}
                onChange={handlePhotoSelect}
              />
            </VStack>
          </Box>

          {/* Check-in Button */}
          <Button
            colorScheme="brand"
            size="lg"
            w="100%"
            onClick={handleCheckin}
            isDisabled={!photo}
          >
            Complete Check-in 🎉
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}