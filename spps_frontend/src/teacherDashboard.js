import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./teacherDashboard.css";

function TeacherDashboard() {
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

  const recentActivity = [
    "Physics Unit 1 uploaded",
    "Math Midterm uploaded",
    "Science Quiz created",
    "Question Bank updated",
  ];

  const quickStats = {
    averageScore: "78%",
    subject: "Mathematics",
    questionsWeek: 52,
  };

  return (
    <div className="dashboard-page">

      <nav className="navbar">
        <div className="logo">
          SPPA
        </div>

        <div className="user-info">
          Teacher Dashboard
        </div>
      </nav>

      <div className="hero">
        <h1>Teacher Dashboard</h1>

        <p>
          Overview of uploaded content, assessments,
          and classroom activity.
        </p>
      </div>

      <div className="stats-grid">

        <div className="home-card">
          <h3>PDFs Uploaded</h3>
          <h1>12</h1>
        </div>

        <div className="home-card">
          <h3>Questions Stored</h3>
          <h1>480</h1>
        </div>

        <div className="home-card">
          <h3>Tests Created</h3>
          <h1>15</h1>
        </div>

        <div className="home-card">
          <h3>Students Assigned</h3>
          <h1>120</h1>
        </div>

      </div>

      <div className="section">

        <h2>Recent Activity</h2>

        {recentActivity.map((item, index) => (
          <div className="activity-item" key={index}>
            ✓ {item}
          </div>
        ))}

      </div>

      <div className="section">

        <h2>Quick Stats</h2>

        <div className="quick-stat">
          <strong>Average Test Score:</strong>{" "}
          {quickStats.averageScore}
        </div>

        <div className="quick-stat">
          <strong>Most Used Subject:</strong>{" "}
          {quickStats.subject}
        </div>

        <div className="quick-stat">
          <strong>Questions Added This Week:</strong>{" "}
          {quickStats.questionsWeek}
        </div>

      </div>

    </div>
  );
}

export default TeacherDashboard;