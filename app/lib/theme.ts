// lib/theme.ts (또는 styles/theme.ts)
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'transparent',
      },
      html: {
        bg: 'transparent',
      },
    },
  },
});

export default theme;
