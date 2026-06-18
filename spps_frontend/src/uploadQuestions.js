import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./pages.css";

function UploadQuestions() {
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
    <div className="page">

      <div className="hero">
        <h1>Upload Question Papers</h1>
        <p>
          Upload PDF files for automatic question extraction.
        </p>
      </div>

      <div className="section">

        <h2>Select PDF</h2>

        <input
          type="file"
          accept=".pdf"
        />

        <button>
          Upload PDF
        </button>

      </div>

    </div>
  );
}

export default UploadQuestions;