import { useState, useEffect } from 'react';
import { 
  Box, 
  IconButton, 
  HStack, 
  Text, 
  Tabs, 
  TabList, 
  Tab,
  useToast,
  Badge,
  VStack
} from '@chakra-ui/react';
import { MdArrowBack, MdLocationOn } from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';
import { LocationMap } from '../components/LocationMap';
import { LocationList } from '../components/LocationList';
import { useStore } from '../store/useStore';

export default function Map() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  
  const [tabIndex, setTabIndex] = useState(0);
  const [searchLocation, setSearchLocation] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  
  const locations = useStore((state) => state.locations);

  // Handle navigation from AI chatbot
  useEffect(() => {
    if (location.state?.searchLocation) {
      const locationName = location.state.searchLocation;
      setSearchLocation(locationName);
      setIsSearching(true);
      
      // Show toast notification
      toast({
        title: '🗺️ Navigating to location',
        description: `Searching for: ${locationName}`,
        status: 'info',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });

      // Search in our existing locations first
      const foundLocation = findLocationByName(locationName);
      
      if (foundLocation) {
        // Found in our database
        toast({
          title: '📍 Location found!',
          description: `${foundLocation.name} from ${foundLocation.anime}`,
          status: 'success',
          duration: 4000,
          isClosable: true,
          position: 'top',
        });
        setTabIndex(0); // Switch to map view
      } else {
        // Will search via Google Maps API
        setTabIndex(0); // Switch to map view
      }

      // Clear the search after a short delay
      setTimeout(() => {
        setIsSearching(false);
      }, 2000);

      // Clear location state to prevent re-triggering
      window.history.replaceState({}, document.title);
    }
  }, [location.state?.searchLocation]);

  // Helper function to find location by name (fuzzy matching)
  const findLocationByName = (searchTerm) => {
    const lowerSearch = searchTerm.toLowerCase();
    
    // Try exact match first
    let found = locations.find(loc => 
      loc.name.toLowerCase().includes(lowerSearch) ||
      loc.anime.toLowerCase().includes(lowerSearch)
    );

    // Try partial match
    if (!found) {
      found = locations.find(loc => {
        const keywords = lowerSearch.split(' ');
        return keywords.some(keyword => 
          loc.name.toLowerCase().includes(keyword) ||
          loc.anime.toLowerCase().includes(keyword) ||
          loc.description.toLowerCase().includes(keyword)
        );
      });
    }

    return found;
  };

  return (
    <Box h="100vh" display="flex" flexDirection="column">
      {/* Header */}
      <Box bg="white" borderBottomWidth="1px" py={3} px={4} boxShadow="sm">
        <HStack justify="space-between">
          <HStack>
            <IconButton
              icon={<MdArrowBack />}
              variant="ghost"
              onClick={() => navigate('/home')}
              aria-label="Go back"
            />
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold" fontSize="lg">
                Explore Locations 🗺️
              </Text>
              {searchLocation && isSearching && (
                <HStack spacing={2} mt={1}>
                  <MdLocationOn color="#FF69B4" />
                  <Text fontSize="sm" color="gray.600">
                    Searching: <strong>{searchLocation}</strong>
                  </Text>
                </HStack>
              )}
            </VStack>
          </HStack>

          {/* Location count badge */}
          <Badge colorScheme="pink" fontSize="sm">
            {locations.length} locations
          </Badge>
        </HStack>

        {/* Tabs */}
        <Tabs index={tabIndex} onChange={setTabIndex} colorScheme="pink" mt={2}>
          <TabList>
            <Tab>Map View</Tab>
            <Tab>List View</Tab>
          </TabList>
        </Tabs>
      </Box>

      {/* Content */}
      <Box flex="1" overflow="hidden">
        {tabIndex === 0 ? (
          <LocationMap 
            searchLocation={searchLocation} 
            isSearching={isSearching}
          />
        ) : (
          <LocationList 
            highlightLocation={searchLocation}
          />
        )}
      </Box>
    </Box>
  );
}