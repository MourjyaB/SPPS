import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./pages.css";

function Analytics() {
    const navigate = useNavigate();

    useEffect(() => {
  const interval = setInterval(() => {
    const expiry = localStorage.getItem("token_expiry");

    if (expiry && Date.now() > Number(expiry)) {
      alert("Session expired. Please login again.");

      localStorage.clear();
      navigate("/login");
    }
  }, 1000);

  return () => clearInterval(interval);
}, [navigate]);

  return (
    <div className="page">

      <div className="hero">
        <h1>Analytics</h1>
        <p>
          Student performance insights.
        </p>
      </div>

      <div className="card-container">

        <div className="home-card">
          <h2>Students</h2>
          <h1>150</h1>
        </div>

        <div className="home-card">
          <h2>Average Marks</h2>
          <h1>78%</h1>
        </div>

        <div className="home-card">
          <h2>Predicted Success</h2>
          <h1>82%</h1>
        </div>

      </div>

    </div>
  );
}

export default Analytics;