import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  // state
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // user data
  const user = JSON.parse(localStorage.getItem("user"));

  // logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <div
      style={{
        height: "60px",
        background: "linear-gradient(90deg,#2563EB,#1E40AF)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
        color: "white",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
      }}
    >
      {/* app name */}
      <h4 style={{ margin: 0, fontWeight: 600 }}>TeamSync Pro</h4>

      {/* user menu */}
      <div style={{ position: "relative" }}>
        <div
          onClick={() => setOpen(!open)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
            background: "rgba(255,255,255,0.15)",
            padding: "8px 14px",
            borderRadius: "30px",
            transition: "0.3s",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "#DBEAFE",
              color: "#1E40AF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
            }}
          >
            {user?.fullName?.charAt(0) || "U"}
          </div>

          <span style={{ fontSize: 14 }}>{user?.fullName}</span>
        </div>

        {/* dropdown */}
        {open && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "50px",
              width: "200px",
              background: "white",
              color: "#111827",
              borderRadius: "10px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              overflow: "hidden",
              animation: "fadeIn 0.2s ease",
            }}
          >
            <div style={{ padding: "12px", borderBottom: "1px solid #E5E7EB" }}>
              <b>{user?.fullName}</b>
              <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
                {user?.email}
              </p>
            </div>

            <div
              onClick={() => {
                setOpen(false);
                navigate("/app/settings");
              }}
              style={menuItem}
            >
              ⚙️ Settings
            </div>

            <div
              onClick={handleLogout}
              style={{ ...menuItem, color: "#DC2626" }}
            >
              🚪 Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// menu item style
const menuItem = {
  padding: "12px 16px",
  cursor: "pointer",
  transition: "0.2s",
  fontSize: 14,
};

export default Navbar;
