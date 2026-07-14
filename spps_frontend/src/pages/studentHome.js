import React, { useEffect } from "react";
import Layout from "../components/layout";
import { useNavigate } from "react-router-dom";

import {
  FaClipboardCheck,
  FaChartLine,
  FaTrophy,
  FaChartBar
} from "react-icons/fa";

function StudentHome() {
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
  <Layout>

    <div className="student-home">

      <div className="hero-section">
        <h1>Welcome Back!</h1>

        <p>
          Student Performance Prediction System
        </p>

        <span>
          Track • Analyze • Improve
        </span>
      </div>

      <div className="card-container">

        <div
          className="home-card"
          onClick={() => navigate("/student-dashboard")}
        >
          <FaChartBar className="card-icon" />
          <h2>Dashboard</h2>
          <p>View academic overview & predictions</p>
        </div>

        <div
          className="home-card"
          onClick={() => navigate("/test")}
        >
          <FaClipboardCheck className="card-icon" />
          <h2>Take Test</h2>
          <p>Attempt available assessments</p>
        </div>

        <div
          className="home-card"
          onClick={() => navigate("/results")}
        >
          <FaTrophy className="card-icon" />
          <h2>Exam Analysis</h2>
          <p>View latest test results</p>
        </div>

        <div
          className="home-card"
          onClick={() => navigate("/performance")}
        >
          <FaChartLine className="card-icon" />
          <h2>Performance Analytics</h2>
          <p>Subject-wise performance analysis</p>
        </div>
      </div>

    </div>

  </Layout>
);
}

export default StudentHome;