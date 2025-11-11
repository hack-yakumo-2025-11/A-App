import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  HStack,
  Input,
  IconButton,
  Text,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { MdSend, MdArrowBack } from 'react-icons/md';
import { Character } from '../components/Character';
import { useStore } from '../store/useStore';
import { getCharacterResponse, quickResponses } from '../services/chat';

export default function Chat() {
  const navigate = useNavigate();
  const toast = useToast();
  
  const character = useStore((state) => state.character);
  const user = useStore((state) => state.user);
  const level = useStore((state) => state.level);
  const visitedLocations = useStore((state) => state.visitedLocations);
  const locations = useStore((state) => state.locations);
  const chatMessages = useStore((state) => state.chatMessages);
  const addChatMessage = useStore((state) => state.addChatMessage);

  const [input, setInput] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emotion, setEmotion] = useState('happy');
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, currentMessage]);

  useEffect(() => {
    if (chatMessages.length === 0 && character && user) {
      const greeting = quickResponses.greeting(user.name, character.personality);
      setCurrentMessage(greeting);
      addChatMessage({ role: 'assistant', content: greeting });
      
      setTimeout(() => {
        const invite = quickResponses.wantToHangout(character.personality);
        setCurrentMessage(invite);
        addChatMessage({ role: 'assistant', content: invite });
      }, 3000);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    addChatMessage({ role: 'user', content: userMessage });
    setIsLoading(true);
    setEmotion('thinking');

    const locationKeywords = ['where', 'location', 'place', 'visit', 'go', 'spot', 'yes', 'sure', 'okay'];
    const asksAboutLocation = locationKeywords.some(keyword => 
      userMessage.toLowerCase().includes(keyword)
    );

    try {
      let response;

      if (asksAboutLocation) {
        const unvisitedLocations = locations.filter(
          loc => !visitedLocations.includes(loc.id)
        );
        
        if (unvisitedLocations.length > 0) {
          const randomLocation = unvisitedLocations[Math.floor(Math.random() * unvisitedLocations.length)];
          response = quickResponses.showLocation(
            randomLocation.name,
            randomLocation.anime,
            character.personality
          );
          setEmotion('excited');
        } else {
          response = "Wow! You've visited all locations! 🎉";
          setEmotion('celebrating');
        }
      } else {
        response = await getCharacterResponse(
          chatMessages.map(msg => ({ role: msg.role, content: msg.content })).concat([
            { role: 'user', content: userMessage }
          ]),
          character,
          user,
          { level, visitedCount: visitedLocations.length }
        );
        setEmotion('happy');
      }

      setCurrentMessage(response);
      addChatMessage({ role: 'assistant', content: response });
      
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Oops!',
        description: 'Try again?',
        status: 'error',
        duration: 3000,
      });
      setEmotion('sad');
    } finally {
      setIsLoading(false);
    }
  };

  if (!character || !user) {
    navigate('/');
    return null;
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Box bg="white" borderBottomWidth="1px" py={3} px={4}>
        <HStack>
          <IconButton
            icon={<MdArrowBack />}
            variant="ghost"
            onClick={() => navigate('/home')}
          />
          <Text fontWeight="bold" fontSize="lg">
            Chat with {character.name}
          </Text>
        </HStack>
      </Box>

      <Container maxW="container.sm" py={4}>
        <VStack spacing={4} align="stretch" pb="100px">
          <Box bg="white" borderRadius="2xl" p={4} boxShadow="sm">
            <Character
              name={character.name}
              emotion={emotion}
              message={currentMessage}
            />
          </Box>

          {chatMessages.slice(2).map((message, index) => (
            <Box
              key={index}
              alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}
              maxW="75%"
            >
              <Box
                bg={message.role === 'user' ? 'brand.500' : 'white'}
                color={message.role === 'user' ? 'white' : 'gray.800'}
                px={4}
                py={3}
                borderRadius="2xl"
                boxShadow="sm"
              >
                <Text>{message.content}</Text>
              </Box>
            </Box>
          ))}

          {isLoading && (
            <Box alignSelf="flex-start">
              <HStack spacing={2} bg="white" px={4} py={3} borderRadius="2xl">
                <Spinner size="sm" color="brand.500" />
                <Text color="gray.500" fontSize="sm">
                  {character.name} is typing...
                </Text>
              </HStack>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </VStack>
      </Container>

      <Box
        position="fixed"
        bottom="0"
        left="0"
        right="0"
        bg="white"
        borderTopWidth="1px"
        p={4}
      >
        <Container maxW="container.sm">
          <HStack spacing={2}>
            <Input
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              size="lg"
            />
            <IconButton
              icon={<MdSend />}
              colorScheme="brand"
              onClick={handleSend}
              isDisabled={!input.trim()}
              size="lg"
            />
          </HStack>
        </Container>
      </Box>
    </Box>
  );
}