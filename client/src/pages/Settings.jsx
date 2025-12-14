import React, { useState } from "react";
import Swal from "sweetalert2";

function Settings() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [name, setName] = useState(user?.fullName || "");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  // save profile handler
  const saveProfile = () => {
    Swal.fire("Saved", "Profile updated successfully", "success");
  };

  // change password handler
  const changePassword = () => {
    if (!oldPass || !newPass) {
      Swal.fire("Error", "All fields required", "error");
      return;
    }
    Swal.fire("Success", "Password changed", "success");
    setOldPass("");
    setNewPass("");
  };

  return (
    <div style={pageStyle}>
      <h2 style={titleStyle}>⚙ Settings</h2>

      {/* profile card */}
      <div style={cardStyle} className="fade-in">
        <h4>Profile</h4>

        <label>Name</label>
        <input
          className="form-control mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Email</label>
        <input
          className="form-control mb-3"
          value={user?.email}
          disabled
        />

        <button className="btn btn-primary" onClick={saveProfile}>
          Save Profile
        </button>
      </div>

      {/* password card */}
      <div style={cardStyle} className="fade-in">
        <h4>Change Password</h4>

        <input
          type="password"
          className="form-control mb-2"
          placeholder="Old password"
          value={oldPass}
          onChange={(e) => setOldPass(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="New password"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
        />

        <button className="btn btn-success" onClick={changePassword}>
          Update Password
        </button>
      </div>
    </div>
  );
}

/* page style */
const pageStyle = {
  maxWidth: 700,
  margin: "auto",
  padding: 20,
};

/* title style */
const titleStyle = {
  marginBottom: 20,
};

/* card style */
const cardStyle = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  marginBottom: 20,
  transition: "transform 0.3s",
};

export default Settings;
