import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Dashboard from "../pages/Dashboard";
import CalendarPage from "../pages/CalendarPage";

function MainLayout() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="app-root">
      <Navbar />

      <div className="ts-layout">
        <Sidebar activeItem={activePage} onSelect={setActivePage} />

       <main className="ts-main">
  {activePage === "dashboard" && <Dashboard />}
  {activePage === "calendar" && <CalendarPage />}

  {activePage !== "dashboard" && activePage !== "calendar" && (
    <div className="ts-card">
      <h2 className="ts-page-title" style={{ marginBottom: 8 }}>
        {activePage.charAt(0).toUpperCase() + activePage.slice(1)}
      </h2>
      <p className="ts-page-subtitle">Page content will appear here.</p>
    </div>
  )}
</main>


      </div>
    </div>
  );
}

export default MainLayout;
