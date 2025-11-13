import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Select,
  SimpleGrid,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
} from '@chakra-ui/react';
import { MdSearch } from 'react-icons/md';
import { useStore } from '../store/useStore';
import { LocationCard } from './LocationCard';
import { SearchInput } from './SearchInput';

export function LocationList() {
  const locations = useStore((state) => state.locations);
  const visitedLocations = useStore((state) => state.visitedLocations);
  const [userPosition, setUserPosition] = useState(null);
  const [filter, setFilter] = useState('all');
  const visitLocation = useStore((state) => state.visitLocation);
  const toast = useToast();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      () => {
        setUserPosition({ lat: 35.6762, lng: 139.6503 });
      }
    );
  }, []);


  // Get unique anime names for stats
  const getFilteredLocations = useStore((state) => state.getFilteredLocations);
  const stateFilteredLocations = getFilteredLocations();

  // Filter locations
  const filteredLocations = stateFilteredLocations
    .filter((loc) => {
      if (filter === 'visited') return visitedLocations.includes(loc.id);
      if (filter === 'unvisited') return !visitedLocations.includes(loc.id);
      return true;
    });
   
  const uniqueAnime = [...new Set(stateFilteredLocations.map((loc) => loc.anime))];
  const visitedCount = visitedLocations.length;

  function handleVisitLocation(locationId) {
    visitLocation(locationId);
    const location = useStore.getState().locations.find(loc => loc.id === locationId);
    toast({
        title: '🎉 Location visited!',
        description: `+${location.xpReward} XP earned`,
        status: 'success',
        duration: 3000,
      });
  }

  return (
    <Container maxW="container.md" py={4} overflow={'auto'}>
      <VStack spacing={6} align="stretch">
        {/* Stats */}
        <HStack spacing={4} justify="center">
          <Badge colorScheme="brand" fontSize="md" px={3} py={1}>
            {visitedCount}/{locations.length} Visited
          </Badge>
          <Badge colorScheme="purple" fontSize="md" px={3} py={1}>
            {uniqueAnime.length} Properties 
          </Badge>
        </HStack>

        {/* Filter */}
        <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Locations</option>
          <option value="unvisited">Not Visited</option>
          <option value="visited">Visited</option>
        </Select>

        {/* Location Grid */}
        {filteredLocations.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Text color="gray.500">No locations found</Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {filteredLocations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                userPosition={userPosition}
                isVisited={visitedLocations.includes(location.id)}
                visitLocation={handleVisitLocation}
              />
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Container>
  );
}