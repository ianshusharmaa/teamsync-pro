import React from "react";

function Dashboard() {
  return (
    <div>
      <h1 className="ts-page-title">Dashboard</h1>
      <p className="ts-page-subtitle">Overview of your team's activity.</p>

      <div className="ts-card" style={{ marginTop: 20 }}>
        <h2 style={{ fontFamily: "Poppins", fontSize: 18, marginBottom: 10 }}>
          Welcome, Anshu 👋
        </h2>
        <p style={{ fontSize: 14, color: "#6b7280" }}>
          Your dashboard will show recent work logs, tasks, and notices.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
