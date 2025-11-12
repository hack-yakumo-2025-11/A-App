import { Box, Text, VStack, Avatar } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const MotionBox = motion(Box);

// Personality to emoji mapping
const getPersonalityEmoji = (emotion) => {
  const emojiMap = {
    happy: '😊',
    cheerful: '😊',
    energetic: '⚡',
    cool: '😎',
    shy: '🥺',
    excited: '🤩',
  };
  return emojiMap[emotion] || '😊';
};

// Get personality color
const getPersonalityColor = (personality) => {
  const colorMap = {
    cheerful: 'pink',
    energetic: 'orange',
    cool: 'blue',
    shy: 'purple',
  };
  return colorMap[personality] || 'pink';
};

export function Character({ emotion = 'happy', message, name = 'Yuki', personality }) {
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!message) {
      setDisplayedMessage('');
      return;
    }

    setIsTyping(true);
    setDisplayedMessage('');
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < message.length) {
        setDisplayedMessage((prev) => prev + message[i]);
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [message]);

  const displayEmotion = emotion || personality || 'happy';
  const colorScheme = getPersonalityColor(personality || 'cheerful');

  return (
    <VStack spacing={4} py={6} position="relative">
      {/* Floating Character Avatar */}
      <MotionBox
        animate={{
          y: [0, -12, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Avatar
          size="2xl"
          name={name}
          bg={`${colorScheme}.400`}
          boxShadow="xl"
        >
          <Text fontSize="4xl">
            {emotion}
          </Text>
        </Avatar>
      </MotionBox>

      {/* Character Name Badge */}
      <Box
        bg={`${colorScheme}.500`}
        color="white"
        px={4}
        py={1}
        borderRadius="full"
        fontSize="sm"
        fontWeight="bold"
        boxShadow="md"
      >
        {name}
      </Box>

      {/* Message Bubble - ONLY SHOW IF MESSAGE EXISTS */}
      {message && (
        <MotionBox
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          bg="white"
          p={4}
          borderRadius="2xl"
          boxShadow="lg"
          position="relative"
          maxW="320px"
          minW="200px"
          _before={{
            content: '""',
            position: 'absolute',
            top: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderBottom: '10px solid white',
          }}
        >
          <Text fontSize="md" lineHeight="tall" color="gray.700">
            {displayedMessage}
            {isTyping && (
              <Text as="span" ml={1}>
                ▌
              </Text>
            )}
          </Text>
        </MotionBox>
      )}
    </VStack>
  );
}