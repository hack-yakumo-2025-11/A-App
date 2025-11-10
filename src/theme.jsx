import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#ffe5f0',
      100: '#ffb8d4',
      200: '#ff8ab8',
      300: '#ff5c9c',
      400: '#ff2e80',
      500: '#FF6B9D',
      600: '#e64980',
      700: '#cc3366',
      800: '#b31d4d',
      900: '#990733',
    },
  },
  fonts: {
    heading: `'Poppins', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'full',
      },
      defaultProps: {
        colorScheme: 'brand',
      },
    },
  },
});

export default theme;