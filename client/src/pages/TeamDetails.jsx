import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../api";

function TeamDetails({ teamId }) {
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeam();
  }, [teamId]);

  const loadTeam = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/api/team/${teamId}/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) {
        setTeam({
          id: teamId,
          name: data.teamName,
        });

        setMembers(data.members || []);
        setRequests(data.joinRequests || []);
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (err) {
      Swal.fire("Error", "Server error", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading team details...</div>;
  }

  if (!team) {
    return (
      <div className="p-4 text-muted">
        Team not found or you don't have access.
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="ts-page-title">{team.name}</h2>
      <p className="ts-page-subtitle">Team Overview & Members</p>

      {/* MEMBERS LIST */}
      <div className="ts-card p-3 mt-4 shadow-sm">
        <h4>Members</h4>
        {members.length === 0 ? (
          <p className="text-muted mt-2">No members yet.</p>
        ) : (
          <ul className="list-group mt-3">
            {members.map((m) => (
              <li key={m._id} className="list-group-item">
                <div className="d-flex justify-content-between">
                  <span>{m.fullName}</span>
                  <small className="text-muted">{m.email}</small>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* TEAM CODE */}
      <div className="ts-card p-3 mt-4 shadow-sm">
        <h5>Team Code</h5>
        <div className="mt-2">
          <span className="badge bg-primary fs-6 p-2">{team.id}</span>
        </div>
      </div>

      {/* FUTURE FEATURES */}
      <div className="ts-card p-3 mt-4 shadow-sm">
        <h5>Upcoming Features (Auto Integrated)</h5>
        <ul className="mt-2">
          <li>Notice Board</li>
          <li>Daily Work Logs</li>
          <li>Team Chat</li>
          <li>Invite Link</li>
          <li>Edit Team Info</li>
        </ul>
      </div>
    </div>
  );
}

export default TeamDetails;
