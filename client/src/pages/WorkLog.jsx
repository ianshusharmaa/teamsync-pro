import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../api";

function WorkLog({ teamId, isAdmin }) {
  // states
  const [myLogs, setMyLogs] = useState([]);
  const [allLogs, setAllLogs] = useState([]);
  const [workText, setWorkText] = useState("");
  const [loading, setLoading] = useState(true);

  // load logs
  useEffect(() => {
    if (teamId) {
      loadMyLogs();
      if (isAdmin) loadAllLogs();
    }
  }, [teamId]);

  const headers = () => {
    return {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    };
  };

  const loadMyLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/worklog/${teamId}/my`, {
        headers: headers(),
      });

      const data = await res.json();
      if (data.success) setMyLogs(data.logs);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const loadAllLogs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/worklog/${teamId}/all`, {
        headers: headers(),
      });

      const data = await res.json();
      if (data.success) setAllLogs(data.logs);
    } catch (err) {
      console.log(err);
    }
  };

  // submit work
  const submitWork = async () => {
    if (!workText.trim()) {
      Swal.fire("Error", "Please enter your work update", "error");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/worklog/${teamId}`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ workText }),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire("Success", "Work log submitted", "success");
        setWorkText("");
        loadMyLogs();
        if (isAdmin) loadAllLogs();
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (err) {
      Swal.fire("Error", "Server error", "error");
    }
  };

  if (!teamId) {
    return (
      <div className="p-3 text-muted">
        No team selected.
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3 className="ts-page-title">Daily Work Log</h3>

      {/* MEMBER FORM */}
      {!isAdmin && (
        <div className="ts-card p-3 mt-3 shadow-sm">
          <h5>Submit Your Work</h5>
          <textarea
            rows="3"
            className="form-control mt-2"
            placeholder="Write what you did today..."
            value={workText}
            onChange={(e) => setWorkText(e.target.value)}
          ></textarea>

          <button className="btn btn-primary mt-3" onClick={submitWork}>
            Submit Work
          </button>
        </div>
      )}

      {/* MEMBER LOGS */}
      <div className="ts-card p-3 mt-4 shadow-sm">
        <h5>Your Work Logs</h5>

        {loading ? (
          <p className="text-muted mt-2">Loading...</p>
        ) : myLogs.length === 0 ? (
          <p className="text-muted mt-2">No logs submitted yet.</p>
        ) : (
          <ul className="list-group mt-3">
            {myLogs.map((log) => (
              <li className="list-group-item" key={log._id}>
                <div className="d-flex justify-content-between">
                  <span>{log.workText}</span>
                  <small className="text-muted">
                    {new Date(log.createdAt).toLocaleString()}
                  </small>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ADMIN ALL LOGS */}
      {isAdmin && (
        <div className="ts-card p-3 mt-4 shadow-sm">
          <h5>All Team Logs</h5>

          {allLogs.length === 0 ? (
            <p className="text-muted mt-2">No logs yet.</p>
          ) : (
            <ul className="list-group mt-3">
              {allLogs.map((log) => (
                <li className="list-group-item" key={log._id}>
                  <div>
                    <b>{log.user.fullName}</b> —{" "}
                    <small className="text-muted">{log.user.email}</small>
                  </div>

                  <div className="mt-2">{log.workText}</div>

                  <div className="mt-1 text-muted" style={{ fontSize: 12 }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default WorkLog;
