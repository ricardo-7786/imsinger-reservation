'use client';

import { ReactNode } from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const customTheme = extendTheme({
  colors: {
    brand: {
      100: '#f7fafc',
      900: '#1a202c',
    },
  },
  fonts: {
    heading: `'Noto Sans KR', sans-serif`,
    body: `'Noto Sans KR', sans-serif`,
  },
});

type Props = {
  children: ReactNode;
};

export default function ThemeProvider({ children }: Props) {
  return <ChakraProvider theme={customTheme}>{children}</ChakraProvider>;
}
