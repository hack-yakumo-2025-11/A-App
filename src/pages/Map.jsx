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
  Container,
} from '@chakra-ui/react';
import { MdArrowBack, MdAddLocation, MdFilterList } from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';
import { LocationMap } from '../components/LocationMap';
import { LocationList } from '../components/LocationList';
import { useStore } from '../store/useStore';
import AddLocationModal from '../components/AddLocationModal';
import { SearchInput } from '../components/SearchInput';
import { CATEGORIES } from '../utils/constants';

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
  const justLeveledUp = useStore((state) => state.justLeveledUp);
  const setJustLeveledUp = useStore((state) => state.setJustLeveledUp);
  const missionsJustCompleted = useStore((state) => state.missionsJustCompleted);
  const clearMissionsJustCompleted = useStore((state) => state.clearMissionsJustCompleted);

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

    // console.log('Missions just completed:', location.state?.missionsJustCompleted);

    missionsJustCompleted.forEach(missionId => {
      const mission = useStore.getState().dailyMissions.find(m => m.id === missionId);
      console.log('Completed mission:', mission);
      if (mission) {
        toast({
          title: '🎯 Mission Completed!',
          description: `You completed the mission: "${mission.description}" and earned +${mission.xpReward} XP!`,
          status: 'success',
          duration: 3000,
        });
      }
    });
    if (missionsJustCompleted.length > 0)  clearMissionsJustCompleted();

    if (justLeveledUp) {
      const newLevel = useStore.getState().user.level;
      toast({
        title: '🚀 Level Up!',
        description: `Congratulations! You've reached Level ${newLevel}!`,
        status: 'success',
        duration: 4000,
      });
      setJustLeveledUp(false);
    }

  }, [location.state, missionsJustCompleted]);

  const handleMapClick = (coordinates) => {
    setSelectedCoordinates(coordinates);
    onOpen();
  };

  const filteredLocations = getFilteredLocations();
  const currentSearchQuery = useStore((state) => state.currentSearchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const selectedCategory = useStore((state) => state.currentSelectedCategory);
  const setSelectedCategory = useStore((state) => state.setSelectedCategory);

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
        {/* Filter */}
            
      <Box>
        <SearchInput
          value={currentSearchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        ></SearchInput>
      </Box>
        <Box bg="white" borderBottom="1px" borderColor="gray.200" px={4} py={3}>
          <Container maxW="container.xl">
            <HStack spacing={2} overflowX="auto">
              {CATEGORIES.map(cat => (
                <Button
                  key={cat.id}
                  leftIcon={<Text>{cat.icon}</Text>}
                  size="sm"
                  colorScheme={selectedCategory ==  cat.id  ? cat.color : 'gray'}
                  variant={selectedCategory ==  cat.id  ? 'solid' : 'outline'}
                  onClick={() => setSelectedCategory(cat.id)}
                  whiteSpace="nowrap"
                >
                  {cat.name}
                </Button>
              ))}
            </HStack>
          </Container>
        </Box>
        {/* Tabs */}
        <Tabs index={tabIndex} onChange={setTabIndex} colorScheme="pink" mt={2}>
          <TabList>
            <Tab>Map View</Tab>
            <Tab>List View</Tab>
          </TabList>
        </Tabs>
      </Box>

      {/* Content */}
      <Box flex="1" overflow="auto">
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