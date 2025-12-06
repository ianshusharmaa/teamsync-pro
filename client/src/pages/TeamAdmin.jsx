import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../api";

function TeamAdmin() {
  const [adminTeams, setAdminTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [joinRequests, setJoinRequests] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // LOAD ALL TEAMS WHERE I AM ADMIN
  useEffect(() => {
    loadAdminTeams();
  }, []);

  const loadAdminTeams = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/api/team/admin/teams`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) {
        setAdminTeams(data.teams || []);
      }
    } catch (err) {
      Swal.fire("Error", "Failed to load admin teams", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadTeamData = async (team) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/api/team/${team._id}/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) {
        setSelectedTeam(team);
        setJoinRequests(data.joinRequests || []);
        setMembers(data.members || []);
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (err) {
      Swal.fire("Error", "Failed to load team info", "error");
    }
  };

  const approveRequest = async (userId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_BASE_URL}/api/team/${selectedTeam._id}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId }),
        }
      );

      const data = await res.json();

      if (data.success) {
        Swal.fire("Success", data.message, "success");
        loadTeamData(selectedTeam);
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (err) {
      Swal.fire("Error", "Server error", "error");
    }
  };

  const rejectRequest = async (userId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_BASE_URL}/api/team/${selectedTeam._id}/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId }),
        }
      );

      const data = await res.json();

      if (data.success) {
        Swal.fire("Rejected", data.message, "success");
        loadTeamData(selectedTeam);
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (err) {
      Swal.fire("Error", "Server error", "error");
    }
  };

  if (loading) {
    return <div className="p-4">Loading admin teams...</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="ts-page-title">Team Admin Panel</h1>
      <p className="ts-page-subtitle">Manage your teams and requests.</p>

      {/* LEFT: TEAM LIST */}
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="ts-card p-3 shadow-sm">
            <h4>Your Admin Teams</h4>

            {adminTeams.length === 0 ? (
              <p className="text-muted mt-2">You are not admin of any team.</p>
            ) : (
              <ul className="list-group mt-3">
                {adminTeams.map((team) => (
                  <li
                    key={team._id}
                    className={`list-group-item ${
                      selectedTeam && selectedTeam._id === team._id
                        ? "active"
                        : ""
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => loadTeamData(team)}
                  >
                    <div className="d-flex justify-content-between">
                      <span>{team.teamName}</span>
                      <small>{team.teamCode}</small>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* RIGHT: REQUESTS + MEMBERS */}
        <div className="col-md-8">
          <div className="ts-card p-3 shadow-sm">
            {!selectedTeam ? (
              <p className="text-muted">
                Select a team from the left to manage members.
              </p>
            ) : (
              <>
                <h3>{selectedTeam.teamName}</h3>
                <p className="text-muted">{selectedTeam.teamDesc}</p>

                {/* JOIN REQUESTS */}
                <div className="mt-4">
                  <h5>Join Requests</h5>

                  {joinRequests.length === 0 ? (
                    <p className="text-muted">No pending requests.</p>
                  ) : (
                    joinRequests.map((req) => (
                      <div
                        key={req._id}
                        className="d-flex justify-content-between align-items-center border rounded p-2 mb-2"
                      >
                        <div>
                          <b>{req.fullName}</b>
                          <br />
                          <small>{req.email}</small>
                        </div>

                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => approveRequest(req._id)}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => rejectRequest(req._id)}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* MEMBERS LIST */}
                <div className="mt-4">
                  <h5>Members</h5>

                  {members.length === 0 ? (
                    <p className="text-muted">No members yet.</p>
                  ) : (
                    <ul className="list-group">
                      {members.map((m) => (
                        <li
                          key={m._id}
                          className="list-group-item d-flex justify-content-between"
                        >
                          <span>{m.fullName}</span>
                          <small className="text-muted">{m.email}</small>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamAdmin;
