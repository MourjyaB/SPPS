import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

function StudentDashboard() {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);

  // Session Check
  useEffect(() => {
    const interval = setInterval(() => {
      const expiry = localStorage.getItem("token_expiry");

      if (expiry && Date.now() > Number(expiry)) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("token_expiry");
        navigate("/login");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  // Fetch Dashboard Data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/students/overall_results`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log("Dashboard Data:", data);

        setDashboardData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDashboard();
  }, []);

  const difficultyText = (current_difficulty) => {
    if (current_difficulty === "E") return "Easy";
    if (current_difficulty === "M") return "Moderate";
    if (current_difficulty === "D") return "Difficult";
    return "-";
  };

  const chartData =
    dashboardData?.recent_scores?.map((score, index) => ({
      test: `Test ${index + 1}`,
      score,
    })) || [];

  const status =
    dashboardData?.average_score >= 80
      ? "Excellent"
      : dashboardData?.average_score >= 60
      ? "Good"
      : "Needs Improvement";

  return (
    <Layout>
      <div className="dashboard-page">

        <div className="hero">
          <h1 style={{ color: "white" }}>Student Dashboard</h1>

          <p style={{ color: "white" }}>
            Track your academic performance and prediction analysis.
          </p>
        </div>

        {/* Statistics Cards */}

        <div className="stats-grid">

          <div className="home-card">
            <h3>Average Score</h3>
            <h1>{dashboardData?.average_score || 0}%</h1>
          </div>

          <div className="home-card">
            <h3>Difficulty</h3>
            <h1>{difficultyText(dashboardData?.current_difficulty || "-")}</h1>
          </div>

          <div className="home-card">
            <h3>Predicted Score</h3>
            <h1>
              {dashboardData?.predicted_next_score
                ? dashboardData.predicted_next_score.toFixed(2)
                : 0}
              %
            </h1>
          </div>

          <div className="home-card">
            <h3>Status</h3>
            <h1>{status}</h1>
          </div>

        </div>

        {/* Performance Graph */}

        <div className="section">

          <h2>Performance Trend</h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <LineChart data={chartData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="test" />

              <YAxis domain={[0,100]}/>

              <Tooltip />

              <Line
                type="monotone"
                dataKey="score"
                stroke="#14532d"
                strokeWidth={3}
              />

            </LineChart>
          </ResponsiveContainer>

        </div>

      </div>
    </Layout>
  );
}

export default StudentDashboard;