import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Text,
  Animated
} from 'react-native';
import { sendMessageToCharacter } from '../../services/openaiService';
import { useCharacter } from '../../context/CharacterContext';
import CharacterDisplay from './CharacterDisplay';
import ChatBubble from './ChatBubble';

const ChatInterface = ({ navigation, userLocation }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const flatListRef = useRef(null);
  const animatedHeight = useRef(new Animated.Value(500)).current;

  const {
    selectedCharacter,
    conversationHistory,
    addToHistory
  } = useCharacter();

  useEffect(() => {
    // Initial greeting
    const characterInfo = getCharacterInfo(selectedCharacter);
    setMessages([{
      id: '0',
      text: `Konnichiwa! I'm ${characterInfo.name}, your anime pilgrimage guide! Where would you like to explore today? 🗾✨`,
      isUser: false,
      timestamp: new Date()
    }]);
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Add to conversation history
    addToHistory('user', inputText);

    try {
      const response = await sendMessageToCharacter(
        inputText,
        selectedCharacter,
        conversationHistory,
        userLocation
      );

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      addToHistory('assistant', response.response);

      // If navigation is requested
      if (response.navigationLocation) {
        // Navigate to map with the location
        setTimeout(() => {
          navigation.navigate('Map', { 
            searchLocation: response.navigationLocation 
          });
        }, 1000);
      }

    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "Gomen! I'm having trouble connecting right now. Please try again! 🙏",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMinimize = () => {
    const toValue = isMinimized ? 500 : 80;
    Animated.spring(animatedHeight, {
      toValue,
      useNativeDriver: false
    }).start();
    setIsMinimized(!isMinimized);
  };

  return (
    <Animated.View style={[styles.container, { height: animatedHeight }]}>
      {/* Character Display Header */}
      <TouchableOpacity 
        style={styles.header}
        onPress={toggleMinimize}
      >
        <CharacterDisplay 
          characterId={selectedCharacter}
          size="small"
        />
        <Text style={styles.headerText}>
          {isMinimized ? 'Tap to chat' : 'Chat with your guide'}
        </Text>
      </TouchableOpacity>

      {!isMinimized && (
        <>
          {/* Messages List */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ChatBubble 
                message={item.text}
                isUser={item.isUser}
                timestamp={item.timestamp}
              />
            )}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          />

          {/* Loading Indicator */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#FF69B4" />
              <Text style={styles.loadingText}>Typing...</Text>
            </View>
          )}

          {/* Input Area */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={100}
          >
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask about anime locations..."
                placeholderTextColor="#999"
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                onPress={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  messagesList: {
    padding: 15,
    flexGrow: 1,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingLeft: 15,
  },
  loadingText: {
    marginLeft: 8,
    color: '#999',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#FF69B4',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#FFB6D9',
  },
  sendButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ChatInterface;