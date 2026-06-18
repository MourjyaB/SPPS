import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState(""); // ✅ added

  useEffect(() => {
    fetch("http://127.0.0.1:8000/auth")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className="container">
      <div className="form">
        <h1 className="title">STUDENT PERFORMANCE PREDICTION SYSTEM</h1>
        <p>{data}</p>

        <button onClick={() => navigate("/register")}>
          Register
        </button>

        <button onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Home;