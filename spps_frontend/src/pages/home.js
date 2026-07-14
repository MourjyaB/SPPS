import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChartLine,
  FaClipboardCheck,
  FaChartBar,
  FaChalkboardTeacher
} from "react-icons/fa";
import "./App.css";

function Home() {
  const navigate = useNavigate();
  return (

    <div className="landing-page">
      <div className="overlay"></div>
      <div className="landing-content">
        <h1> Student Performance
          <br />
          Prediction System
        </h1>


        <p className="tagline">
          Predict • Analyze • Improve
        </p>

        <div className="home-buttons">

          <button
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="register-btn"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>

        <div className="feature-row">

          <div className="feature-item">
            <FaChartLine />
            <span>Performance Prediction</span>
          </div>

          <div className="feature-item">
            <FaClipboardCheck />
            <span>Adaptive Tests</span>
          </div>

          <div className="feature-item">
            <FaChartBar />
            <span>Interactive Analytics</span>
          </div>

          <div className="feature-item">
            <FaChalkboardTeacher />
            <span>Teacher Dashboard</span>
          </div>

        </div>

      </div>

    </div>

  );

}

export default Home;