import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./studentDashboard.css";

function StudentDashboard() {
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

  const recentTests = [
    "Mathematics Quiz",
    "Physics Unit Test",
    "Chemistry Assessment"
  ];

  return (
    <div className="dashboard-page">

      <nav className="navbar">
        <div className="logo">
          SPPA
        </div>

        <div className="user-info">
          Student Dashboard
        </div>
      </nav>

      <div className="hero">
        <h1>Student Dashboard</h1>

        <p>
          Track your academic performance
          and upcoming assessments.
        </p>
      </div>

      <div className="stats-grid">

        <div className="home-card">
          <h3>Tests Taken</h3>
          <h1>18</h1>
        </div>

        <div className="home-card">
          <h3>Average Score</h3>
          <h1>82%</h1>
        </div>

        <div className="home-card">
          <h3>Completed Exams</h3>
          <h1>12</h1>
        </div>

        <div className="home-card">
          <h3>Rank</h3>
          <h1>#5</h1>
        </div>

      </div>

      <div className="section">

        <h2>Recent Tests</h2>

        {recentTests.map((test, index) => (
          <div className="activity-item" key={index}>
            ✓ {test}
          </div>
        ))}

      </div>

    </div>
  );
}

export default StudentDashboard;