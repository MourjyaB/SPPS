import React, { useEffect } from "react";
import Layout from "../components/layout";
import { useNavigate } from "react-router-dom";

import {
  FaFileUpload,
  FaUsers,
  FaChartBar,
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
    <Layout>

      <div className="student-home">

        <div className="hero-section">

          <h1>Welcome Back!</h1>

          <p>
            Student Performance Prediction System
          </p>

          <span>
            Manage • Analyze • Guide
          </span>

        </div>

        <div className="card-container teacher-card-container">

  <div
    className="home-card teacher-card"
    onClick={() => navigate("/upload-questions")}
  >
    <FaFileUpload className="card-icon" />
    <h2>Upload Questions</h2>
    <p>
      Upload PDF question papers for automatic question extraction.
    </p>
  </div>

  <div
    className="home-card teacher-card"
    onClick={() => navigate("/find-student")}
  >
    <FaUsers className="card-icon" />
    <h2>Find Students</h2>
    <p>
      Search students using their Username, Email or Student ID.
    </p>
  </div>

  <div
    className="home-card teacher-card"
    onClick={() => navigate("/student-report")}
  >
    <FaChartBar className="card-icon" />
    <h2>Student Reports</h2>
    <p>
      View detailed academic reports, predictions and performance analytics.
    </p>
  </div>

</div>

      </div>

    </Layout>
  );
}

export default TeacherHome;