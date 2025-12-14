import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MainLayout from "./layouts/MainLayout";
import VerifyEmail from "./pages/VerifyEmail";
import VerifyLink from "./pages/VerifyLink";
import NoticeBoard from "./pages/NoticeBoard";
import InviteJoin from "./pages/InviteJoin";
import Settings from "./pages/Settings";

function App() {
  // state
  const [selectedTeam, setSelectedTeam] = useState(null);

  // listen for openTeamDetails event
  useEffect(() => {
    window.addEventListener("openTeamDetails", () => {
      const id = localStorage.getItem("selectedTeamId");
      setSelectedTeam(id);
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* auth routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verify-email/:token" element={<VerifyLink />} />
        <Route path="/team-notice" element={<NoticeBoard />} />
        <Route path="/invite/:token" element={<InviteJoin />} />
        <Route path="/app/settings" element={<Settings />} />


        {/* main app */}
        <Route
          path="/app/*"
          element={<MainLayout selectedTeam={selectedTeam} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
