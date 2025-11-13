import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  VStack,
  Text,
  SimpleGrid,
  useToast,
  FormControl,
  FormLabel,
  HStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

const MotionBox = motion(Box);

const personalities = [
  { value: 'cheerful', label: 'Cheerful', emoji: '😊', color: 'pink' },
  { value: 'energetic', label: 'Energetic', emoji: '⚡', color: 'orange' },
  { value: 'cool', label: 'Cool', emoji: '😎', color: 'blue' },
  { value: 'shy', label: 'Shy', emoji: '🥺', color: 'purple' },
];

const fandoms = [
  { value: 'anime', label: 'Anime', icon: '🎌' },
  { value: 'manga', label: 'Manga', icon: '📚' },
  { value: 'gaming', label: 'Gaming', icon: '🎮' },
  { value: 'movies', label: 'Movies', icon: '🎬' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const toast = useToast();
  const setUser = useStore((state) => state.setUser);
  const setCharacter = useStore((state) => state.setCharacter);

  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [personality, setPersonality] = useState('');
  const [selectedFandoms, setSelectedFandoms] = useState([]);

  const toggleFandom = (fandom) => {
    setSelectedFandoms((prev) =>
      prev.includes(fandom)
        ? prev.filter((f) => f !== fandom)
        : [...prev, fandom]
    );
  };

  const handleComplete = () => {
    if (!userName || !characterName || !personality || selectedFandoms.length === 0) {
      toast({
        title: 'Please complete all fields',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    // Save user data
    setUser({ 
      name: userName,
      createdAt: new Date().toISOString()
    });

    // Save character data with all necessary properties
    setCharacter({
      name: characterName,
      personality,
      fandoms: selectedFandoms,
      emotion: 'happy',
      level: 1,
      createdAt: new Date().toISOString()
    });

    toast({
      title: `Welcome, ${userName}! 🎉`,
      description: `${characterName} is excited to explore with you!`,
      status: 'success',
      duration: 3000,
    });

    navigate('/home');
  };

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="container.sm">
        <VStack spacing={8}>
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            textAlign="center"
          >
            <Heading size="2xl" color="brand.600" mb={2}>
              NakamaGo 🎌
            </Heading>
            <Text color="gray.600">Your anime pilgrimage companion</Text>
          </MotionBox>

          <HStack spacing={2} w="100%">
            {[1, 2, 3].map((s) => (
              <Box
                key={s}
                h="4px"
                flex="1"
                bg={s <= step ? 'brand.500' : 'gray.300'}
                borderRadius="full"
                transition="all 0.3s"
              />
            ))}
          </HStack>

          {step === 1 && (
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              w="100%"
            >
              <VStack spacing={6} bg="white" p={8} borderRadius="2xl" boxShadow="xl">
                <Heading size="lg">What's your name?</Heading>
                <FormControl>
                  <Input
                    placeholder="Enter your name"
                    size="lg"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && userName && setStep(2)}
                  />
                </FormControl>
                <Button
                  colorScheme="brand"
                  size="lg"
                  w="100%"
                  onClick={() => setStep(2)}
                  isDisabled={!userName}
                >
                  Continue →
                </Button>
              </VStack>
            </MotionBox>
          )}

          {step === 2 && (
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              w="100%"
            >
              <VStack spacing={6} bg="white" p={8} borderRadius="2xl" boxShadow="xl">
                <Heading size="lg">Create Your Companion</Heading>

                <FormControl>
                  <FormLabel>Character Name</FormLabel>
                  <Input
                    placeholder="e.g., Yuki, Sakura..."
                    size="lg"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Personality</FormLabel>
                  <SimpleGrid columns={2} spacing={3}>
                    {personalities.map((p) => (
                      <Box
                        key={p.value}
                        as="button"
                        p={4}
                        borderRadius="xl"
                        borderWidth="2px"
                        borderColor={personality === p.value ? `${p.color}.500` : 'gray.200'}
                        bg={personality === p.value ? `${p.color}.50` : 'white'}
                        transition="all 0.2s"
                        onClick={() => setPersonality(p.value)}
                        _hover={{ transform: 'scale(1.05)' }}
                      >
                        <Text fontSize="3xl" mb={2}>{p.emoji}</Text>
                        <Text fontWeight="bold">{p.label}</Text>
                      </Box>
                    ))}
                  </SimpleGrid>
                </FormControl>

                <HStack w="100%" spacing={3}>
                  <Button variant="outline" onClick={() => setStep(1)} flex="1">
                    ← Back
                  </Button>
                  <Button
                    colorScheme="brand"
                    onClick={() => setStep(3)}
                    isDisabled={!characterName || !personality}
                    flex="1"
                  >
                    Continue →
                  </Button>
                </HStack>
              </VStack>
            </MotionBox>
          )}

          {step === 3 && (
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              w="100%"
            >
              <VStack spacing={6} bg="white" p={8} borderRadius="2xl" boxShadow="xl">
                <Heading size="lg">What are you into?</Heading>
                <Text color="gray.600">Select all that apply</Text>

                <SimpleGrid columns={2} spacing={3} w="100%">
                  {fandoms.map((fandom) => (
                    <Box
                      key={fandom.value}
                      as="button"
                      p={6}
                      borderRadius="xl"
                      borderWidth="2px"
                      borderColor={
                        selectedFandoms.includes(fandom.value) ? 'brand.500' : 'gray.200'
                      }
                      bg={selectedFandoms.includes(fandom.value) ? 'brand.50' : 'white'}
                      transition="all 0.2s"
                      onClick={() => toggleFandom(fandom.value)}
                      _hover={{ transform: 'scale(1.05)' }}
                    >
                      <Text fontSize="3xl" mb={2}>{fandom.icon}</Text>
                      <Text fontWeight="bold">{fandom.label}</Text>
                    </Box>
                  ))}
                </SimpleGrid>

                <HStack w="100%" spacing={3}>
                  <Button variant="outline" onClick={() => setStep(2)} flex="1">
                    ← Back
                  </Button>
                  <Button
                    colorScheme="brand"
                    onClick={handleComplete}
                    isDisabled={selectedFandoms.length === 0}
                    flex="1"
                  >
                    Let's Go! 🚀
                  </Button>
                </HStack>
              </VStack>
            </MotionBox>
          )}
        </VStack>
      </Container>
    </Box>
  );
}