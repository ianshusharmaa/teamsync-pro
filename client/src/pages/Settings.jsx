import React, { useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../api";

function Settings() {
  // user data
  const user = JSON.parse(localStorage.getItem("user"));

  // state
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // update profile
  const updateProfile = async () => {
    if (!fullName.trim()) {
      Swal.fire("Error", "Name required", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        Swal.fire("Updated", "Profile updated", "success");
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch {
      Swal.fire("Error", "Server error", "error");
    }
  };

  // change password
  const changePassword = async () => {
    if (!oldPassword || !newPassword) {
      Swal.fire("Error", "All fields required", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();
      if (data.success) {
        Swal.fire("Success", "Password changed", "success");
        setOldPassword("");
        setNewPassword("");
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch {
      Swal.fire("Error", "Server error", "error");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="ts-page-title">Settings</h2>

      {/* profile card */}
      <div className="ts-card p-4 mt-3 shadow-sm">
        <h5>Profile</h5>

        <input
          className="form-control mt-2"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
        />

        <input
          className="form-control mt-2"
          value={user?.email}
          disabled
        />

        <button className="btn btn-primary mt-3" onClick={updateProfile}>
          Save Changes
        </button>
      </div>

      {/* password card */}
      <div className="ts-card p-4 mt-4 shadow-sm">
        <h5>Change Password</h5>

        <input
          type="password"
          className="form-control mt-2"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <input
          type="password"
          className="form-control mt-2"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button className="btn btn-danger mt-3" onClick={changePassword}>
          Update Password
        </button>
      </div>
    </div>
  );
}

export default Settings;
