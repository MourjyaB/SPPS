import React, { useState, useEffect, useCallback } from "react";
import Layout from "../components/layout";
import "../styles/admin.css";

import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

function QuestionManagement() {

  const API_URL = process.env.REACT_APP_API_URL;

  const subjects = [
    { label: "Choose Subject", value: "" },
    { label: "C Programming", value: "c programming" },
    { label: "Chemistry", value: "chemistry" },
    { label: "Computer Networks", value: "computer networks" },
    { label: "Data Interpretation", value: "data interpretation" },
    { label: "DSA", value: "dsa" },
    { label: "English", value: "english" },
    { label: "Logical Reasoning", value: "logical reasoning" },
    { label: "Maths", value: "maths" },
    { label: "Oops", value: "oops" },
    { label: "Physics", value: "physics" },
    { label: "Python", value: "python" }
  ];

  const difficultyMap = {
    E: "Easy",
    M: "Moderate",
    D: "Difficult"
  };

  const [selectedSubject, setSelectedSubject] = useState("Choose Subject");
  const [status, setStatus] = useState("pending");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const fetchQuestions = useCallback(async () => {

    setLoading(true);

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(

        `${API_URL}/admin/questions/${status}/${selectedSubject}`,

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      );

      if (!response.ok)
        throw new Error("Unable to fetch questions");

      const data = await response.json();

      console.log(data);

      setQuestions(Array.isArray(data) ? data : []);

    }

    catch (err) {

      console.log(err);

      setQuestions([]);

    }

    finally {

      setLoading(false);

    }

  }, [API_URL, status, selectedSubject]);

  useEffect(() => {

    fetchQuestions();

  }, [fetchQuestions]);

  const verifyQuestion = async (id) => {

    if (!window.confirm("Verify this question?"))
      return;

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(

        `${API_URL}/admin/questions/verify/${id}`,

        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      );

      if (!response.ok)
        throw new Error();

      fetchQuestions();

    }

    catch {

      alert("Unable to verify question.");

    }

  };

  const rejectQuestion = async (id) => {

    if (!window.confirm("Reject this question?"))
      return;

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(

        `${API_URL}/admin/questions/reject/${id}`,

        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      );

      if (!response.ok)
        throw new Error();

      fetchQuestions();

    }

    catch {

      alert("Unable to reject question.");

    }

  };

  return (

    <Layout>

      <div className="admin-container">

        <div className="page-title">

          <h1>Question Management</h1>

          <p>
            Manage and moderate teacher submitted questions.
          </p>

        </div>

        {/* SUBJECT */}

        <div className="subject-dropdown">

          <label>Select Subject</label>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >

            {subjects.map((subject) => (

              <option
                key={subject.value}
                value={subject.value}
              >

                {subject.label}

              </option>

            ))}

          </select>

        </div>

        {/* STATUS */}

        <div className="status-row">

          <div
            className={`status-card ${status === "pending" ? "active-status" : ""}`}
            onClick={() => setStatus("pending")}
          >

            <FaClock />

            <h3>Pending</h3>

          </div>

          <div
            className={`status-card ${status === "verified" ? "active-status" : ""}`}
            onClick={() => setStatus("verified")}
          >

            <FaCheckCircle />

            <h3>Verified</h3>

          </div>

          <div
            className={`status-card ${status === "rejected" ? "active-status" : ""}`}
            onClick={() => setStatus("rejected")}
          >

            <FaTimesCircle />

            <h3>Rejected</h3>

          </div>

        </div>
                {/* QUESTIONS */}
                {loading ? (
                  <div className="empty-box">
                    <h2>Loading Questions...</h2>
                  </div>
                  ) : questions.length === 0 ? (

                  <div className="empty-box">
                    
                    <h2>No Questions Found</h2>
                    
                    <p>There are no {status} questions for{" "}
      {
        subjects.find(
          (s) => s.value === selectedSubject
        )?.label
      }.
    </p>

  </div>


) : (

  questions.map((question) => (

    <div
      className="question-card"
      key={question.id}
    >

              {/* HEADER */}

              <div className="question-header">

                <div className="question-id">

                  <span className="id-badge">

                    ID #{question.id}

                  </span>

                  <span className="difficulty-badge">

                    {difficultyMap[question.difficulty_level] ||
                      question.difficulty_level}

                  </span>

                  <span className="difficulty-badge">

                    {question.subject}

                  </span>

                </div>

              </div>

              {/* QUESTION */}

              <h2 className="question-title">

                {question.question}

              </h2>

              {/* OPTIONS */}

              <div className="options">

                <p><strong>A.</strong> {question.option_a}</p>

                <p><strong>B.</strong> {question.option_b}</p>

                <p><strong>C.</strong> {question.option_c}</p>

                <p><strong>D.</strong> {question.option_d}</p>

              </div>

              {/* BUTTONS */}

              <div className="question-footer">

                <button

                  className="details-btn"

                  onClick={() =>
                    setExpandedQuestion(
                      expandedQuestion === question.id
                        ? null
                        : question.id
                    )
                  }

                >

                  {expandedQuestion === question.id ? (

                    <>
                      <FaEyeSlash /> Hide Details
                    </>

                  ) : (

                    <>
                      <FaEye /> View Details
                    </>

                  )}

                </button>

                {status === "pending" && (

                  <>

                    <button

                      className="verify-btn"

                      onClick={() => verifyQuestion(question.id)}

                    >

                      Verify

                    </button>

                    <button

                      className="reject-btn"

                      onClick={() => rejectQuestion(question.id)}

                    >

                      Reject

                    </button>

                  </>

                )}

                {status === "verified" && (

                  <button

                    className="reject-btn"

                    onClick={() => rejectQuestion(question.id)}

                  >

                    Reject

                  </button>

                )}

                {status === "rejected" && (

                    <button

                            className="verify-btn"

                            onClick={() => verifyQuestion(question.id)}

                    >

                    Verify

                    </button>

                )}

              </div>

              {/* DETAILS */}

              {expandedQuestion === question.id && (

                <div className="question-details">

                  <hr />

                  <div className="details-grid">

                    <div>

                      <h4>Correct Answer</h4>

                      <p>{question.correct_option}</p>

                    </div>

                    <div>

                      <h4>Teacher ID</h4>

                      <p>{question.teacher_id}</p>

                    </div>

                    <div>

                      <h4>Created On</h4>

                      <p>

                        {new Date(
                          question.created_at
                        ).toLocaleString()}

                      </p>

                    </div>

                    <div>

                      <h4>Status</h4>

                      <p style={{ textTransform: "capitalize" }}>

                        {question.status}

                      </p>

                    </div>

                  </div>

                  <div className="explanation-box">

                    <h4>Explanation</h4>

                    <p>

                      {question.explanation}

                    </p>

                  </div>

                </div>

              )}

            </div>

          ))

        )}

      </div>

    </Layout>

  );

}

export default QuestionManagement;