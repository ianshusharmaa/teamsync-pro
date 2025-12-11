// src/pages/TeamDetails.jsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../api";

function TeamDetails() {
  const [myTeams, setMyTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Load all teams of the user
  useEffect(() => {
    loadMyTeams();
  }, []);

  const loadMyTeams = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/api/team/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.log("Team list HTTP status:", res.status);
        return;
      }

      const data = await res.json();
      if (data.success) {
        setMyTeams(data.teams || []);
      } else {
        console.log("Team list error:", data.message);
      }
    } catch (err) {
      console.log("Team list error:", err);
    }
  };

  // When team is selected → load details + requests
  useEffect(() => {
    if (!selectedTeamId) {
      setTeam(null);
      setMembers([]);
      setRequests([]);
      setIsAdmin(false);
      return;
    }
    loadTeamDetails();
    loadRequests();
  }, [selectedTeamId]);

  const loadTeamDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/api/team/${selectedTeamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text();
        console.log("Team details HTTP status:", res.status, text);
        Swal.fire("Error", "Unable to load team details", "error");
        return;
      }

      const data = await res.json();

      if (data.success) {
        setTeam(data.team);
        setMembers(data.team.members || []);

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setIsAdmin(data.team.admin?._id === user.id);
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (err) {
      Swal.fire("Error", "Server error", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadRequests = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_BASE_URL}/api/team/${selectedTeamId}/requests`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.log("Requests HTTP status:", res.status, text);
        return;
      }

      const data = await res.json();
      if (data.success) {
        // server returns `requests` field (see backend)
        setRequests(data.requests || []);
        // update members too (server returns members)
        if (data.members) setMembers(data.members || []);
      } else {
        console.log("Requests load error:", data.message);
      }
    } catch (err) {
      console.log("Requests load error:", err);
    }
  };

  // Approve request (admin)
  const handleApprove = async (userId) => {
    if (!selectedTeamId) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_BASE_URL}/api/team/${selectedTeamId}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (!res.ok) {
        Swal.fire("Error", "Server unreachable", "error");
        return;
      }

      const data = await res.json();
      if (data.success) {
        Swal.fire("Success", data.message, "success");
        // update UI with returned members/requests if provided
        if (data.members) setMembers(data.members);
        if (data.requests) setRequests(data.requests);
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (err) {
      console.log("Approve error:", err);
      Swal.fire("Error", "Server error", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Reject request (admin)
  const handleReject = async (userId) => {
    if (!selectedTeamId) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_BASE_URL}/api/team/${selectedTeamId}/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (!res.ok) {
        Swal.fire("Error", "Server unreachable", "error");
        return;
      }

      const data = await res.json();
      if (data.success) {
        Swal.fire("Success", data.message, "success");
        if (data.requests) setRequests(data.requests);
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (err) {
      console.log("Reject error:", err);
      Swal.fire("Error", "Server error", "error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      {/* TEAM LIST */}
      <div className="ts-card p-3 shadow-sm">
        <h4>Your Teams</h4>
        {myTeams.length === 0 ? (
          <p className="text-muted mt-2">You are not a member of any team.</p>
        ) : (
          <ul className="list-group mt-2">
            {myTeams.map((t) => (
              <li
                key={t._id}
                className={`list-group-item ${selectedTeamId === t._id ? "active" : ""}`}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedTeamId(t._id)}
              >
                <b>{t.teamName}</b>
                <small className="ms-2 text-muted">{t.teamCode}</small>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* NO TEAM SELECTED */}
      {!selectedTeamId && (
        <div className="ts-card p-4 mt-4">
          <h5>Select a team to view details</h5>
        </div>
      )}

      {/* TEAM DETAILS */}
      {selectedTeamId && (
        <>
          <div className="ts-card p-3 mt-4 shadow-sm">
            {loading ? (
              <div>Loading team details...</div>
            ) : team ? (
              <>
                <h3>{team.teamName}</h3>
                <p>{team.teamDesc || "No description"}</p>

                <h6 className="mt-3">Team Code:</h6>
                <div className="badge bg-primary fs-6 p-2">{team.teamCode}</div>
              </>
            ) : (
              <div className="text-muted">Team not found or access denied.</div>
            )}
          </div>

          {/* MEMBERS */}
          <div className="ts-card p-3 mt-4 shadow-sm">
            <h4>Members</h4>
            {members.length === 0 ? (
              <p className="text-muted mt-2">No members yet.</p>
            ) : (
              <ul className="list-group mt-3">
                {members.map((m) => (
                  <li key={m._id} className="list-group-item">
                    <b>{m.fullName}</b>
                    <br />
                    <small className="text-muted">{m.email}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* JOIN REQUESTS (ADMIN ONLY) */}
          {isAdmin && (
            <div className="ts-card p-3 mt-4 shadow-sm">
              <h4>Join Requests</h4>
              {requests.length === 0 ? (
                <p className="text-muted">No pending requests.</p>
              ) : (
                <ul className="list-group mt-3">
                  {requests.map((r) => (
                    <li key={r._id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <b>{r.fullName}</b>
                        <br />
                        <small className="text-muted">{r.email}</small>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleApprove(r._id)}
                          disabled={actionLoading}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleReject(r._id)}
                          disabled={actionLoading}
                        >
                          Reject
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TeamDetails;
