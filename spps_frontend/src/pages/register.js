import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student"
  });

  const [errors, setErrors] = useState({});

  // Auto-generate username
  useEffect(() => {
    const username =
      (formData.firstName + formData.lastName)
        .toLowerCase()
        .replace(/\s/g, "");

    setFormData((prev) => ({ ...prev, username }));
  }, [formData.firstName, formData.lastName]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  let newErrors = {};
  const nameRegex = /^[A-Za-z]+$/;

  if (!nameRegex.test(formData.firstName)) {
    newErrors.firstName = "Only letters allowed";
  }

  if (!nameRegex.test(formData.lastName)) {
    newErrors.lastName = "Only letters allowed";
  }

  if (formData.password.length < 6) {
    newErrors.password = "Minimum 6 characters required";
  }

  if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match";
  }

  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) return;

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.detail || "Registration failed");
      return;
    }

    alert("Registration Successful!");
    navigate("/login");

  } catch (error) {
    console.error(error);
    alert("Server error");
  }
};

  return (
  <div className="auth-page">

    <div className="blob blob1"></div>
    <div className="blob blob2"></div>
    <div className="blob blob3"></div>

    <form className="auth-card register-card" onSubmit={handleSubmit}>

      <h1>Create Account</h1>

      <p>
        Join the Student Performance Prediction System
      </p>

      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
        required
      />
      {errors.firstName && (
        <p className="error">{errors.firstName}</p>
      )}

      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange}
        required
      />
      {errors.lastName && (
        <p className="error">{errors.lastName}</p>
      )}

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        disabled
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      {errors.password && (
        <p className="error">{errors.password}</p>
      )}

      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />
      {errors.confirmPassword && (
        <p className="error">{errors.confirmPassword}</p>
      )}

      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
      >
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
      </select>

      <button
        type="submit"
        className="auth-btn"
      >
        Register
      </button>

      <div className="auth-footer">

        Already have an account?

        <span
          onClick={() => navigate("/login")}
        >
          Login
        </span>

      </div>
        <Link
                to="/"
                style={{
                display: "block",
                width: "fit-content",
                margin: "25px auto 20px",
                color: "#1b5e20",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "16px",
                textAlign: "center",
                }}>
                ← Back to Home
              </Link>
    </form>

  </div>
);
}

export default Register;
