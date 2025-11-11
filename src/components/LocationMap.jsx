import { useState, useEffect } from 'react';
import { Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import { Box, Button, Image, Text, VStack, HStack, Badge } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export function LocationMap() {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const locations = useStore((state) => state.locations);
  const visitedLocations = useStore((state) => state.visitedLocations);

  // Get user's current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.log('Location access denied, using Tokyo default');
        // Default to Tokyo center
        setUserPosition({ lat: 35.6762, lng: 139.6503 });
      }
    );
  }, []);

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

  if (!userPosition) {
    return (
      <Box h="100vh" display="flex" alignItems="center" justifyContent="center">
        <Text>Loading map...</Text>
      </Box>
    );
  }

  return (
    <Box h="100vh" w="100%">
      <Map
        defaultCenter={userPosition}
        defaultZoom={12}
        gestureHandling="greedy"
        disableDefaultUI={false}
        mapId="nakamaGo_map"
      >
        {/* User position marker */}
        <Marker
          position={userPosition}
          title="You are here"
        />

        {/* Location markers */}
        {locations.map((location) => {
          const isVisited = visitedLocations.includes(location.id);
          
          return (
            <Marker
              key={location.id}
              position={{ lat: location.lat, lng: location.lng }}
              onClick={() => setSelectedLocation(location)}
              title={location.name}
              // Different color for visited locations
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: isVisited ? '#48BB78' : '#FF6B9D',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
              }}
            />
          );
        })}

        {/* Info window for selected location */}
        {selectedLocation && (
          <InfoWindow
            position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
            onCloseClick={() => setSelectedLocation(null)}
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
              
              <HStack spacing={2} w="100%">
                <Badge colorScheme="pink">{selectedLocation.anime}</Badge>
                {visitedLocations.includes(selectedLocation.id) && (
                  <Badge colorScheme="green">Visited ✓</Badge>
                )}
              </HStack>

              <Text fontWeight="bold" fontSize="md">
                {selectedLocation.name}
              </Text>

              <Text fontSize="sm" color="gray.600" noOfLines={2}>
                {selectedLocation.description}
              </Text>

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

              <HStack spacing={2} w="100%">
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="brand"
                  onClick={() => handleNavigate(selectedLocation)}
                  flex="1"
                >
                  Navigate
                </Button>
                <Button
                  size="sm"
                  colorScheme="brand"
                  onClick={() => handleVisit(selectedLocation)}
                  flex="1"
                  isDisabled={visitedLocations.includes(selectedLocation.id)}
                >
                  {visitedLocations.includes(selectedLocation.id) ? 'Visited' : 'Check In'}
                </Button>
              </HStack>

              <Text fontSize="xs" color="gray.500">
                +{selectedLocation.xpReward} XP
              </Text>
            </VStack>
          </InfoWindow>
        )}
      </Map>
    </Box>
  );
}