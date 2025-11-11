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
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter locations
  const filteredLocations = locations
    .filter((loc) => {
      if (filter === 'visited') return visitedLocations.includes(loc.id);
      if (filter === 'unvisited') return !visitedLocations.includes(loc.id);
      return true;
    })
    .filter((loc) => {
      if (!searchQuery) return true;
      return (
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.anime.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  // Get unique anime names for stats
  const uniqueAnime = [...new Set(locations.map((loc) => loc.anime))];
  const visitedCount = visitedLocations.length;

  return (
    <Container maxW="container.md" py={4}>
      <VStack spacing={6} align="stretch">
        {/* Stats */}
        <HStack spacing={4} justify="center">
          <Badge colorScheme="brand" fontSize="md" px={3} py={1}>
            {visitedCount}/{locations.length} Visited
          </Badge>
          <Badge colorScheme="purple" fontSize="md" px={3} py={1}>
            {uniqueAnime.length} Anime
          </Badge>
        </HStack>

        {/* Search */}
        <SearchInput 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} 
        ></SearchInput>
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
              />
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Container>
  );
}