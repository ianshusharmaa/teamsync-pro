
import React from 'react';

const Navbar = () => {
  return (
    <header className="ts-navbar">
      <div className="ts-logo">
        <div className="ts-logo-mark">TS</div>
        <span>TeamSync Pro</span>
      </div>

      <div className="ts-nav-right">
        <span style={{ fontSize: 13, color: '#6b7280' }}>
          Logged in as <strong>Anshu Sharma</strong>
        </span>
        <div className="ts-avatar">A</div>
      </div>
    </header>
  );
};

export default Navbar;
