import React from "react";
import Swal from "sweetalert2";

function Signup() {
  const handleSignup = () => {
    const name = document.querySelector("#signup-name").value.trim();
    const email = document.querySelector("#signup-email").value.trim();
    const pass = document.querySelector("#signup-pass").value.trim();
    const terms = document.querySelector("#signup-terms").checked;

    if (!name || !email || !pass) {
      Swal.fire({
        icon: "warning",
        title: "Missing Details",
        text: "Please fill all fields before continuing.",
        confirmButtonColor: "#4c6ef5",
      });
      return;
    }

    if (!terms) {
      Swal.fire({
        icon: "info",
        title: "Accept Terms",
        text: "You must accept the Terms & Conditions and Privacy Policy.",
        confirmButtonColor: "#4c6ef5",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Account Created!",
      text: "Welcome to TeamSync Pro.",
      confirmButtonColor: "#4c6ef5",
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-light)",
        padding: "20px",
      }}
    >
      <div
        className="ts-card"
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "32px",
          borderRadius: "20px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 25 }}>
          <div className="ts-logo" style={{ justifyContent: "center" }}>
            <div className="ts-logo-mark">TS</div>
            <span>TeamSync Pro</span>
          </div>
          <p style={{ marginTop: 10, color: "var(--text-muted)" }}>
            Create your account
          </p>
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 14, fontWeight: 500 }}>Full Name</label>
          <input
            id="signup-name"
            type="text"
            className="form-control"
            placeholder="Enter your name"
            style={{ marginTop: 6 }}
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 14, fontWeight: 500 }}>Email</label>
          <input
            id="signup-email"
            type="email"
            className="form-control"
            placeholder="Enter your email"
            style={{ marginTop: 6 }}
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 14, fontWeight: 500 }}>Password</label>
          <input
            id="signup-pass"
            type="password"
            className="form-control"
            placeholder="Choose a password"
            style={{ marginTop: 6 }}
          />
        </div>

        <div style={{ marginBottom: 20, display: "flex", gap: 8 }}>
          <input id="signup-terms" type="checkbox" />
          <label style={{ fontSize: 14 }}>
            I accept the{" "}
            <span
              style={{ color: "var(--primary)", cursor: "pointer" }}
              onClick={() => (window.location.href = "/terms")}
            >
              Terms & Conditions
            </span>{" "}
            and{" "}
            <span
              style={{ color: "var(--primary)", cursor: "pointer" }}
              onClick={() => (window.location.href = "/privacy")}
            >
              Privacy Policy
            </span>
          </label>
        </div>

        <button className="btn btn-primary w-100" onClick={handleSignup}>
          Create Account
        </button>

        <p
          style={{
            marginTop: 15,
            textAlign: "center",
            fontSize: 14,
            color: "var(--text-muted)",
          }}
        >
          Already have an account?{" "}
          <span
            style={{ color: "var(--primary)", cursor: "pointer" }}
            onClick={() => (window.location.href = "/")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
