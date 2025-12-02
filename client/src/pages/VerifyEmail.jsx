import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api";

export default function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire("Verified!", "Email verified successfully.", "success");
        navigate("/");
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (err) {
      Swal.fire("Error", "Server error", "error");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="text-center mb-4">Verify Email (OTP)</h2>

      <form onSubmit={handleVerifyOtp}>
        <input
          className="form-control mb-3"
          placeholder="Enter Registered Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="form-control mb-3"
          placeholder="Enter OTP"
          onChange={(e) => setOtp(e.target.value)}
        />

        <button className="btn btn-success w-100">Verify OTP</button>
      </form>
    </div>
  );
}
