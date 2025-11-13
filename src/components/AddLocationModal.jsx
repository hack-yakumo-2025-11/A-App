import { useState, useRef } from 'react';
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
  VStack,
  HStack,
  Image,
  Box,
  Text,
  useToast,
} from '@chakra-ui/react';
import { FiUpload } from 'react-icons/fi';
import { useStore } from '../store/useStore';

export default function AddLocationModal({ isOpen, onClose, coordinates }) {
  const toast = useToast();
  const addUserLocation = useStore((state) => state.addUserLocation);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    anime: '',
    description: '',
    comment: '',
    image: null,
    imagePreview: null,
  });

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

  const handleSubmit = () => {
    if (!formData.name || !formData.anime || !formData.description) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    const newLocation = {
      name: formData.name,
      anime: formData.anime,
      description: formData.description,
      comment: formData.comment,
      lat: coordinates.lat,
      lng: coordinates.lng,
      image: formData.imagePreview || 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    };

    addUserLocation(newLocation);

    toast({
      title: '🎉 Location added!',
      description: 'Thank you for contributing to the community!',
      status: 'success',
      duration: 3000,
    });

    // Reset form
    setFormData({
      name: '',
      anime: '',
      description: '',
      comment: '',
      image: null,
      imagePreview: null,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Location 📍</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            {/* Location Name */}
            <FormControl isRequired>
              <FormLabel>Location Name</FormLabel>
              <Input
                placeholder="e.g., Tokyo Tower, Shibuya Crossing"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </FormControl>

            {/* Anime/Movie Name */}
            <FormControl isRequired>
              <FormLabel>Anime/Movie Name</FormLabel>
              <Input
                placeholder="e.g., One Piece, Naruto, Your Name"
                value={formData.anime}
                onChange={(e) => setFormData({ ...formData, anime: e.target.value })}
              />
            </FormControl>

            {/* Description */}
            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Describe what makes this location special..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </FormControl>

            {/* Personal Comment */}
            <FormControl>
              <FormLabel>Your Comment (Optional)</FormLabel>
              <Textarea
                placeholder="Share your experience visiting this place..."
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows={2}
              />
            </FormControl>

            {/* Image Upload */}
            <FormControl>
              <FormLabel>Upload Photo</FormLabel>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <Button
                leftIcon={<FiUpload />}
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                w="full"
              >
                {formData.image ? 'Change Photo' : 'Upload Photo'}
              </Button>
              {formData.imagePreview && (
                <Box mt={2} borderRadius="md" overflow="hidden">
                  <Image
                    src={formData.imagePreview}
                    alt="Preview"
                    maxH="200px"
                    w="full"
                    objectFit="cover"
                  />
                </Box>
              )}
            </FormControl>

            {/* Coordinates Display */}
            <Box
              bg="gray.50"
              p={3}
              borderRadius="md"
              w="full"
            >
              <Text fontSize="sm" color="gray.600">
                📍 Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
              </Text>
            </Box>

            {/* Submit Buttons */}
            <HStack spacing={3} w="full">
              <Button variant="ghost" onClick={onClose} flex={1}>
                Cancel
              </Button>
              <Button
                colorScheme="pink"
                onClick={handleSubmit}
                flex={1}
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