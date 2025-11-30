import React from "react";
import Swal from "sweetalert2";

function Login() {
  const handleLogin = () => {
    const email = document.querySelector("#login-email").value.trim();
    const pass = document.querySelector("#login-pass").value.trim();

    if (!email || !pass) {
      Swal.fire({
        icon: "warning",
        title: "Missing Details",
        text: "Please enter your email and password.",
        confirmButtonColor: "#4c6ef5",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Login Successful",
      text: "Welcome back!",
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
            Login to continue
          </p>
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 14, fontWeight: 500 }}>Email</label>
          <input
            id="login-email"
            type="email"
            className="form-control"
            placeholder="Enter your email"
            style={{ marginTop: 6 }}
          />
        </div>

        <div style={{ marginBottom: 22 }}>
          <label style={{ fontSize: 14, fontWeight: 500 }}>Password</label>
          <input
            id="login-pass"
            type="password"
            className="form-control"
            placeholder="Enter password"
            style={{ marginTop: 6 }}
          />
        </div>

        <button className="btn btn-primary w-100" onClick={handleLogin}>
          Login
        </button>

        <p
          style={{
            marginTop: 15,
            textAlign: "center",
            fontSize: 14,
            color: "var(--text-muted)",
          }}
        >
          Don't have an account?{" "}
          <span
            style={{ color: "var(--primary)", cursor: "pointer" }}
            onClick={() => (window.location.href = "/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
