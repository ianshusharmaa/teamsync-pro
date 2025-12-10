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
  const [loading, setLoading] = useState(true);

  // Load all teams of the user
  useEffect(() => {
    loadMyTeams();
  }, []);

  const loadMyTeams = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/api/team/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (data.success) {
        setMyTeams(data.teams || []);
      }
    } catch (err) {
      console.log("Team list error:", err);
    }
  };

  // When team is selected → load details + requests
  useEffect(() => {
    if (!selectedTeamId) {
      setTeam(null);
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
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (data.success) {
        setTeam(data.team);
        setMembers(data.team.members || []);

        const user = JSON.parse(localStorage.getItem("user"));
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
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await res.json();
      if (data.success) {
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.log("Requests load error:", err);
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
                className="list-group-item"
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
      {selectedTeamId && team && (
        <>
          <div className="ts-card p-3 mt-4 shadow-sm">
            <h3>{team.teamName}</h3>
            <p>{team.teamDesc || "No description"}</p>

            <h6 className="mt-3">Team Code:</h6>
            <div className="badge bg-primary fs-6 p-2">{team.teamCode}</div>
          </div>

          {/* MEMBERS */}
          <div className="ts-card p-3 mt-4 shadow-sm">
            <h4>Members</h4>
            <ul className="list-group mt-3">
              {members.map((m) => (
                <li key={m._id} className="list-group-item">
                  <b>{m.fullName}</b>
                  <br />
                  <small className="text-muted">{m.email}</small>
                </li>
              ))}
            </ul>
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
                    <li key={r._id} className="list-group-item">
                      <b>{r.fullName}</b>
                      <br />
                      <small>{r.email}</small>
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
