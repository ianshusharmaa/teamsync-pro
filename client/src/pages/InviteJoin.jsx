// auto join team using invite link
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../api";

function InviteJoin() {
  const { token } = useParams(); // read invite token
  const navigate = useNavigate();

  useEffect(() => {
    autoJoinTeam(); // run on page load
  }, []);

  const autoJoinTeam = async () => {
    try {
      const userToken = localStorage.getItem("token"); // user auth token

      if (!userToken) {
        Swal.fire("Login required", "Please login first.", "info");
        navigate("/login");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/team/join/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ inviteToken: token }),
      });

      const data = await res.json();

      if (data.success) {
        // save selected team
        localStorage.setItem("selectedTeamId", data.teamId);

        Swal.fire("Joined!", "You joined the team successfully.", "success");

        navigate("/"); // redirect to main layout
      } else {
        Swal.fire("Error", data.message, "error");
        navigate("/");
      }
    } catch (err) {
      Swal.fire("Server Error", "Try again later.", "error");
      navigate("/");
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Joining Team...</h2>
      <p>Please wait...</p>
    </div>
  );
}

export default InviteJoin;
