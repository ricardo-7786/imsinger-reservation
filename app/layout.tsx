'use client';
<<<<<<< HEAD
import '../styles/globals.css';
import { ChakraProvider } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import theme from './lib/theme'; // ✅ theme 적용
import ReservationPopup from '../components/ReservationPopup'; // ✅ 팝업 추가
=======
import '../inject-style.css'; // ✅ 루트 기준 상대경로
import { ChakraProvider } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import ReservationPopup from '../components/ReservationPopup'; // ← 팝업 추가
>>>>>>> 3666a8f06551c71399cc5710fafcef7ba22680f7

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <ChakraProvider theme={theme}> {/* ✅ theme 적용 */}
          {children}
<<<<<<< HEAD
          <ReservationPopup />
=======
          <ReservationPopup /> {/* 항상 global하게 추가 */}
>>>>>>> 3666a8f06551c71399cc5710fafcef7ba22680f7
        </ChakraProvider>
      </body>
    </html>
  );
}




