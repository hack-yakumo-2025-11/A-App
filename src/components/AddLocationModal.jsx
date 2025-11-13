import { useState, useRef, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  VStack,
  HStack,
  Image,
  Box,
  Text,
  useToast,
} from '@chakra-ui/react';
import { FiUpload, FiX } from 'react-icons/fi';
import { useStore } from '../store/useStore';

export default function AddLocationModal({ isOpen, onClose, coordinates, onSuccess }) {
  const toast = useToast();
  const addUserLocation = useStore((state) => state.addUserLocation);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    comment: '',
    image: null,
    imagePreview: null,
  });

  // Debug log to check if coordinates are received
  useEffect(() => {
    console.log('=== MODAL COORDINATES DEBUG ===');
    console.log('Coordinates received:', coordinates);
    console.log('Modal isOpen:', isOpen);
  }, [coordinates, isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Image too large',
          description: 'Please select an image smaller than 5MB',
          status: 'error',
          duration: 3000,
        });
        return;
      }

      // Check if it's an image
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file',
          status: 'error',
          duration: 3000,
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    // Validate coordinates
    if (!coordinates || !coordinates.lat || !coordinates.lng) {
      toast({
        title: '⚠️ Missing coordinates',
        description: 'Please click on the map to set a location',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    // Validate form data
    if (!formData.name || !formData.category || !formData.description) {
      toast({
        title: '⚠️ Missing information',
        description: 'Please fill in name, category, and description',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    const newLocation = {
      name: formData.name,
      anime: formData.category, // Keep as 'anime' for compatibility with existing code
      category: formData.category,
      description: formData.description,
      comment: formData.comment,
      lat: coordinates.lat,
      lng: coordinates.lng,
      image: formData.imagePreview || 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    };

    console.log('Adding new location:', newLocation);
    addUserLocation(newLocation);

    toast({
      title: '✨ Location added successfully!',
      description: 'Thank you for contributing to the community!',
      status: 'success',
      duration: 4000,
      isClosable: true,
    });

    // Reset form
    setFormData({
      name: '',
      category: '',
      description: '',
      comment: '',
      image: null,
      imagePreview: null,
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Call success callback
    if (onSuccess) {
      onSuccess();
    }
    
    onClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      comment: '',
      image: null,
      imagePreview: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent maxH="90vh" overflowY="auto">
        <ModalHeader bg="pink.500" color="white" borderTopRadius="md">
          <HStack spacing={2}>
            <Text fontSize="2xl">📍</Text>
            <Text>Add New Anime Location</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody pb={6} pt={6}>
          <VStack spacing={4}>
            {/* Coordinates Display - Show at top for verification */}
            {coordinates ? (
              <Box
                bg="green.50"
                borderColor="green.200"
                borderWidth="2px"
                p={3}
                borderRadius="md"
                w="full"
              >
                <Text fontSize="sm" color="green.800" fontWeight="bold">
                  ✅ Location Selected
                </Text>
                <Text fontSize="xs" color="green.700" mt={1}>
                  📌 Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                </Text>
              </Box>
            ) : (
              <Box
                bg="red.50"
                borderColor="red.200"
                borderWidth="2px"
                p={3}
                borderRadius="md"
                w="full"
              >
                <Text fontSize="sm" color="red.800" fontWeight="bold">
                  ⚠️ No location selected
                </Text>
                <Text fontSize="xs" color="red.700" mt={1}>
                  Please close and click on the map first
                </Text>
              </Box>
            )}

            {/* Location Name */}
            <FormControl isRequired>
              <FormLabel fontWeight="bold">Location Name</FormLabel>
              <Input
                placeholder="e.g., Tokyo Tower, Shibuya Crossing"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                size="lg"
              />
            </FormControl>

            {/* Category Dropdown */}
            <FormControl isRequired>
              <FormLabel fontWeight="bold">Category</FormLabel>
              <Select
                placeholder="Select a category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                size="lg"
              >
                <option value="Anime">🎌 Anime</option>
                <option value="Movies">🎬 Movies</option>
                <option value="Gaming">🎮 Gaming</option>
                <option value="Manga">📚 Manga</option>
              </Select>
            </FormControl>

            {/* Description */}
            <FormControl isRequired>
              <FormLabel fontWeight="bold">Description</FormLabel>
              <Textarea
                placeholder="Describe what makes this location special and how it relates to the series/movie..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                size="lg"
              />
            </FormControl>

            {/* Personal Comment */}
            <FormControl>
              <FormLabel fontWeight="bold">Personal Comment (Optional)</FormLabel>
              <Textarea
                placeholder="Share your experience visiting this place..."
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows={3}
              />
            </FormControl>

            {/* Image Upload */}
            <FormControl>
              <FormLabel fontWeight="bold">Upload Photo (Optional)</FormLabel>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              
              {!formData.imagePreview ? (
                <Button
                  leftIcon={<FiUpload />}
                  variant="outline"
                  colorScheme="pink"
                  onClick={() => fileInputRef.current?.click()}
                  w="full"
                  size="lg"
                  h="auto"
                  py={4}
                >
                  <VStack spacing={1}>
                    <Text>Click to upload image</Text>
                    <Text fontSize="xs" color="gray.500">
                      Max size: 5MB
                    </Text>
                  </VStack>
                </Button>
              ) : (
                <Box position="relative" borderRadius="md" overflow="hidden">
                  <Image
                    src={formData.imagePreview}
                    alt="Preview"
                    maxH="250px"
                    w="full"
                    objectFit="cover"
                  />
                  <Button
                    position="absolute"
                    top={2}
                    right={2}
                    size="sm"
                    colorScheme="red"
                    leftIcon={<FiX />}
                    onClick={handleRemoveImage}
                  >
                    Remove
                  </Button>
                </Box>
              )}
            </FormControl>

            {/* Submit Buttons */}
            <HStack spacing={3} w="full" pt={2}>
              <Button variant="ghost" onClick={handleClose} flex={1} size="lg">
                Cancel
              </Button>
              <Button
                colorScheme="pink"
                onClick={handleSubmit}
                flex={1}
                size="lg"
                leftIcon={<Text>✨</Text>}
                isDisabled={!coordinates}
              >
                Add Location
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}