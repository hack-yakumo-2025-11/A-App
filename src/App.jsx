import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { useStore } from './store/useStore';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Chat from './pages/chat';
import Map from './pages/Map';
import Profile from './pages/Profile';
import FloatingChat from './components/FloatingChat';
import CharacterSelection from './pages/CharacterSelection';

export default function App() {
  const character = useStore((state) => state.user.name);

  console.log('App - Character:', character); // Debug log

  return (
    <BrowserRouter>
      <Box minH="99vh" position="relative" bg="gray.50">
        <Routes>
          <Route 
            path="/" 
            element={character ? <Navigate to="/home" /> : <Onboarding />} 
          />
          <Route 
            path="/character-selection" 
            element={character ? <CharacterSelection /> : <Navigate to="/" />} 
          />
          <Route 
            path="/home" 
            element={character ? <Home /> : <Navigate to="/" />} 
          />
          <Route 
            path="/chat" 
            element={character ? <Chat /> : <Navigate to="/" />} 
          />
          <Route 
            path="/map" 
            element={character ? <Map /> : <Navigate to="/" />} 
          />
          <Route 
            path="/profile" 
            element={character ? <Profile /> : <Navigate to="/" />} 
          />
        </Routes>

        {/* Floating AI Chat - MUST BE OUTSIDE Routes */}
        {character && (
          <Box>
            <FloatingChat />
          </Box>
        )}
      </Box>
    </BrowserRouter>
  );
}