import { Box, Text } from '@chakra-ui/react';

const emojiMap = {
  happy: '😊',
  excited: '🤩',
  thinking: '🤔',
  sad: '😢',
  celebrating: '🎉',
  cool: '😎'
};

export function CharacterEmoji({ emotion = 'happy', size = '100px' }) {
  return (
    <Box fontSize={size} textAlign="center" lineHeight="1">
      {emojiMap[emotion] || emojiMap.happy}
    </Box>
  );
}