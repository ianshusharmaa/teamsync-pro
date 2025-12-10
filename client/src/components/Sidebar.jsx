import React from "react";

function Sidebar({ activeItem, onSelect }) {
  const items = [
    { id: "dashboard", label: "Dashboard" },
    { id: "calendar", label: "Calendar" },
    { id: "admin", label: "Team Admin" },
    { id: "teamDetails", label: "Team Details" },
    { id: "chat", label: "Team Chat" },
    { id: "worklog", label: "Work Logs" },
  ];

  return (
    <div
      style={{
        width: "230px",
        background: "#F9FAFB",
        borderRight: "1px solid #E5E7EB",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h3 style={{ marginBottom: "20px", color: "#2563EB" }}>TeamSync Pro</h3>

      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelect(item.id)}
          style={{
            padding: "12px 16px",
            cursor: "pointer",
            borderRadius: "8px",
            marginBottom: "10px",
            background: activeItem === item.id ? "#2563EB" : "transparent",
            color: activeItem === item.id ? "white" : "#374151",
            fontWeight: activeItem === item.id ? "600" : "500",
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
