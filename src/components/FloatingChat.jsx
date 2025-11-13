import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Input,
  IconButton,
  Text,
  VStack,
  HStack,
  Image,
  Spinner,
  Collapse,
  useToast,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { FiSend } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { sendMessageToCharacter, getCharacterInfo } from '../services/openaiService';
import { getCharacterImage, detectEmotionFromText } from '../utils/characterAssets';

const MotionBox = motion(Box);
const MotionImage = motion(Image);

export default function FloatingChat() {
  const navigate = useNavigate();
  const toast = useToast();
  
  const selectedCharacterId = useStore((state) => state.selectedCharacterId);
  const conversationHistory = useStore((state) => state.conversationHistory);
  const addToConversationHistory = useStore((state) => state.addToConversationHistory);
  const isChatMinimized = useStore((state) => state.isChatMinimized);
  const toggleChatMinimized = useStore((state) => state.toggleChatMinimized);
  const setAnimeFilter = useStore((state) => state.setAnimeFilter);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('default');
  const messagesEndRef = useRef(null);
  const character = getCharacterInfo(selectedCharacterId);

  // Initial greeting
  useEffect(() => {
    setMessages([{
      id: '0',
      text: `Konnichiwa! I'm ${character.name}, your anime pilgrimage guide! Where would you like to explore today? 🗾✨`,
      isUser: false,
      timestamp: new Date(),
    }]);
    setCurrentEmotion('happy');
  }, [selectedCharacterId, character.name]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setCurrentEmotion('thinking'); // Show thinking emotion

    addToConversationHistory({ role: 'user', content: inputText });

    try {
      const response = await sendMessageToCharacter(
        inputText,
        selectedCharacterId,
        conversationHistory
      );

      // Detect emotion from response
      const emotion = detectEmotionFromText(response.response);
      setCurrentEmotion(emotion);

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      addToConversationHistory({ role: 'assistant', content: response.response });

      // Handle filter command
      if (response.filterAnime) {
        setCurrentEmotion('excited');
        setAnimeFilter(response.filterAnime);
        
        setTimeout(() => {
          navigate('/map', { 
            state: { filterAnime: response.filterAnime }
          });
          toast({
            title: '🎌 Filtering locations',
            description: `Showing all ${response.filterAnime} locations`,
            status: 'success',
            duration: 4000,
            isClosable: true,
          });
        }, 800);
      }
      // Handle navigation command
      else if (response.navigationLocation) {
        setCurrentEmotion('excited');
        
        setTimeout(() => {
          navigate('/map', { 
            state: { searchLocation: response.navigationLocation }
          });
          toast({
            title: '🗺️ Opening map',
            description: `Navigating to ${response.navigationLocation}`,
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        }, 800);
      }

    } catch (error) {
      console.error('FloatingChat error:', error);
      setCurrentEmotion('sad');
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "Gomen! I'm having trouble connecting right now. Please try again! 🙏",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: 'Connection Error',
        description: 'Please check your API keys',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box
      position="fixed"
      bottom="0"
      right={{ base: '0', md: '20px' }}
      left={{ base: '0', md: 'auto' }}
      width={{ base: '100%', md: '420px' }}
      bg="white"
      boxShadow="2xl"
      borderTopRadius="xl"
      zIndex="999"
      transition="all 0.3s ease"
      pointerEvents="auto"
    >
      {/* Header with Character DP */}
      <Flex
        p={4}
        bg="pink.400"
        borderTopRadius="xl"
        alignItems="center"
        justifyContent="space-between"
        cursor="pointer"
        onClick={toggleChatMinimized}
        _hover={{ bg: 'pink.500' }}
      >
        <HStack spacing={3}>
          {/* Character Display Picture */}
          <Box
            boxSize="50px"
            borderRadius="full"
            overflow="hidden"
            bg="white"
            border="3px solid white"
            boxShadow="lg"
          >
            <Image
              src={getCharacterImage(selectedCharacterId, 'default')}
              alt={character.name}
              boxSize="100%"
              objectFit="cover"
              fallbackSrc="https://via.placeholder.com/50"
            />
          </Box>
          <VStack align="start" spacing={0}>
            <Text color="white" fontWeight="bold" fontSize="md">
              {character.name}
            </Text>
            <Text color="whiteAlpha.900" fontSize="xs">
              Your anime guide
            </Text>
          </VStack>
        </HStack>
        <IconButton
          icon={isChatMinimized ? <ChevronUpIcon /> : <ChevronDownIcon />}
          size="sm"
          variant="ghost"
          colorScheme="whiteAlpha"
          aria-label="Toggle chat"
        />
      </Flex>

      {/* Chat Body */}
      <Collapse in={!isChatMinimized} animateOpacity>
        {/* Messages Area */}
        <VStack
          height="400px"
          overflowY="auto"
          p={4}
          spacing={3}
          align="stretch"
          bg="gray.50"
          css={{
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '4px',
            },
          }}
        >
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg.text}
              isUser={msg.isUser}
              timestamp={msg.timestamp}
            />
          ))}
          
          {isLoading && (
            <HStack spacing={2} alignSelf="flex-start">
              <Spinner size="sm" color="pink.400" />
              <Text fontSize="sm" color="gray.500" fontStyle="italic">
                {character.name} is typing...
              </Text>
            </HStack>
          )}
          
          <div ref={messagesEndRef} />
        </VStack>

        {/* Large Character Image - Bottom Right Corner */}
        <Box
          position="absolute"
          bottom="70px"
          right="15px"
          zIndex={100}
          pointerEvents="none"
        >
          <AnimatePresence mode="wait">
            <MotionBox
              key={currentEmotion}
              initial={{ opacity: 0, scale: 0.3, x: 50, y: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.3, x: 50, y: 50 }}
              transition={{ 
                duration: 0.4,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
            >
              <MotionImage
                src={getCharacterImage(selectedCharacterId, currentEmotion)}
                alt={`${character.name} - ${currentEmotion}`}
                height="180px"
                width="auto"
                objectFit="contain"
                filter="drop-shadow(0 8px 16px rgba(0,0,0,0.3))"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </MotionBox>
          </AnimatePresence>
        </Box>

        {/* Input Area */}
        <Box position="relative" bg="white" borderTop="1px" borderColor="gray.200">
          <Flex p={3} align="center">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about anime locations..."
              mr={2}
              borderRadius="full"
              disabled={isLoading}
              bg="gray.50"
              size="md"
            />
            <IconButton
              icon={<FiSend />}
              colorScheme="pink"
              borderRadius="full"
              onClick={handleSendMessage}
              isDisabled={!inputText.trim() || isLoading}
              aria-label="Send message"
              size="md"
            />
          </Flex>
        </Box>
      </Collapse>
    </Box>
  );
}

// Chat Bubble Component
function ChatBubble({ message, isUser, timestamp }) {
  return (
    <Flex
      alignSelf={isUser ? 'flex-end' : 'flex-start'}
      maxW="70%"
      flexDirection="column"
    >
      <Box
        bg={isUser ? 'pink.400' : 'white'}
        color={isUser ? 'white' : 'gray.800'}
        px={4}
        py={2}
        borderRadius="2xl"
        borderBottomRightRadius={isUser ? 'sm' : '2xl'}
        borderBottomLeftRadius={isUser ? '2xl' : 'sm'}
        boxShadow="sm"
      >
        <Text fontSize="sm" whiteSpace="pre-wrap">
          {message}
        </Text>
      </Box>
      <Text
        fontSize="xs"
        color="gray.500"
        mt={1}
        px={2}
        alignSelf={isUser ? 'flex-end' : 'flex-start'}
      >
        {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </Flex>
  );
}