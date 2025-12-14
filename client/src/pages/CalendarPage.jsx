import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

// basic indian holidays (static)
const INDIAN_HOLIDAYS = {
  "01-26": "Republic Day",
  "08-15": "Independence Day",
  "10-02": "Gandhi Jayanti",
};

function CalendarPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [holidays, setHolidays] = useState({});

  // load saved holidays
  useEffect(() => {
    const saved = localStorage.getItem("calendarHolidays");
    if (saved) setHolidays(JSON.parse(saved));
  }, []);

  // save holidays
  useEffect(() => {
    localStorage.setItem("calendarHolidays", JSON.stringify(holidays));
  }, [holidays]);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  // check today
  const isToday = (d) =>
    d === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  // check weekend
  const isWeekend = (dayIndex) => dayIndex === 0 || dayIndex === 6;

  // check indian holiday
  const isIndianHoliday = (date) => {
    const key = `${String(currentMonth + 1).padStart(2, "0")}-${String(
      date
    ).padStart(2, "0")}`;
    return INDIAN_HOLIDAYS[key];
  };

  // toggle holiday
  const toggleHoliday = (dateKey) => {
    Swal.fire({
      title: holidays[dateKey] ? "Remove holiday?" : "Mark as holiday?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((res) => {
      if (res.isConfirmed) {
        setHolidays((prev) => {
          const copy = { ...prev };
          if (copy[dateKey]) delete copy[dateKey];
          else copy[dateKey] = true;
          return copy;
        });
      }
    });
  };

  // month name
  const monthName = new Date(currentYear, currentMonth).toLocaleString(
    "default",
    { month: "long" }
  );

  return (
    <div className="ts-card p-4">
      <h2 className="ts-page-title">Calendar</h2>

      {/* header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <button
          className="btn btn-outline-primary"
          onClick={() =>
            setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1))
          }
        >
          ◀
        </button>

        <h4 style={{ margin: 0 }}>
          {monthName} {currentYear}
        </h4>

        <button
          className="btn btn-outline-primary"
          onClick={() =>
            setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1))
          }
        >
          ▶
        </button>
      </div>

      {/* week days */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          textAlign: "center",
          fontWeight: 600,
          marginBottom: 8,
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* calendar grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 8,
        }}
      >
        {[...Array(firstDay)].map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {[...Array(daysInMonth)].map((_, i) => {
          const date = i + 1;
          const dayIndex = (firstDay + i) % 7;
          const key = `${currentYear}-${currentMonth + 1}-${date}`;

          const weekend = isWeekend(dayIndex);
          const indianHoliday = isIndianHoliday(date);
          const customHoliday = holidays[key];

          let bg = "#ffffff";
          if (weekend) bg = "#FEE2E2";
          if (customHoliday || indianHoliday) bg = "#FECACA";
          if (isToday(date)) bg = "#DBEAFE";

          return (
            <div
              key={key}
              onClick={() => {
                setSelectedDate(key);
                toggleHoliday(key);
              }}
              style={{
                height: 80,
                borderRadius: 10,
                padding: 8,
                cursor: "pointer",
                background: bg,
                border: "1px solid #E5E7EB",
              }}
            >
              <div style={{ fontWeight: 600 }}>{date}</div>
              {indianHoliday && (
                <small style={{ color: "#991B1B" }}>
                  {indianHoliday}
                </small>
              )}
              {customHoliday && (
                <small style={{ color: "#991B1B" }}>Holiday</small>
              )}
            </div>
          );
        })}
      </div>

      {/* selected day info */}
      {selectedDate && (
        <div className="ts-card p-3 mt-4">
          <h5>Day Summary</h5>
          <p className="text-muted">
            Selected date: <b>{selectedDate}</b>
          </p>
          <p>Team work summary will appear here.</p>
        </div>
      )}
    </div>
  );
}

export default CalendarPage;
