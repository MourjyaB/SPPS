import React, { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Test() {
  const navigate = useNavigate();

  // 🔁 Reusable auth check
 const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("token_expiry");

    if (!token) {
      alert("Please login first");
      navigate("/");
      return false;
    }

    if (Date.now() > expiry) {
      localStorage.removeItem("token");
      localStorage.removeItem("token_expiry");
      alert("Session expired");
      navigate("/");
      return false;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("token_expiry");
        alert("Session expired");
        navigate("/");
        return false;
      }

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, [navigate]);

  // ✅ Still check on page load (optional)
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 🔥 Handle button click with auth check
  const handleStartTest = async () => {
    const isValid = await checkAuth();
    if (isValid) {
      navigate("/exam");
    }
  };

  return (
    <div className="container">
      <div className="form">
        <h2>Test Page</h2>

        <button onClick={handleStartTest}>
          START TEST
        </button>

        <button onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default Test;