import { useEffect } from "react";

export default function ReservationPopup() {
  useEffect(() => {
    const existing = document.getElementById("reservation-iframe-popup");
    if (existing) existing.remove();

    const wrapper = document.createElement("div");
    wrapper.id = "reservation-iframe-popup";
    wrapper.style.position = "fixed";
    wrapper.style.top = "0";
    wrapper.style.left = "0";
    wrapper.style.width = "100vw";
    wrapper.style.height = "100vh";
    wrapper.style.backgroundColor = "rgba(0,0,0,0.5)";
    wrapper.style.display = "flex"; // ← 팝업 안 뜨면 이 부분 확인!
    wrapper.style.alignItems = "center";
    wrapper.style.justifyContent = "center";
    wrapper.style.zIndex = "9999";

    const iframe = document.createElement("iframe");
    iframe.src =
      "https://imsinger-reservation-92t2o1rng-imsingers-projects.vercel.app/reservation?teacher=이연희&tagline=보컬 코치 이연희<br>감성과 테크닉을 모두 잡다";
    iframe.style.width = "90vw";
    iframe.style.height = "90vh";
    iframe.style.border = "none";
    iframe.style.borderRadius = "16px";
    iframe.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.3)";
    iframe.style.background = "white";

    const closeBtn = document.createElement("button");
    closeBtn.innerText = "✕";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "20px";
    closeBtn.style.right = "20px";
    closeBtn.style.fontSize = "24px";
    closeBtn.style.background = "transparent";
    closeBtn.style.border = "none";
    closeBtn.style.color = "white";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.zIndex = "10000";
    closeBtn.onclick = () => {
      wrapper.style.display = "none";
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        wrapper.style.display = "none";
      }
    };
    document.addEventListener("keydown", handleEsc);

    wrapper.appendChild(closeBtn);
    wrapper.appendChild(iframe);
    document.body.appendChild(wrapper);

    return () => {
      document.removeEventListener("keydown", handleEsc);
      const cleanup = document.getElementById("reservation-iframe-popup");
      if (cleanup) cleanup.remove();
    };
  }, []);

  return <div style={{ display: "none" }} />;
}
