'use client';
import { useEffect, useState } from 'react';

export default function ReservationPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
<<<<<<< HEAD
    const openHandler = () => setShow(true);
    window.addEventListener('openReservationPopup', openHandler);
    return () => {
      window.removeEventListener('openReservationPopup', openHandler);
=======
    const openHandler = () => {
      setShow(true);
      document.body.classList.add('popup-open'); // ✅ blur 클래스 추가
    };
    window.addEventListener('openReservationPopup', openHandler);

    return () => {
      window.removeEventListener('openReservationPopup', openHandler);
      document.body.classList.remove('popup-open'); // ✅ 팝업 닫힐 때 제거
>>>>>>> 3666a8f06551c71399cc5710fafcef7ba22680f7
    };
  }, []);

  if (!show) return null;

  return (
    <div
<<<<<<< HEAD
=======
      id="reservation-iframe-popup"
>>>>>>> 3666a8f06551c71399cc5710fafcef7ba22680f7
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
<<<<<<< HEAD
        zIndex: 9999,
        backgroundColor: 'rgba(255,255,255,0.05)', // ✅ 약간 투명한 배경
        backdropFilter: 'blur(8px)',               // ✅ 블러
        WebkitBackdropFilter: 'blur(8px)',
        pointerEvents: 'auto',
      }}
    >
      <iframe
        src="https://resonant-smakager-8baab9.netlify.app/reservation?teacher=이연희&tagline=보컬 코치 이연희<br>감성과 테크닉을 모두 잡다"
=======
        backgroundColor: 'transparent', // ✅ 완전 투명
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <iframe
        src="https://YOUR_SITE.netlify.app/reservation?teacher=이연희&tagline=보컬 코치 이연희<br>감성과 테크닉을 모두 잡다"
>>>>>>> 3666a8f06551c71399cc5710fafcef7ba22680f7
        style={{
          width: '90vw',
          height: '90vh',
          border: 'none',
          borderRadius: '16px',
<<<<<<< HEAD
          background: 'transparent',
          boxShadow: '0 20px 30px rgba(0, 0, 0, 0.25)',
=======
          boxShadow: '0 20px 30px rgba(0, 0, 0, 0.25)',
          background: 'transparent',
>>>>>>> 3666a8f06551c71399cc5710fafcef7ba22680f7
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
<<<<<<< HEAD
          pointerEvents: 'auto',
=======
          pointerEvents: 'auto', // ✅ iframe 클릭 가능
>>>>>>> 3666a8f06551c71399cc5710fafcef7ba22680f7
        }}
        allowTransparency={true}
      />
    </div>
  );
}

