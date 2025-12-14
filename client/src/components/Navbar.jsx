import React, { useState } from "react";
import Swal from "sweetalert2";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [open, setOpen] = useState(false);

  // logout handler
  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
    }).then((res) => {
      if (res.isConfirmed) {
        localStorage.clear();
        window.location.href = "/";
      }
    });
  };

  return (
    <div style={navStyle}>
      <h3 style={{ color: "#2563EB" }}>TeamSync Pro</h3>

      {/* profile box */}
      <div style={profileWrap}>
        <div style={profileBtn} onClick={() => setOpen(!open)}>
          <div style={avatar}>{user?.fullName?.[0]}</div>
          <span>{user?.fullName}</span>
        </div>

        {/* dropdown */}
        {open && (
          <div style={dropdown} className="fade-in">
            <div
              style={dropItem}
              onClick={() => (window.location.href = "/app/settings")}
            >
              ⚙ Settings
            </div>

            <div style={dropItem} onClick={handleLogout}>
              🚪 Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* styles */
const navStyle = {
  height: 60,
  background: "#fff",
  padding: "0 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: "1px solid #E5E7EB",
};

const profileWrap = {
  position: "relative",
};

const profileBtn = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  cursor: "pointer",
  fontWeight: 500,
};

const avatar = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  background: "#2563EB",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
};

const dropdown = {
  position: "absolute",
  right: 0,
  top: 48,
  background: "#fff",
  borderRadius: 10,
  boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
  overflow: "hidden",
  minWidth: 160,
};

const dropItem = {
  padding: "12px 16px",
  cursor: "pointer",
  borderBottom: "1px solid #f1f1f1",
};

export default Navbar;
