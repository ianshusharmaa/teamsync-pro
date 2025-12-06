import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Dashboard from "../pages/Dashboard";
import CalendarPage from "../pages/CalendarPage";
import TeamAdmin from "../pages/TeamAdmin";
import TeamDetails from "../pages/TeamDetails";

function MainLayout() {
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedTeamId, setSelectedTeamId] = useState("");

  // Listen for event triggered from Dashboard to open Team Details
  useEffect(() => {
    const openEvent = () => {
      const id = localStorage.getItem("selectedTeamId");
      if (id) {
        setSelectedTeamId(id);
        setActivePage("teamDetails");
      }
    };

    window.addEventListener("openTeamDetails", openEvent);

    return () => {
      window.removeEventListener("openTeamDetails", openEvent);
    };
  }, []);

  return (
    <div className="app-root">
      <Navbar />

      <div className="ts-layout" style={{ display: "flex" }}>
        {/* SIDEBAR */}
        <Sidebar activeItem={activePage} onSelect={setActivePage} />

        {/* MAIN CONTENT */}
        <main
          className="ts-main"
          style={{ flexGrow: 1, padding: "24px", background: "#f3f4f6" }}
        >
          {activePage === "dashboard" && <Dashboard />}
          {activePage === "calendar" && <CalendarPage />}
          {activePage === "admin" && <TeamAdmin />}
          {activePage === "teamDetails" && (
            <TeamDetails teamId={selectedTeamId} />
          )}

          {/* DEFAULT FALLBACK */}
          {activePage !== "dashboard" &&
            activePage !== "calendar" &&
            activePage !== "admin" &&
            activePage !== "teamDetails" && (
              <div className="ts-card p-4">
                <h2 className="ts-page-title">{activePage}</h2>
                <p className="ts-page-subtitle">
                  Page content will appear here.
                </p>
              </div>
            )}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
