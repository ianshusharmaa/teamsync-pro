import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../api";

function NoticeBoard({ teamId }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notices, setNotices] = useState([]);

  // reload when team changes
  useEffect(() => {
    if (!teamId) {
      setNotices([]);
      return;
    }
    loadNotices();
  }, [teamId]);

  // load notices
  const loadNotices = async () => {
    if (!teamId) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/notice/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.log("Notice HTTP status:", res.status);
        return;
      }

      const data = await res.json();
      if (data.success) {
        setNotices(data.notices || []);
      }
    } catch (err) {
      console.log("Load notice error:", err);
    }
  };

  // post notice
  const handlePost = async () => {
    if (!teamId) {
      Swal.fire("Error", "Please select a team first", "error");
      return;
    }
    if (!title.trim()) {
      Swal.fire("Error", "Title is required", "error");
      return;
    }
    if (!message.trim()) {
      Swal.fire("Error", "Message is required", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/api/notice/${teamId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, message }),
      });

      if (!res.ok) {
        Swal.fire("Error", "Server unreachable", "error");
        return;
      }

      const data = await res.json();

      if (data.success) {
        Swal.fire("Success", "Notice posted!", "success");
        setTitle("");
        setMessage("");
        loadNotices();
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (err) {
      Swal.fire("Error", "Server error", "error");
    }
  };

  return (
    <div className="ts-card p-4">
      <h3 className="ts-page-title">Notice Board</h3>

      {!teamId && (
        <p className="text-muted mt-2">
          Please select a team from Dashboard → click on a team name.
        </p>
      )}

      {teamId && (
        <>
          <div className="mt-3">
            <input
              className="form-control mb-2"
              placeholder="Notice Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="form-control mb-2"
              placeholder="Write a message..."
              rows="3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>

            <button className="btn btn-primary" onClick={handlePost}>
              Post Notice
            </button>
          </div>

          <hr />

          <h5>Recent Notices</h5>

          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {notices.map((n) => (
              <div key={n._id} className="p-2 border rounded mb-2">
                <b>{n.title}</b>
                <p>{n.message}</p>
                <small className="text-muted">
                  {new Date(n.createdAt).toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default NoticeBoard;
