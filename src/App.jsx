import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { useStore } from './store/useStore';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Map from './pages/Map';
import Profile from './pages/Profile';
import Checkin from './pages/Checkin';

export default function App() {
  const character = useStore((state) => state.character);

  return (
    <BrowserRouter>
      <Box minH="100vh">
        <Routes>
          <Route 
            path="/" 
            element={character ? <Navigate to="/home" /> : <Onboarding />} 
          />
          <Route 
            path="/home" 
            element={character ? <Home /> : <Navigate to="/" />} 
          />
          <Route path="/chat" element={<Chat />} />
          <Route path="/map" element={<Map />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkin/:locationId" element={<Checkin />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

