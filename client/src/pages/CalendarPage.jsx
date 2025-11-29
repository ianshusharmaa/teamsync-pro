import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

function CalendarPage() {
  return (
    <div>
      <h1 className="ts-page-title">Calendar</h1>
      <p className="ts-page-subtitle">View all work logs by date.</p>

      <div className="ts-card" style={{ marginTop: 20 }}>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          height="auto"
        />
      </div>
    </div>
  );
}

export default CalendarPage;
