import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";

function Test() {
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("token_expiry");

    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return false;
    }

    if (expiry && Date.now() > Number(expiry)) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("token_expiry");

      alert("Session expired. Please login again.");
      navigate("/login");
      return false;
    }

    return true;
  };

  const handleStartTest = async () => {
    const isValid = await checkAuth();

    if (!isValid) return;

    if (!subject) {
      alert("Please select a subject.");
      return;
    }

    const confirmStart = window.confirm(
      `Start Assessment?\n\nSubject: ${subject}\n\n• 10 Questions\n• 5 Minutes\n• Adaptive Difficulty`
    );

    if (!confirmStart) return;

    navigate(`/exam?subject=${encodeURIComponent(subject)}`);
  };

  return (
    <Layout>
      <div className="test-page">

        <div className="test-hero">
          <h1>Assessment</h1>

          <p>
            Take an adaptive assessment designed to evaluate your current
            academic performance and predict future outcomes.
          </p>
        </div>

        <div className="test-card">

          <h2>Assessment Details</h2>

          <div className="info-grid">

            <div className="info-card">
              <h4>Questions</h4>
              <p>10</p>
            </div>

            <div className="info-card">
              <h4>Duration</h4>
              <p>5 Minutes</p>
            </div>

            <div className="info-card">
              <h4>Difficulty</h4>
              <p>Adaptive</p>
            </div>

          </div>

          <div className="subject-section">
          <h3>Select Subject</h3>

          <select value={subject} onChange={(e) => setSubject(e.target.value)}
          className="subject-select" >
            <option value="">Choose Subject</option>
            <option value="C Programming">C Programming</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Computer Networks">Computer Networks</option>
            <option value="Data Interpretation">Data Interpretation</option>
            <option value="DSA">DSA</option>
            <option value="English">English</option>
            <option value="Logical Reasoning">Logical Reasoning</option>
            <option value="Maths">Maths</option>
            <option value="Oops">Oops</option>
            <option value="Physics">Physics</option>
            <option value="Python">Python</option>
            </select>
        </div>

          <h2 style={{ marginTop: "35px" }}>Instructions</h2>

          <ul className="instructions">
            <li>The difficulty level will be selected automatically based on the assessment criteria.</li>
            <li>Read each question carefully before selecting your answer.</li>
            <li>You may navigate between questions before submitting the assessment.</li>
            <li>The assessment will be submitted automatically once the timer expires.</li>
            <li>Your result will be displayed immediately after successful submission.</li>
            <li>Correct answers and explanations will be provided for all incorrect or unattempted questions.</li>
          </ul>

          <button
            className="start-test-btn"
            onClick={handleStartTest}
          >
            Start Assessment →
          </button>

        </div>

      </div>
    </Layout>
  );
}

export default Test;