import React from "react";

function Sidebar({ activeItem, onSelect }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "calendar", label: "Calendar" },
    { id: "admin", label: "Team Admin" },
  ];

  return (
    <aside
      className="ts-sidebar d-flex flex-column"
      style={{
        width: "240px",
        borderRight: "1px solid #e5e7eb",
        padding: "16px",
        background: "#f9fafb",
      }}
    >
      <h4
        style={{
          fontSize: 18,
          fontWeight: 600,
          marginBottom: 20,
          paddingLeft: 4,
        }}
      >
        TeamSync Pro
      </h4>

      <nav className="nav flex-column">
        {menuItems.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              className="btn text-start mb-2"
              onClick={() => onSelect(item.id)}
              style={{
                width: "100%",
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                background: isActive ? "#2563eb" : "transparent",
                color: isActive ? "#ffffff" : "#111827",
                borderRadius: 8,
                padding: "8px 12px",
                border: "none",
              }}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
