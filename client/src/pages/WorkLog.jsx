import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../api";

function WorkLog() {
  const [teamId, setTeamId] = useState("");
  const [text, setText] = useState("");
  const [myLogs, setMyLogs] = useState([]);

  // load selected team id
  useEffect(() => {
    const storedTeamId = localStorage.getItem("selectedTeamId");
    if (storedTeamId) {
      setTeamId(storedTeamId);
    }
  }, []);

  // load my logs
  useEffect(() => {
    if (!teamId) return;

    const loadLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${API_BASE_URL}/api/worklog/${teamId}/my`,
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
  }, [teamId]);

  // submit today's log
  const handleSubmit = async () => {
    if (!text.trim()) {
      Swal.fire("Error", "Please write your work first", "error");
      return;
    }
    if (!teamId) {
      Swal.fire("Error", "Please select a team first", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/worklog/${teamId}`, {
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
        // Optional: reload logs
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

      {!teamId && (
        <p className="text-muted mt-2">
          Please select a team from Dashboard → click on a team name.
        </p>
      )}

      {teamId && (
        <>
          <textarea
            className="form-control mt-3"
            rows="4"
            placeholder="Write what you worked on today..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button className="btn btn-success mt-3" onClick={handleSubmit}>
            Submit today&apos;s log
          </button>

          <h5 className="mt-4">My previous logs</h5>
          {myLogs.length === 0 ? (
            <p className="text-muted mt-1">No logs yet.</p>
          ) : (
            <ul className="mt-2">
              {myLogs.map((log) => (
                <li key={log._id} style={{ marginBottom: 6 }}>
                  <b>{log.date}</b> — {log.workText}
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
