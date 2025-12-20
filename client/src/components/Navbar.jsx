import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [openProfile, setOpenProfile] = useState(false);
  const [openNotify, setOpenNotify] = useState(false);
  const profileRef = useRef(null);
  const notifyRef = useRef(null);

  // dummy notifications for UI
  const notifications = [
    { id: 1, text: "New team notice posted" },
    { id: 2, text: "Work log submitted by member" },
  ];

  // close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setOpenProfile(false);
      }
      if (
        notifyRef.current &&
        !notifyRef.current.contains(e.target)
      ) {
        setOpenNotify(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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

      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        {/* notification bell */}
        <div ref={notifyRef} style={{ position: "relative" }}>
          <div
            style={bell}
            onClick={() => {
              setOpenNotify(!openNotify);
              setOpenProfile(false);
            }}
          >
            🔔
            {notifications.length > 0 && (
              <span style={badge}>{notifications.length}</span>
            )}
          </div>

          {openNotify && (
            <div style={dropdown}>
              <div style={dropHeader}>Notifications</div>
              {notifications.length === 0 ? (
                <div style={dropItem}>No notifications</div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} style={dropItem}>
                    {n.text}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* profile dropdown */}
        <div ref={profileRef} style={{ position: "relative" }}>
          <div
            style={profileBtn}
            onClick={() => {
              setOpenProfile(!openProfile);
              setOpenNotify(false);
            }}
          >
            <div style={avatar}>{user?.fullName?.[0]}</div>
            <span>{user?.fullName}</span>
          </div>

          {openProfile && (
            <div style={dropdown}>
              <div style={profileInfo}>
                <b>{user?.fullName}</b>
                <small>{user?.email}</small>
              </div>

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

const bell = {
  fontSize: 20,
  cursor: "pointer",
  position: "relative",
};

const badge = {
  position: "absolute",
  top: -6,
  right: -6,
  background: "red",
  color: "white",
  borderRadius: "50%",
  fontSize: 10,
  padding: "2px 5px",
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
  borderRadius: 12,
  boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
  minWidth: 220,
  overflow: "hidden",
  zIndex: 100,
};

const dropHeader = {
  padding: "12px 16px",
  fontWeight: 600,
  borderBottom: "1px solid #eee",
};

const profileInfo = {
  padding: "12px 16px",
  borderBottom: "1px solid #eee",
  display: "flex",
  flexDirection: "column",
};

const dropItem = {
  padding: "12px 16px",
  cursor: "pointer",
};

export default Navbar;
