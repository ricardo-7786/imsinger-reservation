'use client';
import { useEffect, useState } from 'react';

export default function ReservationPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const openHandler = () => setShow(true);
    window.addEventListener('openReservationPopup', openHandler);
    return () => {
      window.removeEventListener('openReservationPopup', openHandler);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        backgroundColor: 'rgba(255,255,255,0.05)', // ✅ 약간 투명한 배경
        backdropFilter: 'blur(8px)',               // ✅ 블러
        WebkitBackdropFilter: 'blur(8px)',
        pointerEvents: 'auto',
      }}
    >
      <iframe
        src="https://resonant-smakager-8baab9.netlify.app/reservation?teacher=이연희&tagline=보컬 코치 이연희<br>감성과 테크닉을 모두 잡다"
        style={{
          width: '90vw',
          height: '90vh',
          border: 'none',
          borderRadius: '16px',
          background: 'transparent',
          boxShadow: '0 20px 30px rgba(0, 0, 0, 0.25)',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'auto',
        }}
        allowTransparency={true}
      />
    </div>
  );
}

