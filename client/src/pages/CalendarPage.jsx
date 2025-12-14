import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../api";

function CalendarPage() {
  // current date
  const today = new Date();

  // state
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState("");

  // indian holidays
  const fixedHolidays = {
    "01-26": "Republic Day",
    "08-15": "Independence Day",
    "10-02": "Gandhi Jayanti",
  };

  // calendar calculations
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  // month name
  const monthName = new Date(year, month).toLocaleString("default", {
    month: "long",
  });

  // handle date click
  const handleSelect = (day) => {
    const d = new Date(year, month, day);
    setSelectedDate(`${year}-${month + 1}-${day}`);
    setSelectedLabel(
      d.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  };

  // mark holiday with confirm
  const markHoliday = async () => {
    const confirm = await Swal.fire({
      title: "Mark Holiday?",
      text: selectedLabel,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, mark",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");

      // save holiday
      await fetch(`${API_BASE_URL}/api/calendar/holiday`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date: selectedDate }),
      });

      // auto notice
      await fetch(`${API_BASE_URL}/api/notice/auto`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: "Holiday Declared",
          message: `${selectedLabel} is marked as holiday.`,
        }),
      });

      Swal.fire("Done", "Holiday + Notice created", "success");
    } catch {
      Swal.fire("Error", "Server issue", "error");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="ts-page-title">Calendar</h2>

      {/* month header */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button className="btn btn-outline-primary" onClick={() => setMonth(month - 1)}>
          ◀
        </button>
        <h4>{monthName} {year}</h4>
        <button className="btn btn-outline-primary" onClick={() => setMonth(month + 1)}>
          ▶
        </button>
      </div>

      {/* week header */}
      <div className="calendar-grid mt-3">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
          <div key={d} className="calendar-head">{d}</div>
        ))}

        {/* empty cells */}
        {Array(firstDay).fill(0).map((_, i) => <div key={i}></div>)}

        {/* days */}
        {Array.from({ length: totalDays }, (_, i) => {
          const day = i + 1;
          const dateObj = new Date(year, month, day);
          const isToday =
            dateObj.toDateString() === today.toDateString();
          const isWeekend =
            dateObj.getDay() === 0 || dateObj.getDay() === 6;

          const key = `${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

          return (
            <div
              key={day}
              onClick={() => handleSelect(day)}
              className={`cell ${isWeekend ? "weekend" : ""} ${isToday ? "today" : ""}`}
            >
              <b>{day}</b>
              {fixedHolidays[key] && <small>{fixedHolidays[key]}</small>}
            </div>
          );
        })}
      </div>

      {/* selected info */}
      {selectedDate && (
        <div className="ts-card p-3 mt-4">
          <h5>{selectedLabel}</h5>
          <button className="btn btn-danger mt-2" onClick={markHoliday}>
            Mark as Holiday + Notify
          </button>
        </div>
      )}

      {/* styles */}
      <style>{`
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
        }
        .calendar-head {
          text-align: center;
          font-weight: 600;
        }
        .cell {
          height: 90px;
          border-radius: 10px;
          padding: 8px;
          background: #f9fafb;
          cursor: pointer;
          transition: 0.2s;
        }
        .cell:hover {
          background: #e0e7ff;
        }
        .weekend {
          background: #fef3c7;
        }
        .today {
          border: 2px solid #2563eb;
          background: #dbeafe;
        }
        small {
          display: block;
          font-size: 11px;
          color: #b91c1c;
        }
      `}</style>
    </div>
  );
}

export default CalendarPage;
