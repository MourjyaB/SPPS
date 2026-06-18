import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

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
    const response = await fetch("http://127.0.0.1:8000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: data.email,   // 👈 IMPORTANT (matches FastAPI)
        password: data.password,
      }),
    });

    const result = await response.json();
    console.log(result);

    if (!response.ok) {
      alert("Invalid email or password");
      return;
    }

    // ✅ Store token
    // ✅ Store token
    localStorage.setItem("token", result.access_token);

// ✅ Store expiry time (1 minute from now)
    const expiryTime = Date.now() + 60 * 1000; // 1 min
    localStorage.setItem("token_expiry", expiryTime);

    alert("Login Successful!");

    localStorage.setItem("role", result.role);

    if (result.role === "teacher") {
      navigate("/teacher-home");
    } 
    else {
      navigate("/student-home");
    }  // or dashboard

  } catch (error) {
    console.error(error);
    alert("Server error");
  }
};

  return (
    <div className="container">
      <form className="form" onSubmit={handleLogin}>
        <h2>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;