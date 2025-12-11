import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../api";

function NoticeBoard({ teamId }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    loadNotices();
  }, [teamId]);

  const loadNotices = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/notice/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setNotices(data.notices);
      }
    } catch (err) {
      console.log("Load notice error:", err);
    }
  };

  const handlePost = async () => {
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
        body: JSON.stringify({ title, message }), // FIXED ✔
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire("Success", "Notice posted!", "success");
        setTitle("");
        setMessage("");
        loadNotices(); // refresh list
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
    </div>
  );
}

export default NoticeBoard;
