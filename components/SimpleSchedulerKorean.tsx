import * as React from "react";
import { addPropertyControls, ControlType } from "framer";

export function SimpleSchedulerKorean() {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [selectedTeacher, setSelectedTeacher] = React.useState("모든 강사");
  const [selectedTime, setSelectedTime] = React.useState("");
  const [isAvailable, setIsAvailable] = React.useState(false);

  const teachers = ["모든 강사", "김선생", "박선생", "이선생"];
  const weekdayLabels = ["일", "월", "화", "수", "목", "금", "토"];

  const getWeekDates = (baseDate) => {
    const start = new Date(baseDate);
    start.setDate(baseDate.getDate() - baseDate.getDay());
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const weekDates = getWeekDates(selectedDate);

  const timeOptions = Array.from({ length: 14 }, (_, i) => {
    const hour = 8 + i;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  React.useEffect(() => {
    setIsAvailable(selectedTime === "10:00");
  }, [selectedTime]);

  const formatDate = (date) =>
    `${date.getMonth() + 1}월 ${date.getDate()}일, ${date.getFullYear()}년`;

  return (
    <div
      style={{
        fontFamily: "Pretendard, sans-serif",
        padding: 24,
        borderRadius: 16,
        background: "#fff",
        maxWidth: 360,
        color: "#111827",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ marginBottom: 12, fontWeight: 600 }}>
        {formatDate(selectedDate)} 📅
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {weekDates.map((d) => {
          const isSelected = d.toDateString() === selectedDate.toDateString();
          return (
            <button
              key={d.toDateString()}
              onClick={() => setSelectedDate(d)}
              style={{
                flex: 1,
                padding: "8px 0",
                borderRadius: 12,
                backgroundColor: isSelected ? "#000" : "#f3f4f6",
                color: isSelected ? "#fff" : "#111827",
                border: "none",
                fontWeight: 500,
              }}
            >
              {weekdayLabels[d.getDay()]} {d.getDate()}
            </button>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
          alignItems: "center",
        }}
      >
        <span style={{ color: "#6b7280", fontWeight: 500 }}>강사 선택</span>
        <select
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
          style={{
            padding: "6px 12px",
            borderRadius: 12,
            border: "1px solid #d1d5db",
            backgroundColor: "#f9fafb",
            fontWeight: 500,
          }}
        >
          {teachers.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
          alignItems: "center",
        }}
      >
        <span style={{ color: "#6b7280", fontWeight: 500 }}>수업 가능 시간</span>
        <select
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          style={{
            padding: "6px 12px",
            borderRadius: 12,
            border: "1px solid #d1d5db",
            backgroundColor: "#f9fafb",
            fontWeight: 500,
          }}
        >
          <option value="">선택</option>
          {timeOptions.map((t) => (
            <option key={t} value={t}>
              {t} ~ {parseInt(t.split(":")[0]) + 1}:50
            </option>
          ))}
        </select>
      </div>

      {!isAvailable && selectedTime && (
        <div
          style={{
            padding: "8px 0",
            textAlign: "center",
            color: "#9ca3af",
            fontSize: 14,
            marginBottom: 16,
          }}
        >
          죄송합니다, 선택한 날짜에 가능한 시간이 없습니다.
        </div>
      )}

      <button
        disabled={!isAvailable}
        style={{
          width: "100%",
          padding: "12px 0",
          borderRadius: 9999,
          backgroundColor: isAvailable ? "#000" : "#d1d5db",
          color: "#fff",
          border: "none",
          fontWeight: 600,
          cursor: isAvailable ? "pointer" : "not-allowed",
        }}
      >
        계속하기
      </button>
    </div>
  );
}

addPropertyControls(SimpleSchedulerKorean, {});

export default SimpleSchedulerKorean;



