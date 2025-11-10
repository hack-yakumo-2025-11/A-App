import { Box, Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { CharacterEmoji } from './CharacterEmoji';

const MotionBox = motion(Box);

export function Character({ emotion = 'happy', message, name = 'Yuki' }) {
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

  return (
    <VStack spacing={4} py={6} position="relative">
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
        <CharacterEmoji emotion={emotion} size="120px" />
      </MotionBox>

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
          <Text fontSize="md" lineHeight="tall">
            {displayedMessage}
            {isTyping && (
              <Text as="span" className="typing-indicator">
                ▌
              </Text>
            )}
          </Text>
        </MotionBox>
      )}

      <Box
        bg="brand.500"
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
    </VStack>
  );
}