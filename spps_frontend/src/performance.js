import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./studentDashboard.css";

function Performance() {
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
    <div className="dashboard-page">

      <div className="hero">
        <h1>Performance Analysis</h1>
        <p>
          Academic progress and prediction insights.
        </p>
      </div>

      <div className="stats-grid">

        <div className="home-card">
          <h3>Average Marks</h3>
          <h1>82%</h1>
        </div>

        <div className="home-card">
          <h3>Predicted Success</h3>
          <h1>88%</h1>
        </div>

      </div>

    </div>
  );
}

export default Performance;