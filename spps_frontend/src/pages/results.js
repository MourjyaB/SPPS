import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";

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

  const result = JSON.parse(
    localStorage.getItem("latest_result")
  );

  if (!result) {
    return (
      <div className="dashboard-page">
        <div className="hero">
          <h1>Results</h1>
          <p>No test result available.</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
    <div className="dashboard-page">

      <div className="hero">
        <h1 style={{ color: "white" }}>Exam Analysis</h1>
        <p style={{ color: "white" }}>Your latest assessment summary</p>
      </div>

      <div className="stats-grid">

        <div className="home-card">
          <h3>Score</h3>
          <h1>
            {result.score}/{result.total_questions}
          </h1>
        </div>

        <div className="home-card">
          <h3>Percentage</h3>
          <h1>{result.percentage}%</h1>
        </div>

      </div>

      <div className="section">

        <h2 style={{ color: "#1B4332" }}>Review Wrong Answers</h2>

        {result.wrong_answers.length === 0 ? (
          <div className="activity-item">
             Perfect Score! No wrong answers.
          </div>
        ) : (
          result.wrong_answers.map((item, index) => (
            <div
              key={index}
              className="activity-item"
              style={{ marginBottom: "15px" }}
            >
              <p>
                <strong>Question:</strong>
                {" "}
                {item.question}
              </p>

              <p>
                <strong>Your Answer:</strong>
                {" "}
                {item.selected_option}
              </p>

              <p>
                <strong>Correct Answer:</strong>
                {" "}
                {item.correct_option}
              </p>

              <p>
                <strong>Explanation:</strong>
                {" "}
                {item.explanation}
              </p>
            </div>
          ))
        )}

      </div>

    </div>
    </Layout>
  );
}

export default Results;