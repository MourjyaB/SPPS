import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";

function FindStudent() {

  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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


  const searchStudent = async () => {

    if (!query.trim()) {

      alert("Please enter Username, Email or Student ID.");

      return;

    }

    setLoading(true);
    setStudent(null);
    setError("");

    try {

      const token = localStorage.getItem("token");

      let url =
        `${process.env.REACT_APP_API_URL}/teachers/find_student/{username/email/id}`;

      // Detect whether input is ID, Email or Username
      if (/^\d+$/.test(query)) {

        url += `?user_id=${query}`;

      }

      else if (query.includes("@")) {

        url += `?email=${encodeURIComponent(query)}`;

      }

      else {

        url += `?username=${encodeURIComponent(query)}`;

      }

      const response = await fetch(url, {

        headers: {

          Authorization: `Bearer ${token}`,

        },

      });

      if (!response.ok) {

        setError("Student not found.");

        return;

      }

      const data = await response.json();

      if (!data.length) {

        setError("Student not found.");

        return;

      }

      setStudent(data[0]);

    }

    catch (err) {

      console.log(err);

      setError("Unable to fetch student details.");

    }

    finally {

      setLoading(false);

    }

  };


  return (

    <Layout>

      <div className="dashboard-page">

        <div className="hero-section">

          <h1>Find Students</h1>

          <p>
            Search students using their Username, Email or Student ID.
          </p>

        </div>


        <div className="upload-container">

          <div className="upload-box">

            <h2>Student Search</h2>

            <p>
              Enter a Username, Email or Student ID.
            </p>

            <input

              type="text"

              className="subject-select"

              placeholder="Username / Email / Student ID"

              value={query}

              onChange={(e) => setQuery(e.target.value)}

              onKeyDown={(e) => {

                if (e.key === "Enter") {

                  searchStudent();

                }

              }}

            />

            <br />

            <br />

            <button

              className="upload-btn"

              onClick={searchStudent}

              disabled={loading}

            >

              {loading ? "Searching..." : "Search Student"}

            </button>

          </div>

        </div>


        {error && (

          <div className="upload-container">

            <div className="upload-box">

              <h2>{error}</h2>

            </div>

          </div>

        )}


        {student && (

          <div className="upload-container">

            <div className="upload-box"
              style={{ textAlign: "left" }}>

              <h2 style={{ textAlign: "center" }}>
              Student Information
              </h2>
              <p>
                
                <strong>Student ID:</strong> {student.id}

              </p>

              <p>

                <strong>Username:</strong> {student.username}

              </p>

              <p>

                <strong>Email:</strong> {student.email}

              </p>

              <p>

                <strong>Role:</strong> {student.role}

              </p>

              <p>

                <strong>Status:</strong> {student.is_active ? "Active" : "Inactive"}

              </p>

            </div>

          </div>

        )}

      </div>

    </Layout>

  );

}

export default FindStudent;