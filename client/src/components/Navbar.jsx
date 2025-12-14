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
      cancelButtonText: "Cancel",
    }).then((res) => {
      if (res.isConfirmed) {
        localStorage.clear();
        window.location.href = "/";
      }
    });
  };

  return (
    <div
      style={{
        height: "60px",
        background: "#ffffff",
        borderBottom: "1px solid #E5E7EB",
        padding: "0 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* app name */}
      <h4 style={{ margin: 0, color: "#2563EB", fontWeight: 700 }}>
        TeamSync Pro
      </h4>

      {/* user dropdown */}
      <div style={{ position: "relative" }}>
        <div
          onClick={() => setOpen(!open)}
          style={{
            cursor: "pointer",
            fontWeight: 600,
            color: "#374151",
          }}
        >
          Logged in as {user?.fullName || "User"} ⌄
        </div>

        {open && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "40px",
              width: "200px",
              background: "#ffffff",
              border: "1px solid #E5E7EB",
              borderRadius: "10px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              overflow: "hidden",
              zIndex: 10,
            }}
          >
            <div
              style={{
                padding: "12px 16px",
                cursor: "pointer",
                borderBottom: "1px solid #E5E7EB",
              }}
              onClick={() =>
                Swal.fire("Settings", "Settings page coming soon", "info")
              }
            >
              ⚙ Settings
            </div>

            <div
              style={{
                padding: "12px 16px",
                cursor: "pointer",
                color: "#DC2626",
                fontWeight: 600,
              }}
              onClick={handleLogout}
            >
              🚪 Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
