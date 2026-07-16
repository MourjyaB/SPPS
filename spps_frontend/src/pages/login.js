import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        //"Content-Type": "application/json",
      },
      body: new URLSearchParams({
        username: data.email,  
        password: data.password,
      }),
    });

    const result = await response.json();
    console.log(result);

    if (!response.ok) {
      alert("Invalid email or password");
      return;
    }

    // Store token
    localStorage.setItem("token", result.access_token);

// token expiry time (1 hour)
    const expiryTime = Date.now() + 60 * 60 * 1000; 
    localStorage.setItem("token_expiry", expiryTime);
    localStorage.setItem("role", data.role);
    
    localStorage.setItem("role", result.role);


// Get logged-in user details
const meResponse = await fetch(`${API_URL}/auth/me`, {
  headers: {
    Authorization: `Bearer ${result.access_token}`,
  },
});

const userData = await meResponse.json();

console.log("User Data:", userData);

// Store role
localStorage.setItem("role", userData.role);

// Navigate based on role
const role = userData.role.toLowerCase();

if (role === "admin") {
  navigate("/admin-home");
} else if (role === "teacher") {
  navigate("/teacher-home");
} else if (role === "student") {
  navigate("/student-home");
} else {
  alert("Unknown user.");
}
} catch (error) {
    console.error(error);
    alert("Server error");
  }
}

  return (
  <div className="auth-page">

    <div className="blob blob1"></div>
    <div className="blob blob2"></div>
    <div className="blob blob3"></div>

    <form className="auth-card" onSubmit={handleLogin}>

      <h1>Welcome Back</h1>

      <p>
        Login to continue
      </p>

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={data.email}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={data.password}
        onChange={handleChange}
        required
      />

      <button
        type="submit"
        className="auth-btn"
      >
        Login
      </button>

      <div className="auth-footer">

        Don't have an account?

        <span
          onClick={() => navigate("/register")}
        >
          Register
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

export default Login;
