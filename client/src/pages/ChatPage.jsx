import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../api";

function ChatPage() {
  // team, messages, input
  const [teamId, setTeamId] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // load selected team id from localStorage
  useEffect(() => {
    const storedTeamId = localStorage.getItem("selectedTeamId");
    if (storedTeamId) {
      setTeamId(storedTeamId);
    }
  }, []);

  // load messages periodically
  useEffect(() => {
    if (!teamId) return;

    const loadMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/chat/${teamId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // 404 / HTML aaya to JSON parse mat karo
        if (!res.ok) {
          console.log("Chat HTTP status:", res.status);
          return;
        }

        const data = await res.json();
        if (data.success) {
          setMessages(data.messages || []);
        } else {
          console.log("Chat API error:", data.message);
        }
      } catch (err) {
        console.log("Chat load error:", err);
      }
    };

    loadMessages();
    const intervalId = setInterval(loadMessages, 5000);
    return () => clearInterval(intervalId);
  }, [teamId]);

  // send message
  const handleSend = async () => {
    if (!text.trim()) {
      Swal.fire("Error", "Message cannot be empty", "error");
      return;
    }
    if (!teamId) {
      Swal.fire("Error", "Please select a team first", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/chat/${teamId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        Swal.fire("Error", "Server unreachable", "error");
        return;
      }

      const data = await res.json();
      if (data.success) {
        // optimistically UI update
        setMessages((prev) => [
          ...prev,
          {
            _id: data.data?._id || Math.random().toString(),
            text: text.trim(),
            sender: { fullName: "You" },
            createdAt: data.data?.createdAt || new Date().toISOString(),
          },
        ]);
        setText("");
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (err) {
      console.log("Chat send error:", err);
      Swal.fire("Error", "Server error", "error");
    }
  };

  return (
    <div className="ts-card p-4">
      <h2 className="ts-page-title">Team Chat</h2>

      {!teamId && (
        <p className="text-muted mt-2">
          Please select a team from Dashboard → click on a team name.
        </p>
      )}

      {teamId && (
        <>
          <div
            style={{
              height: "320px",
              overflowY: "auto",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: 12,
              marginTop: 12,
              marginBottom: 12,
              background: "#f9fafb",
            }}
          >
            {messages.length === 0 && (
              <p className="text-muted">No messages yet.</p>
            )}

            {messages.map((m) => (
              <div key={m._id || Math.random()} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>
                  {m.sender?.fullName || "Member"}
                </div>
                <div style={{ fontSize: 14 }}>{m.text}</div>
                <div style={{ fontSize: 11, color: "#6b7280" }}>
                  {m.createdAt
                    ? new Date(m.createdAt).toLocaleString()
                    : ""}
                </div>
                <hr />
              </div>
            ))}
          </div>

          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleSend}>
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ChatPage;
