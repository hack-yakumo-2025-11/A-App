import { useState, useEffect } from 'react';
import { 
  Box, 
  IconButton, 
  HStack, 
  Text, 
  Tabs, 
  TabList, 
  Tab,
  Button,
  Badge,
  useDisclosure,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { MdArrowBack, MdAddLocation, MdFilterList } from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';
import { LocationMap } from '../components/LocationMap';
import { LocationList } from '../components/LocationList';
import { useStore } from '../store/useStore';
import AddLocationModal from '../components/AddLocationModal';

export default function Map() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  
  const [tabIndex, setTabIndex] = useState(0);
  const [searchLocation, setSearchLocation] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const getFilteredLocations = useStore((state) => state.getFilteredLocations);
  const filteredAnime = useStore((state) => state.filteredAnime);
  const clearAnimeFilter = useStore((state) => state.clearAnimeFilter);
  const setAnimeFilter = useStore((state) => state.setAnimeFilter);

  // Handle navigation from AI chatbot
  useEffect(() => {
    if (location.state?.searchLocation) {
      const locationName = location.state.searchLocation;
      setSearchLocation(locationName);
      setIsSearching(true);
      
      toast({
        title: '🗺️ Navigating to location',
        description: `Searching for: ${locationName}`,
        status: 'info',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });

      setTimeout(() => {
        setIsSearching(false);
      }, 2000);

      window.history.replaceState({}, document.title);
    }
    
    // Handle anime filter from AI chatbot
    if (location.state?.animeFilter) {
      const animeName = location.state.animeFilter;
      setAnimeFilter(animeName);
      
      toast({
        title: '🔍 Filtering locations',
        description: `Showing ${animeName} locations`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleMapClick = (coordinates) => {
    setSelectedCoordinates(coordinates);
    onOpen();
  };

  const filteredLocations = getFilteredLocations();

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
              {filteredAnime && (
                <HStack spacing={2}>
                  <Badge colorScheme="purple" fontSize="xs">
                    Filtered: {filteredAnime}
                  </Badge>
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={clearAnimeFilter}
                  >
                    Clear
                  </Button>
                </HStack>
              )}
            </VStack>
          </HStack>

          <HStack>
            {/* Location count */}
            <Badge colorScheme="pink" fontSize="sm" px={2} py={1}>
              {filteredLocations.length} locations
            </Badge>
            
            {/* Add Location Button */}
            <IconButton
              icon={<MdAddLocation />}
              colorScheme="pink"
              variant="outline"
              onClick={() => {
                // Open modal without coordinates for now
                toast({
                  title: 'Tap on the map',
                  description: 'Tap on the map where you want to add a location',
                  status: 'info',
                  duration: 3000,
                });
              }}
              aria-label="Add location"
            />
          </HStack>
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
            onMapClick={handleMapClick}
            filteredLocations={filteredLocations}
          />
        ) : (
          <LocationList 
            highlightLocation={searchLocation}
            filteredLocations={filteredLocations}
          />
        )}
      </Box>

      {/* Add Location Modal */}
      {selectedCoordinates && (
        <AddLocationModal
          isOpen={isOpen}
          onClose={onClose}
          coordinates={selectedCoordinates}
        />
      )}
    </Box>
  );
}