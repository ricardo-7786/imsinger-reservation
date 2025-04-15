'use client';
import { useEffect, useState } from 'react';

export default function ReservationPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const openHandler = () => {
      setShow(true);
      document.body.classList.add('popup-open'); // ✅ blur 클래스 추가
    };
    window.addEventListener('openReservationPopup', openHandler);

    return () => {
      window.removeEventListener('openReservationPopup', openHandler);
      document.body.classList.remove('popup-open'); // ✅ 팝업 닫힐 때 제거
    };
  }, []);

  if (!show) return null;

  return (
    <div
      id="reservation-iframe-popup"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'transparent', // ✅ 완전 투명
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <iframe
        src="https://YOUR_SITE.netlify.app/reservation?teacher=이연희&tagline=보컬 코치 이연희<br>감성과 테크닉을 모두 잡다"
        style={{
          width: '90vw',
          height: '90vh',
          border: 'none',
          borderRadius: '16px',
          boxShadow: '0 20px 30px rgba(0, 0, 0, 0.25)',
          background: 'transparent',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'auto', // ✅ iframe 클릭 가능
        }}
        allowTransparency={true}
      />
    </div>
  );
}

