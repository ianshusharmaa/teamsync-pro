import React, { useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../api";
import { useNavigate } from "react-router-dom";

function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!otp.trim()) {
      Swal.fire("Error", "OTP required", "error");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        Swal.fire("Success", "Account verified", "success");
        navigate("/app"); // ✅ REDIRECT
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch {
      Swal.fire("Error", "Server error", "error");
    }
  };

  return (
    <div className="container mt-5">
      <h3>Verify OTP</h3>

      <input
        className="form-control mb-3"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button className="btn btn-primary" onClick={handleVerify}>
        Verify
      </button>
    </div>
  );
}

export default VerifyEmail;
