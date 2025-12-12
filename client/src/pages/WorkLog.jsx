import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../api";

function WorkLog({ teamId }) {
  // local team id
  const [currentTeamId, setCurrentTeamId] = useState(teamId || "");
  const [text, setText] = useState("");
  const [myLogs, setMyLogs] = useState([]);

  // update when prop changes
  useEffect(() => {
    setCurrentTeamId(teamId || "");
  }, [teamId]);

  // load my logs when team changes
  useEffect(() => {
    if (!currentTeamId) return;

    const loadLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${API_BASE_URL}/api/worklog/${currentTeamId}/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          console.log("Worklog HTTP status:", res.status);
          return;
        }

        const data = await res.json();
        if (data.success) {
          setMyLogs(data.logs || []);
        } else {
          console.log("Worklog API error:", data.message);
        }
      } catch (err) {
        console.log("WorkLog load error:", err);
      }
    };

    loadLogs();
  }, [currentTeamId]);

  // submit today's log
  const handleSubmit = async () => {
    if (!text.trim()) {
      Swal.fire("Error", "Please write your work first", "error");
      return;
    }
    if (!currentTeamId) {
      Swal.fire("Error", "Please select a team first", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/worklog/${currentTeamId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ workText: text }),
      });

      if (!res.ok) {
        Swal.fire("Error", "Server unreachable", "error");
        return;
      }

      const data = await res.json();

      if (data.success) {
        Swal.fire("Success", data.message, "success");
        setText("");
        // reload logs
        const refreshRes = await fetch(
          `${API_BASE_URL}/api/worklog/${currentTeamId}/my`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          if (refreshData.success) setMyLogs(refreshData.logs || []);
        }
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (err) {
      console.log("WorkLog submit error:", err);
      Swal.fire("Error", "Server error", "error");
    }
  };

  return (
    <div className="ts-card p-4">
      <h2 className="ts-page-title">Daily Work Log</h2>

      {!currentTeamId && (
        <p className="text-muted mt-2">
          Please select a team from Dashboard → click on a team name.
        </p>
      )}

      {currentTeamId && (
        <>
          <textarea
            className="form-control mt-3"
            rows="4"
            placeholder="Write what you worked on today..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button className="btn btn-success mt-3" onClick={handleSubmit}>
            Submit today's log
          </button>

          <h5 className="mt-4">My previous logs</h5>
          {myLogs.length === 0 ? (
            <p className="text-muted mt-1">No logs yet.</p>
          ) : (
            <ul className="mt-2">
              {myLogs.map((log) => (
                <li key={log._id} style={{ marginBottom: 6 }}>
                  <b>{new Date(log.createdAt).toLocaleDateString()}</b> — {log.workText}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default WorkLog;
