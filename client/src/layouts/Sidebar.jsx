import React from "react";

function Sidebar({ activeItem, onSelect }) {
  // sidebar buttons
  const items = [
    { id: "dashboard", label: "Dashboard" },
    { id: "calendar", label: "Calendar" },
    { id: "admin", label: "Admin Panel" },
    { id: "worklog", label: "Work Log" },
    { id: "teamDetails", label: "Team Details" },
  ];

  return (
    <div
      className="sidebar"
      style={{
        width: "240px",
        background: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        padding: "20px",
      }}
    >
      <h4 style={{ marginBottom: "20px", fontWeight: "600" }}>TeamSync Pro</h4>

      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelect(item.id)}
          style={{
            padding: "12px 15px",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "10px",
            background:
              activeItem === item.id ? "#2563eb" : "transparent",
            color: activeItem === item.id ? "#fff" : "#374151",
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
