import { Box, Image, Text, Badge, Button, HStack, VStack } from '@chakra-ui/react';
import { MdLocationOn, MdCheckCircle } from 'react-icons/md';
import { useStore } from 'zustand';

export function LocationCard({ location, userPosition, isVisited, visitLocation, isLoggedIn }) {

  const calculateDistance = (userPos, locPos) => {
    if (!userPos) return null;
    const R = 6371;
    const dLat = ((locPos.lat - userPos.lat) * Math.PI) / 180;
    const dLng = ((locPos.lng - userPos.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((userPos.lat * Math.PI) / 180) *
        Math.cos((locPos.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const distance = calculateDistance(userPosition, {
    lat: location.lat,
    lng: location.lng
  });

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
      bg="white"
      position="relative"
    >
      {/* Visited overlay */}
      {isVisited && (
        <Box
          position="absolute"
          top="12px"
          right="12px"
          bg="green.500"
          color="white"
          px={2}
          py={1}
          borderRadius="full"
          fontSize="sm"
          fontWeight="bold"
          zIndex="1"
          display="flex"
          alignItems="center"
          gap={1}
        >
          <MdCheckCircle />
          <Text>Visited</Text>
        </Box>
      )}

      <Image
        src={location.image}
        alt={location.name}
        h="200px"
        w="100%"
        objectFit="cover"
        filter={isVisited ? 'grayscale(50%)' : 'none'}
      />

      <Box p={4}>
        <HStack justify="space-between" mb={2}>
          <Badge colorScheme="pink" fontSize="xs">
            {location.anime}
          </Badge>
          {distance && (
            <HStack spacing={1} color="gray.600" fontSize="sm">
              <MdLocationOn />
              <Text>{distance} km</Text>
            </HStack>
          )}
        </HStack>

        <Text fontWeight="bold" fontSize="lg" mb={2}>
          {location.name}
        </Text>

        <Text fontSize="sm" color="gray.600" mb={3} noOfLines={2}>
          {location.description}
        </Text>

        <HStack spacing={2}>
          {
            isLoggedIn ? 
              <Button
                colorScheme="brand"
                size="sm"
                flex="1"
                onClick={() => { visitLocation(location.id); }} 
                isDisabled={isVisited}
              >
                {isVisited ? 'Completed' : `Visit (+ ${location.xpReward} XP)`}
              </Button>
            :
            ""
          }
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const url = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
              window.open(url, '_blank');
            }}
          >
            Navigate
          </Button>
        </HStack>
      </Box>
    </Box>
  );
}