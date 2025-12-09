import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Dashboard from "../pages/Dashboard";
import CalendarPage from "../pages/CalendarPage";
import TeamAdmin from "../pages/TeamAdmin";
import TeamDetails from "../pages/TeamDetails";
import WorkLog from "../pages/WorkLog";
import { API_BASE_URL } from "../api";

function MainLayout() {
  // states
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // listen to openTeamDetails event
  useEffect(() => {
    const openEvent = () => {
      const id = localStorage.getItem("selectedTeamId");
      if (id) {
        setSelectedTeamId(id);
        setActivePage("teamDetails");
        checkAdminStatus(id);
      }
    };

    window.addEventListener("openTeamDetails", openEvent);
    return () => window.removeEventListener("openTeamDetails", openEvent);
  }, []);

  // check if user is team admin
  const checkAdminStatus = async (teamId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/team/${teamId}/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) setIsAdmin(data.isAdmin);
    } catch (err) {
      console.log("Admin check error:", err);
    }
  };

  // handle sidebar selection
  const handleSelect = (page) => {
    setActivePage(page);

    // If worklog clicked → check admin status
    if (page === "worklog" && selectedTeamId) {
      checkAdminStatus(selectedTeamId);
    }
  };

  return (
    <div className="app-root">
      <Navbar />

      <div className="ts-layout" style={{ display: "flex" }}>
        {/* sidebar */}
        <Sidebar activeItem={activePage} onSelect={handleSelect} />

        {/* main content */}
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

          {/* work log page */}
          {activePage === "worklog" && (
            <WorkLog teamId={selectedTeamId} isAdmin={isAdmin} />
          )}

          {/* fallback */}
          {activePage !== "dashboard" &&
            activePage !== "calendar" &&
            activePage !== "admin" &&
            activePage !== "teamDetails" &&
            activePage !== "worklog" && (
              <div className="ts-card p-4">
                <h2 className="ts-page-title">{activePage}</h2>
                <p className="ts-page-subtitle">Page coming soon.</p>
              </div>
            )}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
