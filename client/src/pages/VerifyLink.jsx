import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../api";

export default function VerifyLink() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function verifyNow() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/verify-link/${token}`);
        const data = await res.json();

        if (data.success) {
          Swal.fire("Verified!", "Email verified by link.", "success");
          navigate("/");
        } else {
          Swal.fire("Error", data.message, "error");
          navigate("/verify-email");
        }
      } catch (err) {
        Swal.fire("Error", "Server error", "error");
      }
    }

    verifyNow();
  }, [token, navigate]);

  return (
    <div className="container text-center mt-5">
      <h3>Verifying… Please wait</h3>
    </div>
  );
}
