import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./teacherHome.css";

import {
  FaChartBar,
  FaFileUpload,
  FaBook,
  FaUser,
  FaSignOutAlt
} from "react-icons/fa";

function TeacherHome() {
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
  <div className="teacher-home">

    <nav className="navbar">
      <div className="logo">
        SPPA
      </div>

      <div className="user-info">
        Teacher Portal
      </div>
    </nav>

    <div className="hero">
      <h1>Welcome Back, Teacher 👋</h1>

      <p>
        Manage question papers, monitor student performance,
        and create assessments from one place.
      </p>
    </div>

    <div className="card-container">

  <div
    className="home-card"
    onClick={() => navigate("/teacher-dashboard")}
  >
    <FaChartBar className="icon" />
    <h2>Dashboard</h2>
    <p>View statistics and activity</p>
  </div>

  <div
    className="home-card"
    onClick={() => navigate("/upload-questions")}
  >
    <FaFileUpload className="icon" />
    <h2>Upload Questions</h2>
    <p>Upload PDF question papers</p>
  </div>

  <div
    className="home-card"
    onClick={() => navigate("/question-bank")}
  >
    <FaBook className="icon" />
    <h2>Question Bank</h2>
    <p>Manage uploaded questions</p>
  </div>

  <div
    className="home-card"
    onClick={() => navigate("/analytics")}
  >
    <FaChartBar className="icon" />
    <h2>Analytics</h2>
    <p>Analyze student performance</p>
  </div>

  <div
    className="home-card"
    onClick={() => navigate("/teacher-profile")}
  >
    <FaUser className="icon" />
    <h2>Profile</h2>
    <p>View account details</p>
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

export default TeacherHome;