import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./pages.css";

function TeacherProfile() {
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
        <h1>Profile</h1>
        <p>
          Teacher account details.
        </p>
      </div>

      <div className="section">

        <h3>Name</h3>
        <p>Teacher Name</p>

        <h3>Email</h3>
        <p>teacher@email.com</p>

        <h3>Role</h3>
        <p>Teacher</p>

      </div>

    </div>
  );
}

export default TeacherProfile;