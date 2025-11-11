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
  Avatar,
  Spinner,
  Collapse,
  useToast,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { FiSend } from 'react-icons/fi';
import { useStore } from '../store/useStore';
import { sendMessageToCharacter, getCharacterInfo } from '../services/openaiService';

export default function FloatingChat() {
  const navigate = useNavigate();
  const toast = useToast();
  
  // CORRECT ZUSTAND USAGE - Individual selectors
  const selectedCharacterId = useStore((state) => state.selectedCharacterId);
  const conversationHistory = useStore((state) => state.conversationHistory);
  const addToConversationHistory = useStore((state) => state.addToConversationHistory);
  const isChatMinimized = useStore((state) => state.isChatMinimized);
  const toggleChatMinimized = useStore((state) => state.toggleChatMinimized);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

    // Add to history
    addToConversationHistory({ role: 'user', content: inputText });

    try {
      const response = await sendMessageToCharacter(
        inputText,
        selectedCharacterId,
        conversationHistory
      );

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      addToConversationHistory({ role: 'assistant', content: response.response });

      // Handle navigation
      if (response.navigationLocation) {
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
        }, 1000);
      }

    } catch (error) {
      console.error('FloatingChat error:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "Gomen! I'm having trouble connecting right now. Please try again! 🙏",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: 'Connection Error',
        description: 'Please check your API keys in .env',
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
      width={{ base: '100%', md: '400px' }}
      bg="white"
      boxShadow="2xl"
      borderTopRadius="xl"
      zIndex="9999"
      transition="all 0.3s ease"
    >
      {/* Header */}
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
        <HStack>
          <Avatar
            size="sm"
            name={character.name}
            bg="pink.600"
          >
            <Text fontSize="xl">{character.avatar}</Text>
          </Avatar>
          <VStack align="start" spacing={0}>
            <Text color="white" fontWeight="bold" fontSize="sm">
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

        {/* Input Area */}
        <Flex p={3} bg="white" borderTop="1px" borderColor="gray.200">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about anime locations..."
            mr={2}
            borderRadius="full"
            disabled={isLoading}
          />
          <IconButton
            icon={<FiSend />}
            colorScheme="pink"
            borderRadius="full"
            onClick={handleSendMessage}
            isDisabled={!inputText.trim() || isLoading}
            aria-label="Send message"
          />
        </Flex>
      </Collapse>
    </Box>
  );
}

// Chat Bubble Component
function ChatBubble({ message, isUser, timestamp }) {
  return (
    <Flex
      alignSelf={isUser ? 'flex-end' : 'flex-start'}
      maxW="85%"
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