import { useState } from 'react';
import { Box, IconButton, HStack, Text, Tabs, TabList, Tab } from '@chakra-ui/react';
import { MdArrowBack } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { LocationMap } from '../components/LocationMap';
import { LocationList } from '../components/LocationList';

export default function Map() {
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box h="100vh" display="flex" flexDirection="column">
      {/* Header */}
      <Box bg="white" borderBottomWidth="1px" py={3} px={4} boxShadow="sm">
        <HStack>
          <IconButton
            icon={<MdArrowBack />}
            variant="ghost"
            onClick={() => navigate('/home')}
          />
          <Text fontWeight="bold" fontSize="lg">
            Explore Locations 🗺️
          </Text>
        </HStack>

        {/* Tabs */}
        <Tabs index={tabIndex} onChange={setTabIndex} colorScheme="brand" mt={2}>
          <TabList>
            <Tab>Map View</Tab>
            <Tab>List View</Tab>
          </TabList>
        </Tabs>
      </Box>

      {/* Content */}
      <Box flex="1" overflow="hidden">
        {tabIndex === 0 ? <LocationMap /> : <LocationList />}
      </Box>
    </Box>
  );
}