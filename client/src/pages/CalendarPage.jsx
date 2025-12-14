import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../api";

function CalendarPage() {
  // state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState("");
  const [info, setInfo] = useState("Click a date to see work");
  const [holidays, setHolidays] = useState([]);

  // week names
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // indian fixed holidays
  const fixedHolidays = ["01-26", "08-15", "10-02"];

  // load admin holidays
  useEffect(() => {
    loadHolidays();
  }, []);

  const loadHolidays = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/holiday`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setHolidays(data.holidays || []);
    } catch {}
  };

  // month helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // change month
  const changeMonth = (value) => {
    setCurrentDate(new Date(year, month + value, 1));
    setSelectedDate("");
    setInfo("Click a date to see work");
  };

  // check weekend
  const isWeekend = (day) => {
    const d = new Date(year, month, day).getDay();
    return d === 0 || d === 6;
  };

  // check holiday
  const isHoliday = (day) => {
    const mmdd = `${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return fixedHolidays.includes(mmdd) || holidays.includes(`${year}-${mmdd}`);
  };

  // click date
  const handleDateClick = async (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);

    try {
      const token = localStorage.getItem("token");
      const teamId = localStorage.getItem("selectedTeamId");
      if (!teamId) return;

      const res = await fetch(
        `${API_BASE_URL}/api/worklog/${teamId}/date/${dateStr}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      if (data.success && data.logs.length) {
        setInfo(data.logs[0].workText);
      } else {
        setInfo("No work logged on this day");
      }
    } catch {
      setInfo("Error loading work");
    }
  };

  return (
    <div className="ts-card p-4">
      <h2 className="ts-page-title">Calendar</h2>

      {/* month header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-outline-secondary" onClick={() => changeMonth(-1)}>
          ◀
        </button>

        <h4>{monthName} {year}</h4>

        <button className="btn btn-outline-secondary" onClick={() => changeMonth(1)}>
          ▶
        </button>
      </div>

      {/* week names */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", fontWeight: 600 }}>
        {weekDays.map((d) => (
          <div key={d} style={{ textAlign: "center" }}>{d}</div>
        ))}
      </div>

      {/* calendar grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 8, marginTop: 8 }}>
        {Array(firstDay).fill(null).map((_, i) => (
          <div key={i}></div>
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
          <div
            key={day}
            onClick={() => handleDateClick(day)}
            style={{
              padding: "10px",
              textAlign: "center",
              cursor: "pointer",
              borderRadius: "6px",
              background: isHoliday(day)
                ? "#FCA5A5"
                : isWeekend(day)
                ? "#E5E7EB"
                : "#DBEAFE",
              border: selectedDate.endsWith(`-${String(day).padStart(2, "0")}`)
                ? "2px solid #2563EB"
                : "none",
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* info box */}
      {selectedDate && (
        <div className="ts-card p-3 mt-4">
          <h5>{selectedDate}</h5>
          <p>{info}</p>
        </div>
      )}
    </div>
  );
}

export default CalendarPage;
