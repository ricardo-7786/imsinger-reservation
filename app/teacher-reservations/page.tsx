"use client";

import { useEffect, useState } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function TeacherReservationsPage() {
  const [user] = useAuthState(auth);
  const [availableTimes, setAvailableTimes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (!user?.displayName) return;

      // Firestore에서 해당 강사의 availableTimes 가져오기
      const q = query(
        collection(db, "teachers", user.displayName),
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => doc.data().availableTimes);
      setAvailableTimes(data);
      setLoading(false);
    };

    fetchAvailableTimes();
  }, [user]);

  if (loading) return <p>로딩 중...</p>;
  if (!user) return <p>로그인이 필요합니다.</p>;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20 }}>
      <h2>{user.displayName} 강사님의 예약 목록</h2>
      {availableTimes.length === 0 ? (
        <p>예약된 수업이 없습니다.</p>
      ) : (
        <ul>
          {availableTimes.map((time, index) => (
            <li key={index} style={{ marginBottom: 12 }}>
              {time}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
