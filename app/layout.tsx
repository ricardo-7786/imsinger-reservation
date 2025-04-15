'use client';
import '../inject-style.css'; // ✅ 루트 기준 상대경로
import { ChakraProvider } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import ReservationPopup from '../components/ReservationPopup'; // ← 팝업 추가

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <ChakraProvider>
          {children}
          <ReservationPopup /> {/* 항상 global하게 추가 */}
        </ChakraProvider>
      </body>
    </html>
  );
}



