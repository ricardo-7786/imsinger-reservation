'use client';
import '../styles/globals.css';
import { ChakraProvider } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import theme from './lib/theme'; // ✅ theme 적용
import ReservationPopup from '../components/ReservationPopup'; // ✅ 팝업 추가

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <ChakraProvider theme={theme}> {/* ✅ theme 적용 */}
          {children}
          <ReservationPopup />
        </ChakraProvider>
      </body>
    </html>
  );
}




