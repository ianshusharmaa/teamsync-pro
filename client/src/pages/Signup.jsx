import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !password) {
      return Swal.fire("Missing Details", "Please fill all fields.", "warning");
    }

    if (!acceptTerms) {
      return Swal.fire(
        "Terms Required",
        "Please accept Terms & Conditions.",
        "warning"
      );
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await response.json();

      console.log("Signup response:", data);

      if (data.success) {
        Swal.fire("Success", data.message, "success");
        navigate("/verify-email");
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      console.error("Signup error:", error);
      Swal.fire("Server Error", "Something went wrong!", "error");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="text-center mb-4">Create Account</h2>

      <form onSubmit={handleSignup}>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
          />

          <label className="form-check-label">
            I accept the{" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => navigate("/terms")}
            >
              Terms & Conditions
            </span>{" "}
            and{" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => navigate("/privacy")}
            >
              Privacy Policy
            </span>
          </label>
        </div>

        <button className="btn btn-primary w-100">Create Account</button>
      </form>
    </div>
  );
}
