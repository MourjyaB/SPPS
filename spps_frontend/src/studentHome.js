import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./studentHome.css";

import {
  FaClipboardCheck,
  FaChartLine,
  FaTrophy,
  FaUser,
  FaSignOutAlt,
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
    <div className="student-home">

      <h1>Student Portal</h1>

      <p>Welcome Back!</p>

      <div className="card-container">

  <div
    className="home-card"
    onClick={() => navigate("/student-dashboard")}
  >
    <FaChartBar className="icon" />
    <h2>Dashboard</h2>
    <p>View academic overview</p>
  </div>

  <div
    className="home-card"
    onClick={() => navigate("/test")}
  >
    <FaClipboardCheck className="icon" />
    <h2>Take Test</h2>
    <p>Attempt available assessments</p>
  </div>

  <div
    className="home-card"
    onClick={() => navigate("/results")}
  >
    <FaTrophy className="icon" />
    <h2>Results</h2>
    <p>View previous test scores</p>
  </div>

  <div
    className="home-card"
    onClick={() => navigate("/performance")}
  >
    <FaChartLine className="icon" />
    <h2>Performance</h2>
    <p>Track academic progress</p>
  </div>

  <div
    className="home-card"
    onClick={() => navigate("/student-profile")}
  >
    <FaUser className="icon" />
    <h2>Profile</h2>
    <p>Manage account details</p>
  </div>

  <div
    className="home-card"
    onClick={() => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login");
    }}
  >
    <FaSignOutAlt className="icon" />
    <h2>Logout</h2>
    <p>Sign out securely</p>
  </div>

</div>

    </div>
  );
}

export default StudentHome;