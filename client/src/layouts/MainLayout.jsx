import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Dashboard from "../pages/Dashboard";
import CalendarPage from "../pages/CalendarPage";
import TeamAdmin from "../pages/TeamAdmin";
import TeamDetails from "../pages/TeamDetails";
import WorkLog from "../pages/WorkLog";
import ChatPage from "../pages/ChatPage";
import NoticeBoard from "../pages/NoticeBoard";
import Settings from "../pages/Settings"; // settings page
import Swal from "sweetalert2";

function MainLayout() {
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedTeamId, setSelectedTeamId] = useState("");

  // load selected team + listen dashboard click
  useEffect(() => {
    const saved = localStorage.getItem("selectedTeamId");
    if (saved) setSelectedTeamId(saved);

    const openTeamEvent = () => {
      const id = localStorage.getItem("selectedTeamId");
      if (id) {
        setSelectedTeamId(id);
        setActivePage("teamDetails");
      }
    };

    window.addEventListener("openTeamDetails", openTeamEvent);
    return () =>
      window.removeEventListener("openTeamDetails", openTeamEvent);
  }, []);

  // sidebar click handler
  const handleSelect = (page) => {
    if (
      (page === "teamDetails" ||
        page === "chat" ||
        page === "worklog" ||
        page === "notice") &&
      !selectedTeamId
    ) {
      Swal.fire(
        "Select a team",
        "Go to Dashboard and click on a team first.",
        "info"
      );
      setActivePage("dashboard");
      return;
    }
    setActivePage(page);
  };

  return (
    <div className="app-root">
      <Navbar />

      <div style={{ display: "flex" }}>
        <Sidebar activeItem={activePage} onSelect={handleSelect} />

        <main style={{ flexGrow: 1, padding: 24, background: "#F3F4F6" }}>
          {activePage === "dashboard" && <Dashboard />}
          {activePage === "calendar" && <CalendarPage />}
          {activePage === "admin" && <TeamAdmin teamId={selectedTeamId} />}
          {activePage === "teamDetails" && (
            <TeamDetails teamId={selectedTeamId} />
          )}
          {activePage === "worklog" && (
            <WorkLog teamId={selectedTeamId} />
          )}
          {activePage === "chat" && (
            <ChatPage teamId={selectedTeamId} />
          )}
          {activePage === "notice" && (
            <NoticeBoard teamId={selectedTeamId} />
          )}
          {activePage === "settings" && <Settings />}

          {![
            "dashboard",
            "calendar",
            "admin",
            "teamDetails",
            "worklog",
            "chat",
            "notice",
            "settings",
          ].includes(activePage) && (
            <div className="ts-card p-4">
              <h3>{activePage}</h3>
              <p>Page coming soon</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
