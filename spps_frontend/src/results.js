import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./studentDashboard.css";

function Results() {
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
        <h1>Results</h1>
        <p>View your previous test scores.</p>
      </div>

      <div className="section">

        <div className="activity-item">
          Mathematics Quiz — 85%
        </div>

        <div className="activity-item">
          Physics Test — 78%
        </div>

        <div className="activity-item">
          Chemistry Test — 91%
        </div>

      </div>

    </div>
  );
}

export default Results;