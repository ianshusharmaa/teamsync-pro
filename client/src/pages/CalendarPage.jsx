import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../api";

// fixed indian holidays
const INDIAN_HOLIDAYS = {
  "01-26": "Republic Day",
  "08-15": "Independence Day",
  "10-02": "Gandhi Jayanti",
};

function CalendarPage() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [holidays, setHolidays] = useState({});
  const [logs, setLogs] = useState([]);
  const [notices, setNotices] = useState([]);

  const teamId = localStorage.getItem("selectedTeamId");

  // load saved holidays
  useEffect(() => {
    const saved = localStorage.getItem("calendarHolidays");
    if (saved) setHolidays(JSON.parse(saved));
  }, []);

  // save holidays
  useEffect(() => {
    localStorage.setItem("calendarHolidays", JSON.stringify(holidays));
  }, [holidays]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const monthName = new Date(year, month).toLocaleString("default", {
    month: "long",
  });

  // check today
  const isToday = (d) =>
    d === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  // weekend check
  const isWeekend = (dayIndex) => dayIndex === 0 || dayIndex === 6;

  // indian holiday check
  const indianHoliday = (d) => {
    const key = `${String(month + 1).padStart(2, "0")}-${String(d).padStart(
      2,
      "0"
    )}`;
    return INDIAN_HOLIDAYS[key];
  };

  // toggle holiday
  const toggleHoliday = (key) => {
    Swal.fire({
      title: holidays[key] ? "Remove holiday?" : "Mark as holiday?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((res) => {
      if (res.isConfirmed) {
        setHolidays((prev) => {
          const copy = { ...prev };
          copy[key] ? delete copy[key] : (copy[key] = true);
          return copy;
        });
      }
    });
  };

  // load logs + notices for selected date
  const loadSummary = async (dateStr) => {
    if (!teamId) return;

    const token = localStorage.getItem("token");

    try {
      const logRes = await fetch(
        `${API_BASE_URL}/api/worklog/${teamId}/all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const logData = await logRes.json();

      if (logData.success) {
        setLogs(
          logData.logs.filter((l) => l.date === dateStr)
        );
      }

      const noticeRes = await fetch(
        `${API_BASE_URL}/api/notice/${teamId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const noticeData = await noticeRes.json();

      if (noticeData.success) {
        setNotices(
          noticeData.notices.filter(
            (n) =>
              new Date(n.createdAt).toISOString().split("T")[0] === dateStr
          )
        );
      }
    } catch (err) {
      console.log("Summary load error", err);
    }
  };

  return (
    <div className="ts-card p-4">
      <h2 className="ts-page-title">Calendar</h2>

      {/* month header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-outline-primary"
          onClick={() => setMonth(month === 0 ? 11 : month - 1)}
        >
          ◀
        </button>

        <h4>{monthName} {year}</h4>

        <button
          className="btn btn-outline-primary"
          onClick={() => setMonth(month === 11 ? 0 : month + 1)}
        >
          ▶
        </button>
      </div>

      {/* weekdays */}
      <div className="d-grid" style={{ gridTemplateColumns: "repeat(7,1fr)" }}>
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
          <div key={d} className="text-center fw-bold">{d}</div>
        ))}
      </div>

      {/* calendar */}
      <div
        className="mt-2"
        style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 8 }}
      >
        {[...Array(firstDay)].map((_, i) => <div key={i} />)}

        {[...Array(daysInMonth)].map((_, i) => {
          const date = i + 1;
          const dayIndex = (firstDay + i) % 7;
          const key = `${year}-${month + 1}-${date}`;
          const dateStr = `${year}-${String(month + 1).padStart(2,"0")}-${String(date).padStart(2,"0")}`;

          let bg = "#fff";
          if (isWeekend(dayIndex)) bg = "#FEE2E2";
          if (holidays[key] || indianHoliday(date)) bg = "#FECACA";
          if (isToday(date)) bg = "#DBEAFE";

          return (
            <div
              key={key}
              onClick={() => {
                setSelectedDate(dateStr);
                loadSummary(dateStr);
                toggleHoliday(key);
              }}
              style={{
                height: 80,
                padding: 8,
                borderRadius: 10,
                background: bg,
                border: "1px solid #E5E7EB",
                cursor: "pointer",
              }}
            >
              <b>{date}</b>
              {indianHoliday(date) && (
                <div style={{ fontSize: 11, color: "#991B1B" }}>
                  {indianHoliday(date)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* summary */}
      {selectedDate && (
        <div className="ts-card p-3 mt-4">
          <h5>Summary for {selectedDate}</h5>

          <h6 className="mt-3">Work Logs</h6>
          {logs.length === 0 ? (
            <p className="text-muted">No work logs</p>
          ) : (
            logs.map((l) => (
              <div key={l._id} className="border p-2 mb-2 rounded">
                <b>{l.user.fullName}</b>
                <div>{l.workText}</div>
              </div>
            ))
          )}

          <h6 className="mt-3">Notices</h6>
          {notices.length === 0 ? (
            <p className="text-muted">No notices</p>
          ) : (
            notices.map((n) => (
              <div key={n._id} className="border p-2 mb-2 rounded">
                <b>{n.title}</b>
                <div>{n.message}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default CalendarPage;
