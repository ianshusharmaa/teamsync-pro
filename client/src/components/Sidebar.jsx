import React from "react";

function Sidebar({ activeItem, onSelect }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "calendar", label: "Calendar", icon: "📅" },
    { id: "worklogs", label: "Work Logs", icon: "📝" },
    { id: "tasks", label: "Tasks", icon: "🗂️" },
    { id: "notices", label: "Notices", icon: "📢" },
    { id: "members", label: "Members", icon: "👥" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <aside className="ts-sidebar">
      <div className="ts-sidebar-section-title">Menu</div>

      <ul className="ts-nav-list">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={
              "ts-nav-item " + (activeItem === item.id ? "active" : "")
            }
            onClick={() => onSelect && onSelect(item.id)}
          >
            <span className="ts-icon">{item.icon}</span>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
