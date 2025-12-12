import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../api";

function Dashboard() {
  // simple UI state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamDesc, setTeamDesc] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [userName, setUserName] = useState("");
  const [myTeams, setMyTeams] = useState([]);

  // load user name
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUserName(JSON.parse(stored).fullName);
  }, []);

  // load teams on mount
  useEffect(() => {
    fetchTeams();
  }, []);

  // fetch teams for this user (correct route)
  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/team/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // if non-OK, log and return
      if (!res.ok) {
        console.log("Fetch teams HTTP status:", res.status);
        return;
      }

      const data = await res.json();
      if (data.success) setMyTeams(data.teams || []);
    } catch (err) {
      console.log("Fetch teams error:", err);
    }
  };

  // generate a team code
  const generateTeamCode = () => {
    const random = Math.floor(10000 + Math.random() * 90000);
    return `TS-${random}`;
  };

  return (
    <div className="container mt-4">
      <h1 className="ts-page-title">Dashboard</h1>
      <p className="ts-page-subtitle">Overview of your activity</p>

      {/* welcome card */}
      <div className="ts-card p-4 mt-3 shadow-sm">
        <h2 style={{ fontFamily: "Poppins" }}>Welcome, {userName} 👋</h2>
        <p className="text-muted">Manage your teams and join new projects</p>

        <button
          className="btn btn-primary mt-3"
          onClick={() => setShowCreateModal(true)}
        >
          + Create Team
        </button>

        <button
          className="btn btn-outline-primary mt-3 ms-2"
          onClick={() => setShowJoinModal(true)}
        >
          + Join Team
        </button>
      </div>

      {/* team list */}
      <div className="ts-card p-4 mt-4 shadow-sm">
        <h4>Your Teams ({myTeams.length})</h4>

        {myTeams.length === 0 ? (
          <p className="text-muted mt-2">No teams yet.</p>
        ) : (
          <ul className="mt-3">
            {myTeams.map((team) => (
              <li
                key={team._id}
                style={{ cursor: "pointer", marginBottom: 8 }}
                onClick={() => {
                  localStorage.setItem("selectedTeamId", team._id);
                  // notify layout to open team details
                  window.dispatchEvent(new Event("openTeamDetails"));
                }}
              >
                <b>{team.teamName}</b> —{" "}
                <span style={{ color: "#2563eb" }}>{team.teamCode}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* create team modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h4>Create Team</h4>

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
                    Swal.fire("Error", "Team name required", "error");
                    return;
                  }

                  const code = generateTeamCode();
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
                        teamCode: code,
                      }),
                    });

                    if (!res.ok) {
                      Swal.fire("Error", "Server unreachable", "error");
                      return;
                    }

                    const data = await res.json();

                    if (data.success) {
                      Swal.fire(
                        "Team Created 🎉",
                        `Team Code: ${code}`,
                        "success"
                      );
                      setShowCreateModal(false);
                      setTeamName("");
                      setTeamDesc("");
                      fetchTeams();
                    } else {
                      Swal.fire("Error", data.message, "error");
                    }
                  } catch (err) {
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

      {/* join team modal */}
      {showJoinModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h4>Join Team</h4>

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter Team Code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />

            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setShowJoinModal(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={async () => {
                  if (!joinCode.trim()) {
                    Swal.fire("Error", "Team code required", "error");
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

                    if (!res.ok) {
                      Swal.fire("Error", "Server unreachable", "error");
                      return;
                    }

                    const data = await res.json();

                    if (data.success) {
                      Swal.fire("Success", data.message, "success");
                      setShowJoinModal(false);
                      setJoinCode("");
                    } else {
                      Swal.fire("Error", data.message, "error");
                    }
                  } catch (err) {
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
