import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./pages.css";

function QuestionBank() {
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

  const pdfs = [
    "Physics Unit 1.pdf",
    "Math Midterm.pdf",
    "Chemistry Final.pdf"
  ];

  return (
    <div className="page">

      <div className="hero">
        <h1>Question Bank</h1>
        <p>
          Manage uploaded question papers.
        </p>
      </div>

      <div className="section">

        {pdfs.map((pdf, index) => (
          <div
            className="pdf-card"
            key={index}
          >
            {pdf}
          </div>
        ))}

      </div>

    </div>
  );
}

export default QuestionBank;