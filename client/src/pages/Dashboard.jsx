import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../api";

function Dashboard() {
  // STATES
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const [teamName, setTeamName] = useState("");
  const [teamDesc, setTeamDesc] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const [userName, setUserName] = useState("");
  const [myTeams, setMyTeams] = useState([]);

  // LOAD USER NAME
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUserName(JSON.parse(stored).fullName);
    }
  }, []);

  // FETCH MY TEAMS
  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/api/team/my-teams`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setMyTeams(data.teams);
      }
    } catch (error) {
      console.log("Fetch teams error:", error);
    }
  };

  // GENERATE CODE
  const generateTeamCode = () => {
    const prefix = "TS";
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `${prefix}-${randomNum}`;
  };

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

  return (
    <div className="container mt-4">
      <h1 className="ts-page-title">Dashboard</h1>
      <p className="ts-page-subtitle">Overview of your team's activity.</p>

      {/* WELCOME CARD */}
      <div className="ts-card p-4 mt-3 shadow-sm">
        <h2 style={{ fontFamily: "Poppins", marginBottom: 10 }}>
          Welcome, {userName} 👋
        </h2>

        <p style={{ fontSize: 14, color: "#6b7280" }}>
          Manage your teams, join new projects and stay updated.
        </p>

        <button className="btn btn-primary mt-3" onClick={() => setShowCreateModal(true)}>
          + Create Team
        </button>

        <button className="btn btn-outline-primary mt-3 ms-2" onClick={() => setShowJoinModal(false) || setShowJoinModal(true)}>
          + Join Team
        </button>
      </div>

      {/* MY TEAMS LIST */}
      <div className="ts-card p-4 mt-4 shadow-sm">
        <h4>Your Teams ({myTeams.length})</h4>

        {myTeams.length === 0 ? (
          <p className="text-muted mt-2">You are not part of any teams yet.</p>
        ) : (
          <ul className="mt-3">
            {myTeams.map((team) => (
              <li
  key={team._id}
  style={{ marginBottom: 8, cursor: "pointer" }}
  onClick={() => {
    localStorage.setItem("selectedTeamId", team._id);
    window.dispatchEvent(new Event("openTeamDetails"));
  }}
>
  <b>{team.teamName}</b> — 
  <span style={{ color: "#2563eb" }}>{team.teamCode}</span>
</li>

            ))}
          </ul>
        )}
      </div>

      {/* CREATE TEAM MODAL */}
      {showCreateModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h4 className="mb-3">Create Team</h4>

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />

            <textarea
              className="form-control mb-3"
              rows="3"
              placeholder="Team Description"
              value={teamDesc}
              onChange={(e) => setTeamDesc(e.target.value)}
            />

            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
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
                        html: `<b>${teamName}</b> created successfully.<br/><br/>
                               Team Code:<br/><div style="font-size:20px;color:#2563eb">${teamCode}</div>`,
                        icon: "success",
                      });

                      setShowCreateModal(false);
                      setTeamName("");
                      setTeamDesc("");
                      fetchTeams();
                    } else {
                      Swal.fire("Error", data.message, "error");
                    }
                  } catch (error) {
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

      {/* JOIN TEAM MODAL */}
      {showJoinModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h4 className="mb-3">Join a Team</h4>

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter Team Code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />

            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-secondary" onClick={() => setShowJoinModal(false)}>
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={async () => {
                  if (!joinCode.trim()) {
                    Swal.fire("Error", "Please enter a team code", "error");
                    return;
                  }

                  const token = localStorage.getItem("token");

                  try {
                    const res = await fetch(`${API_BASE_URL}/api/team/join`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({ teamCode: joinCode }),
                    });

                    const data = await res.json();

                    if (data.success) {
                      Swal.fire("Success", data.message, "success");
                      setShowJoinModal(false);
                      setJoinCode("");
                    } else {
                      Swal.fire("Error", data.message, "error");
                    }
                  } catch (error) {
                    Swal.fire("Error", "Server error", "error");
                  }
                }}
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
