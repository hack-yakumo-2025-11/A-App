import { useEffect, useRef, useState } from 'react';
import { Map, Marker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import {
  Box,
  Button,
  Image,
  Text,
  VStack,
  HStack,
  Badge,
  Spinner,
  Center,
  Container,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  useDisclosure,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { SearchInput } from './SearchInput';

export function LocationMap() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const map = useMap();
  
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [mapZoom, setMapZoom] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory]= useState('all');

  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [newLocationCoords, setNewLocationCoords] = useState(null);
  const searchProcessedRef = useRef(false);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const visitedLocations = useStore((state) => state.visitedLocations);
  const visitLocation = useStore((state) => state.visitLocation);
  const addUserLocation = useStore((state) => state.addUserLocation);
  const currentAnimeFilter = useStore((state) => state.currentAnimeFilter);
  const getFilteredLocations = useStore((state) => state.getFilteredLocations);
  const clearAnimeFilter = useStore((state) => state.clearAnimeFilter);
  
  const filteredLocations = getFilteredLocations();

  // Debug logging for filtered locations
  useEffect(() => {
    console.log('=== FILTER DEBUG ===');
    console.log('Current anime filter:', currentAnimeFilter);
    console.log('Filtered locations count:', filteredLocations.length);
    console.log('All filtered locations:', filteredLocations.map(loc => ({ name: loc.name, anime: loc.anime })));
  }, [currentAnimeFilter, filteredLocations]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    anime: '',
    description: '',
    comment: '',
    image: '',
  });

  const CATEGORIES = [
  { id: 'all', name: 'All', icon: '🗺️', color: 'gray' },
  { id: 'anime', name: 'Animes', icon: '🎌', color: 'red' },
  { id: 'manga', name: 'Manga', icon: '📚', color: 'blue' },
  { id: 'movies', name: 'Movies', icon: '🎬', color: 'green' },
  { id: 'gaming', name: 'Gaming', icon: '🎮', color: 'purple' },
];

  // Get user's current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserPosition(pos);
        setMapCenter(pos);
      },
      (error) => {
        console.log('Location access denied, using Tokyo default');
        const defaultPos = { lat: 35.6762, lng: 139.6503 };
        setUserPosition(defaultPos);
        setMapCenter(defaultPos);
      }
    );
  }, []);

  // Handle search/filter from chat
  useEffect(() => {
    const searchLocation = location.state?.searchLocation;
    const filterAnime = location.state?.filterAnime;

    if (filterAnime && map && !searchProcessedRef.current) {
      searchProcessedRef.current = true;
      
      // Show all locations for this anime
      const animeLocations = filteredLocations;
      
      if (animeLocations.length > 0) {
        // Fit bounds to show all locations
        const bounds = new window.google.maps.LatLngBounds();
        animeLocations.forEach(loc => {
          bounds.extend({ lat: loc.lat, lng: loc.lng });
        });
        
        // Add padding to the bounds
        map.fitBounds(bounds, { padding: 50 });
        
        // Set a slight delay to ensure map has adjusted
        setTimeout(() => {
          // Optionally select the first location
          if (animeLocations.length > 0) {
            setSelectedLocation(animeLocations[0]);
          }
        }, 1000);
        
        toast({
          title: `🎌 Showing ${animeLocations.length} locations`,
          description: `Displaying all ${currentAnimeFilter} locations`,
          status: 'success',
          duration: 4000,
        });
      } else {
        toast({
          title: 'No locations found',
          description: `No locations found for ${currentAnimeFilter}`,
          status: 'info',
          duration: 3000,
        });
      }
      
      setTimeout(() => {
        searchProcessedRef.current = false;
      }, 3000);
    } else if (searchLocation && map && !searchProcessedRef.current) {
      searchProcessedRef.current = true;
      searchAndNavigate(searchLocation);
      
      setTimeout(() => {
        searchProcessedRef.current = false;
      }, 3000);
    }
  }, [location.state, map, filteredLocations, currentAnimeFilter]);

  const searchAndNavigate = async (locationName) => {
    const foundLocation = filteredLocations.find(loc => 
      loc.name.toLowerCase().includes(locationName.toLowerCase()) ||
      loc.anime.toLowerCase().includes(locationName.toLowerCase())
    );
    
    if (foundLocation) {
      animateToLocation({
        lat: foundLocation.lat,
        lng: foundLocation.lng
      }, foundLocation);
      return;
    }

    // Fallback to Google Geocoding
    try {
      const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationName + ' Japan')}&key=${GOOGLE_MAPS_API_KEY}`;
      
      const response = await fetch(geocodeUrl);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const place = data.results[0];
        animateToLocation(place.geometry.location);
      }
    } catch (error) {
      console.error('Location search error:', error);
    }
  };

  const animateToLocation = (coords, locationData = null) => {
    if (map) {
      map.panTo(coords);
      setMapCenter(coords);
      
      setTimeout(() => {
        map.setZoom(16);
        setMapZoom(16);
      }, 500);

      if (locationData) {
        setTimeout(() => {
          setSelectedLocation(locationData);
        }, 1000);
      }
    }
  };

  const handleMapClick = (event) => {
    console.log('=== MAP CLICK DEBUG ===');
    console.log('Event:', event);
    console.log('Event detail:', event.detail);
    console.log('Is adding location mode:', isAddingLocation);
    
    if (isAddingLocation) {
      if (event.detail && event.detail.latLng) {
        const coords = {
          lat: event.detail.latLng.lat,
          lng: event.detail.latLng.lng
        };
        console.log('✅ Setting new location coords:', coords);
        setNewLocationCoords(coords);
        onOpen();
      } else {
        console.log('❌ No latLng in event.detail');
      }
    } else {
      console.log('ℹ️ Not in adding mode');
    }
  };

  const handleNavigate = (location) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
    window.open(url, '_blank');
  };

  const handleVisit = (location) => {
    if (!visitedLocations.includes(location.id)) {
      visitLocation(location.id);
      toast({
        title: '🎉 Location visited!',
        description: `+${location.xpReward} XP earned`,
        status: 'success',
        duration: 3000,
      });
    } else {
      navigate(`/checkin/${location.id}`);
    }
  };

  const handleAddLocation = () => {
    if (!formData.name || !formData.anime || !formData.description) {
      toast({
        title: '⚠️ Missing information',
        description: 'Please fill in name, anime, and description',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    const newLocation = {
      ...formData,
      lat: newLocationCoords.lat,
      lng: newLocationCoords.lng,
      image: formData.image || 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400',
    };

    addUserLocation(newLocation);
    
    toast({
      title: '✨ Location added successfully!',
      description: 'Your location has been added to the community map',
      status: 'success',
      duration: 4000,
      isClosable: true,
    });

    // Reset everything
    setFormData({
      name: '',
      anime: '',
      description: '',
      comment: '',
      image: '',
    });
    setNewLocationCoords(null);
    setIsAddingLocation(false);
    onClose();
  };

  const toggleAddMode = () => {
    const newState = !isAddingLocation;
    setIsAddingLocation(newState);
    
    if (newState) {
      // Entering add mode
      toast({
        title: '📍 Add Location Mode Activated',
        description: 'Click anywhere on the map to add a new anime location',
        status: 'info',
        duration: 4000,
        isClosable: true,
      });
    } else {
      // Exiting add mode
      setNewLocationCoords(null);
      toast({
        title: 'Add Mode Cancelled',
        description: 'You can activate it again anytime',
        status: 'info',
        duration: 2000,
      });
    }
  };

  if (!userPosition || !mapCenter) {
    return (
      <Box h="100%" display="flex" alignItems="center" justifyContent="center">
        <Text>Loading map...</Text>
      </Box>
    );
  }

  return (

    <Box h="100%" w="100%" position="relative" pointerEvents="auto">
      {/* Filter indicator */}
      {currentAnimeFilter && (
        <Box
          position="absolute"
          top="20px"
          left="50%"
          transform="translateX(-50%)"
          bg="pink.500"
          color="white"
          px={6}
          py={3}
          borderRadius="full"
          boxShadow="lg"
          zIndex="10"
          pointerEvents="auto"
        >
          <HStack spacing={3}>
            <Text fontSize="sm" fontWeight="bold">
              🎌 Showing: {currentAnimeFilter}
            </Text>
            <IconButton
              size="xs"
              icon={<CloseIcon />}
              onClick={clearAnimeFilter}
              colorScheme="whiteAlpha"
              aria-label="Clear filter"
            />
          </HStack>
        </Box>
      )}

      {/* Add Location Button */}
      <Tooltip label={isAddingLocation ? "Cancel adding location" : "Add new anime location"} placement="left">
        <IconButton
          icon={isAddingLocation ? <CloseIcon /> : <AddIcon />}
          position="absolute"
          top="20px"
          right="20px"
          zIndex="10"
          colorScheme={isAddingLocation ? "red" : "pink"}
          size="lg"
          borderRadius="full"
          boxShadow="xl"
          onClick={toggleAddMode}
          aria-label="Add location"
          pointerEvents="auto"
          _hover={{
            transform: 'scale(1.1)',
            boxShadow: '2xl',
          }}
          transition="all 0.2s"
        />
      </Tooltip>

      {isAddingLocation && (
        <Box
          position="absolute"
          top="90px"
          right="20px"
          bg="pink.500"
          color="white"
          px={5}
          py={3}
          borderRadius="lg"
          boxShadow="xl"
          zIndex="10"
          pointerEvents="none"
          animation="pulse 2s infinite"
        >
          <VStack spacing={1} align="start">
            <HStack>
              <Text fontSize="lg">📍</Text>
              <Text fontSize="sm" fontWeight="bold">
                Add Location Mode
              </Text>
            </HStack>
            <Text fontSize="xs">
              Click anywhere on the map
            </Text>
          </VStack>
        </Box>
      )}

      <Box h="100%" w="100%" position="relative" zIndex="1">
        <Map
          center={mapCenter}
          zoom={mapZoom}
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapId="nakamaGo_map"
          onClick={handleMapClick}
          onCameraChanged={(e) => {
            if (e.detail.center) {
              setMapCenter(e.detail.center);
            }
            if (e.detail.zoom) {
              setMapZoom(e.detail.zoom);
            }
          }}
        >
        {/* User position marker */}
        <Marker
          position={userPosition}
          title="You are here"
          icon={{
            path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
            scale: 12,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
          }}
        />

        {/* Location markers */}
        {filteredLocations.map((location) => {
          const isVisited = visitedLocations.includes(location.id);
          const isUserSubmitted = location.category === 'user-submitted';
          const isInFilteredAnime = currentAnimeFilter 
            ? location.anime.toLowerCase().includes(currentAnimeFilter.toLowerCase())
            : true;
          
          return (
            <Marker
              key={location.id}
              position={{ lat: location.lat, lng: location.lng }}
              onClick={() => {
                setSelectedLocation(location);
                if(location.state){ location.state.searchLocation = null; location.state.filterAnime = null;};
              }}
              title={location.name}
              icon={{
                path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                scale: isInFilteredAnime && currentAnimeFilter ? 14 : (isUserSubmitted ? 8 : 10),
                fillColor: isUserSubmitted ? '#9F7AEA' : (isVisited ? '#48BB78' : '#FF6B9D'),
                fillOpacity: 1,
                strokeColor: isInFilteredAnime && currentAnimeFilter ? '#FFD700' : '#ffffff',
                strokeWeight: isInFilteredAnime && currentAnimeFilter ? 4 : 2,
              }}
              animation={isInFilteredAnime && currentAnimeFilter ? window.google?.maps?.Animation?.BOUNCE : null}
            />
          );
        })}

        {/* Temporary marker for new location */}
        {newLocationCoords && (
          <Marker
            position={newLocationCoords}
            title="New location - Click to confirm"
            icon={{
              path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
              scale: 15,
              fillColor: '#FFA500',
              fillOpacity: 0.9,
              strokeColor: '#ffffff',
              strokeWeight: 4,
            }}
            animation={window.google?.maps?.Animation?.BOUNCE}
          />
        )}

        {/* Info window */}
        {selectedLocation && (
          <InfoWindow
            position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
            onCloseClick={() =>{ 
              setSelectedLocation(null); 
              if(location.state){ location.state.searchLocation = null; location.state.filterAnime = null;} 
            }
          }
          >
            <VStack align="start" spacing={2} p={2} maxW="280px">
              <Image
                src={selectedLocation.image}
                alt={selectedLocation.name}
                borderRadius="md"
                maxH="140px"
                w="100%"
                objectFit="cover"
              />
              
              <HStack spacing={2} w="100%" flexWrap="wrap">
                <Badge colorScheme="pink" fontSize="xs">
                  {selectedLocation.anime}
                </Badge>
                {visitedLocations.includes(selectedLocation.id) && (
                  <Badge colorScheme="green" fontSize="xs">
                    ✓ Visited
                  </Badge>
                )}
                {selectedLocation.category === 'user-submitted' && (
                  <Badge colorScheme="purple" fontSize="xs">
                    👥 Community
                  </Badge>
                )}
              </HStack>

              <Text fontWeight="bold" fontSize="md">
                {selectedLocation.name}
              </Text>

              <Text fontSize="sm" color="gray.700">
                {selectedLocation.description}
              </Text>

              {selectedLocation.comment && (
                <Box bg="purple.50" p={2} borderRadius="md" w="100%">
                  <Text fontSize="xs" fontStyle="italic">
                    "{selectedLocation.comment}"
                  </Text>
                  {selectedLocation.submittedBy && (
                    <Text fontSize="xs" color="gray.600" mt={1}>
                      - {selectedLocation.submittedBy}
                    </Text>
                  )}
                </Box>
              )}

              <HStack spacing={2} w="100%">
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="pink"
                  onClick={() => handleNavigate(selectedLocation)}
                  flex="1"
                  leftIcon={<Text>🧭</Text>}
                >
                  Navigate
                </Button>
                <Button
                  size="sm"
                  colorScheme="pink"
                  onClick={() => handleVisit(selectedLocation)}
                  flex="1"
                  isDisabled={visitedLocations.includes(selectedLocation.id)}
                >
                  {visitedLocations.includes(selectedLocation.id) ? '✓ Visited' : 'Check In'}
                </Button>
              </HStack>

              <Text fontSize="xs" color="gray.500">
                Reward: +{selectedLocation.xpReward} XP
              </Text>
            </VStack>
          </InfoWindow>
        )}
              </Map>
      </Box>

      {/* Add cursor style overlay */}
      {isAddingLocation && (
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          cursor="crosshair"
          zIndex="2"
          pointerEvents="none"
        />
      )}

      {/* Add Location Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent>
          <ModalHeader bg="pink.500" color="white" borderTopRadius="md">
            <HStack spacing={2}>
              <Text fontSize="2xl">📍</Text>
              <Text>Add New Anime Location</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody py={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel fontWeight="bold">Location Name</FormLabel>
                <Input
                  placeholder="e.g., Tokyo Tower, Shibuya Crossing"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  size="lg"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="bold">Anime Series/Movie</FormLabel>
                <Input
                  placeholder="e.g., One Piece, Naruto, Your Name"
                  value={formData.anime}
                  onChange={(e) => setFormData({ ...formData, anime: e.target.value })}
                  size="lg"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="bold">Description</FormLabel>
                <Textarea
                  placeholder="Describe what makes this location special and how it relates to the anime..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  size="lg"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="bold">Personal Comment (Optional)</FormLabel>
                <Textarea
                  placeholder="Share your experience visiting this place..."
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  rows={2}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="bold">Image URL (Optional)</FormLabel>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Leave empty to use a default image
                </Text>
              </FormControl>
              
              {newLocationCoords && (
                <Box w="100%" p={3} bg="gray.50" borderRadius="md">
                  <Text fontSize="sm" color="gray.600">
                    <strong>📌 Coordinates:</strong> {newLocationCoords.lat.toFixed(6)}, {newLocationCoords.lng.toFixed(6)}
                  </Text>
                </Box>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => {
              onClose();
              setNewLocationCoords(null);
              setIsAddingLocation(false);
              setFormData({
                name: '',
                anime: '',
                description: '',
                comment: '',
                image: '',
              });
            }}>
              Cancel
            </Button>
            <Button 
              colorScheme="pink" 
              onClick={handleAddLocation}
              size="lg"
              leftIcon={<Text>✨</Text>}
            >
              Add Location
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}