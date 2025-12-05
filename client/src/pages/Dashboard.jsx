import Swal from "sweetalert2";
import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../api";

function Dashboard() {
  // STATES
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamDesc, setTeamDesc] = useState("");
  const [userName, setUserName] = useState("");

  // LOAD USER
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUserName(JSON.parse(stored).fullName);
    }
  }, []);

  // MODAL STYLES
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const modalStyle = {
    width: "400px",
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
  }; 
  // Generate a unique team code (human-made)
const generateTeamCode = () => {
  const prefix = "TS";
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${randomNum}`;
};


  return (
    <div className="container mt-4">
      <h1 className="ts-page-title">Dashboard</h1>
      <p className="ts-page-subtitle">Overview of your team's activity.</p>

      <div className="ts-card p-4 mt-3 shadow-sm">
        <h2 style={{ fontFamily: "Poppins", marginBottom: 10 }}>
          Welcome, {userName || "User"} 👋
        </h2>

        <p style={{ fontSize: 14, color: "#6b7280" }}>
          Your dashboard shows work logs, teams and updates.
        </p>

        <button
          className="btn btn-primary mt-3"
          onClick={() => setShowCreateModal(true)}
        >
          + Create New Team
        </button>
      </div>

      {/* MODAL */}
      {showCreateModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h4 className="mb-3">Create New Team</h4>

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />

            <textarea
              className="form-control mb-3"
              placeholder="Team Description"
              rows="3"
              value={teamDesc}
              onChange={(e) => setTeamDesc(e.target.value)}
            ></textarea>

            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>

              <button
  className="btn btn-success"
  onClick={async () => {
    if (!teamName.trim()) {
      Swal.fire("Error", "Team name is required", "error");
      return;
    }

    const teamCode = generateTeamCode();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_BASE_URL}/api/team/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          teamName,
          teamDesc,
          teamCode,
        }),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          title: "Team Created 🎉",
          html: `
            <p><b>${teamName}</b> is now created.</p>
            <p>Your team code:</p>
            <div style="font-size: 20px; color: #2563eb;"><b>${teamCode}</b></div>
          `,
          icon: "success",
        });

        setShowCreateModal(false);
        setTeamName("");
        setTeamDesc("");
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Server error", "error");
    }
  }}
>
  Create
</button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
