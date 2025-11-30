import React from "react";

function Privacy() {
  return (
    <div style={{ padding: "40px" }}>
      <h1 className="ts-page-title">Privacy Policy</h1>
      <p className="ts-page-subtitle">Last updated: Today</p>

      <div className="ts-card" style={{ marginTop: 20 }}>
        <p style={{ fontSize: 15, lineHeight: "24px" }}>
          TeamSync Pro values your privacy. We collect only essential
          information such as name, email, and team activity required to run
          this platform.
          <br /><br />
          We do not sell or share your personal information with third parties.
          Your data is securely stored and used only for improving team
          productivity and collaboration.
          <br /><br />
          By using TeamSync Pro, you consent to the data practices described in
          this Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default Privacy;
