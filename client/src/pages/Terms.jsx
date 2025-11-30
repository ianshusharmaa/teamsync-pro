import React from "react";

function Terms() {
  return (
    <div style={{ padding: "40px" }}>
      <h1 className="ts-page-title">Terms & Conditions</h1>
      <p className="ts-page-subtitle">Last updated: Today</p>

      <div className="ts-card" style={{ marginTop: 20 }}>
        <p style={{ fontSize: 15, lineHeight: "24px" }}>
          These Terms & Conditions govern your use of the TeamSync Pro
          application. By creating an account or using this platform, you agree
          to follow all rules, policies, and conditions listed here. 
          <br /><br />
          You must not misuse the platform, attempt unauthorized access, share
          harmful content, or violate privacy of other team members.
          <br /><br />
          By continuing to use TeamSync Pro, you confirm that you accept these
          Terms fully.
        </p>
      </div>
    </div>
  );
}

export default Terms;
