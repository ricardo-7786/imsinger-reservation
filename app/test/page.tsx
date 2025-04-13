'use client';

import ReservationPopup from '../../components/ReservationPopup';
import { useEffect } from 'react';

export default function TestPage() {
  useEffect(() => {
    // 페이지 진입 시 자동 mount용
    // ReservationPopup 내부에서 iframe을 생성함
  }, []);

  return (
    <div style={{ height: '100vh', backgroundColor: '#f5f5f5' }}>
      <h1 style={{ textAlign: 'center', paddingTop: '100px' }}>
        ReservationPopup 테스트 페이지
      </h1>
      {/* 컴포넌트 mount만 하면 iframe이 생성되도록 설계됨 */}
      <ReservationPopup />
    </div>
  );
}
