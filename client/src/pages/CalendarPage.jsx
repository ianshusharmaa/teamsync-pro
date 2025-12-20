import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../api";

function CalendarPage() {
  const teamId = localStorage.getItem("selectedTeamId");
  const token = localStorage.getItem("token");

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [notices, setNotices] = useState([]);
  const [holidays, setHolidays] = useState([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // stop if team not selected
  useEffect(() => {
    if (!teamId) {
      Swal.fire("Select team", "Please select a team first", "info");
    }
  }, [teamId]);

  // load holidays
  useEffect(() => {
    if (!teamId) return;

    fetch(`${API_BASE_URL}/api/calendar/${teamId}/holidays`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d?.success && setHolidays(d.holidays || []))
      .catch(() => {});
  }, [month, year, teamId]);

  // date click
  const handleDateClick = (day) => {
    if (!teamId) return;

    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    setSelectedDate(dateStr);

    fetch(`${API_BASE_URL}/api/calendar/${teamId}/${dateStr}/notices`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d?.success && setNotices(d.notices || []))
      .catch(() => {});
  };

  const changeMonth = (val) => {
    setCurrentDate(new Date(year, month + val, 1));
    setSelectedDate(null);
    setNotices([]);
  };

  return (
    <div className="ts-card p-4">
      <h2 className="ts-page-title">Team Calendar</h2>

      {/* header */}
      <div style={header}>
        <button onClick={() => changeMonth(-1)}>◀</button>
        <h4>
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </h4>
        <button onClick={() => changeMonth(1)}>▶</button>
      </div>

      {/* calendar */}
      <div style={grid}>
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
          <div key={d} style={week}>{d}</div>
        ))}

        {Array(firstDay).fill(0).map((_, i) => (
          <div key={i}></div>
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
          const isHoliday = holidays.includes(dateStr);
          const isToday = new Date().toDateString() === new Date(year,month,day).toDateString();

          return (
            <div
              key={day}
              onClick={() => handleDateClick(day)}
              style={{
                ...dayBox,
                background: isHoliday ? "#FEE2E2" : isToday ? "#DBEAFE" : "#fff",
              }}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* notice section */}
      {selectedDate && (
        <div className="mt-4">
          <h4>{selectedDate}</h4>

          {notices.length === 0 ? (
            <p className="text-muted">No notice for this day</p>
          ) : (
            notices.map(n => (
              <div key={n._id} style={noticeBox}>
                <b>{n.title}</b>
                <p>{n.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* styles */
const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: 10,
};

const week = {
  textAlign: "center",
  fontWeight: 600,
};

const dayBox = {
  height: 70,
  border: "1px solid #E5E7EB",
  borderRadius: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const noticeBox = {
  border: "1px solid #E5E7EB",
  borderRadius: 8,
  padding: 10,
  marginBottom: 8,
};

export default CalendarPage;
