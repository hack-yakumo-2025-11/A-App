import { useState, useEffect, useRef } from 'react';
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
  Center
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export function LocationMap({ searchLocation, isSearching }) {
  const navigate = useNavigate();
  const map = useMap();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [mapZoom, setMapZoom] = useState(12);
  const searchProcessedRef = useRef(false);
  
  const locations = useStore((state) => state.locations);
  const visitedLocations = useStore((state) => state.visitedLocations);

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
        // Default to Tokyo center
        const defaultPos = { lat: 35.6762, lng: 139.6503 };
        setUserPosition(defaultPos);
        setMapCenter(defaultPos);
      }
    );
  }, []);

  // Handle search from AI chatbot
  useEffect(() => {
    if (searchLocation && map && !searchProcessedRef.current) {
      searchProcessedRef.current = true;
      searchAndNavigate(searchLocation);
      
      // Reset flag after search is complete
      setTimeout(() => {
        searchProcessedRef.current = false;
      }, 3000);
    }
  }, [searchLocation, map]);

  // Search and navigate to location
  const searchAndNavigate = async (locationName) => {
    // First, search in our existing locations
    const foundLocation = findLocationByName(locationName);
    
    if (foundLocation) {
      // Animate to our location
      animateToLocation({
        lat: foundLocation.lat,
        lng: foundLocation.lng
      }, foundLocation);
      return;
    }

    // If not found, search via Google Geocoding API
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

  // Find location by name (fuzzy matching)
  const findLocationByName = (searchTerm) => {
    const lowerSearch = searchTerm.toLowerCase();
    
    // Try exact match first
    let found = locations.find(loc => 
      loc.name.toLowerCase().includes(lowerSearch) ||
      loc.anime.toLowerCase().includes(lowerSearch)
    );

    // Try partial match with keywords
    if (!found) {
      found = locations.find(loc => {
        const keywords = lowerSearch.split(' ');
        return keywords.some(keyword => 
          keyword.length > 2 && (
            loc.name.toLowerCase().includes(keyword) ||
            loc.anime.toLowerCase().includes(keyword) ||
            loc.description.toLowerCase().includes(keyword)
          )
        );
      });
    }

    return found;
  };

  // Animate map to location
  const animateToLocation = (coords, locationData = null) => {
    if (map) {
      // Smooth pan to location
      map.panTo(coords);
      setMapCenter(coords);
      
      // Zoom in after a short delay
      setTimeout(() => {
        map.setZoom(16);
        setMapZoom(16);
      }, 500);

      // If we have location data, select it to show info window
      if (locationData) {
        setTimeout(() => {
          setSelectedLocation(locationData);
        }, 1000);
      }
    }
  };

  // Calculate distance between two points (in km)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const handleNavigate = (location) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
    window.open(url, '_blank');
  };

  const handleVisit = (location) => {
    navigate(`/checkin/${location.id}`);
  };

  if (!userPosition || !mapCenter) {
    return (
      <Box h="100%" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={3}>
          <Spinner size="xl" color="pink.400" thickness="4px" />
          <Text color="gray.600">Loading map...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box h="100%" w="100%" position="relative">
      {/* Loading indicator when searching */}
      {isSearching && (
        <Center
          position="absolute"
          top="20px"
          left="50%"
          transform="translateX(-50%)"
          bg="white"
          px={6}
          py={3}
          borderRadius="full"
          boxShadow="lg"
          zIndex={1000}
        >
          <HStack spacing={3}>
            <Spinner size="sm" color="pink.400" />
            <Text fontSize="sm" fontWeight="medium" color="gray.700">
              Searching for location...
            </Text>
          </HStack>
        </Center>
      )}

      <Map
        center={mapCenter}
        zoom={mapZoom}
        gestureHandling="greedy"
        disableDefaultUI={false}
        mapId="nakamaGo_map"
        onCenterChanged={(e) => setMapCenter(e.detail.center)}
        onZoomChanged={(e) => setMapZoom(e.detail.zoom)}
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
        {locations.map((location) => {
          const isVisited = visitedLocations.includes(location.id);
          const isSelected = selectedLocation?.id === location.id;
          
          return (
            <Marker
              key={location.id}
              position={{ lat: location.lat, lng: location.lng }}
              onClick={() => setSelectedLocation(location)}
              title={location.name}
              icon={{
                path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                scale: isSelected ? 14 : 10,
                fillColor: isVisited ? '#48BB78' : '#FF6B9D',
                fillOpacity: 1,
                strokeColor: isSelected ? '#ffffff' : '#ffffff',
                strokeWeight: isSelected ? 3 : 2,
              }}
            />
          );
        })}

        {/* Info window for selected location */}
        {selectedLocation && (
          <InfoWindow
            position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
            onCloseClick={() => setSelectedLocation(null)}
            headerContent={
              <Text fontWeight="bold" fontSize="md" p={2}>
                {selectedLocation.name}
              </Text>
            }
          >
            <VStack align="start" spacing={3} p={2} maxW="280px">
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
                <Badge colorScheme="purple" fontSize="xs">
                  {selectedLocation.difficulty}
                </Badge>
              </HStack>

              <Text fontSize="sm" color="gray.700" lineHeight="1.5">
                {selectedLocation.description}
              </Text>

              {userPosition && (
                <HStack spacing={1} color="pink.500" fontSize="sm">
                  <Text>📍</Text>
                  <Text fontWeight="medium">
                    {calculateDistance(
                      userPosition.lat,
                      userPosition.lng,
                      selectedLocation.lat,
                      selectedLocation.lng
                    )}{' '}
                    km away
                  </Text>
                </HStack>
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

              <HStack justify="space-between" w="100%">
                <Text fontSize="xs" color="gray.500">
                  Reward: <strong>+{selectedLocation.xpReward} XP</strong>
                </Text>
              </HStack>
            </VStack>
          </InfoWindow>
        )}
      </Map>
    </Box>
  );
}