import React, { useState } from "react";
import Layout from "../components/layout";
import "../styles/admin.css";

import {
  FaSearch,
  FaClipboardCheck,
  FaClock,
  FaTimesCircle
} from "react-icons/fa";

function TeacherStatistics() {
  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");

  const [teacherId, setTeacherId] = useState("");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH TEACHER STATS ================= */

  const fetchTeacherStats = async () => {
    if (!teacherId.trim()) {
      alert("Please enter a Teacher ID.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/admin/teacher_stats/${teacherId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("Teacher not found");
      }

      const data = await response.json();
      setStats(data);

    } catch (err) {
      alert("Teacher not found.");
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="admin-container">

        <div className="admin-title-section">

          <div>
            <h1>Teacher Statistics</h1>
            <p>
              View question upload statistics for teachers.
            </p>
          </div>
        </div>

        {/* ================= SEARCH ================= */}

        <div className="user-toolbar">

          <div className="search-container">

            <input
              type="number"
              placeholder="Enter Teacher ID..."
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  fetchTeacherStats();
                }
              }}
            />

            <button onClick={fetchTeacherStats}>
              <FaSearch />
            </button>

          </div>

        </div>

        {loading ? (
          <div className="loading-state">
            Loading teacher statistics...
          </div>
        ) : (
          stats && (
                        <>
              {/* ================= STAT CARDS ================= */}

              <div className="stats-grid">

                <div className="stat-card">
                  <FaClipboardCheck className="stat-icon" />
                  <h2>{stats.total_questions_uploaded}</h2>
                  <p>Total Uploaded</p>
                </div>

                <div className="stat-card">
                  <FaClipboardCheck className="stat-icon" />
                  <h2>{stats.verified}</h2>
                  <p>Verified</p>
                </div>

                <div className="stat-card">
                  <FaClock className="stat-icon" />
                  <h2>{stats.pending}</h2>
                  <p>Pending</p>
                </div>

                <div className="stat-card">
                  <FaTimesCircle className="stat-icon" />
                  <h2>{stats.rejected}</h2>
                  <p>Rejected</p>
                </div>

              </div>

              {/* ================= APPROVAL RATE ================= */}

              <div className="approval-card">

                <h3>Approval Rate</h3>

                <div className="progress-bar">

                  <div
                    className="progress-fill"
                    style={{
                      width: `${stats.approval_rate}%`
                    }}
                  ></div>

                </div>

                <h2>{stats.approval_rate}%</h2>

              </div>

              {/* ================= DETAILS TABLE ================= */}

              <div className="table-wrapper">

                <table className="admin-table">

                  <tbody>

                    <tr>
                      <td><strong>Teacher ID</strong></td>
                      <td>{stats.teacher_id}</td>
                    </tr>

                    <tr>
                      <td><strong>Username</strong></td>
                      <td>{stats.username}</td>
                    </tr>

                    <tr>
                      <td><strong>Email</strong></td>
                      <td>{stats.email}</td>
                    </tr>

                    <tr>
                      <td><strong>Total Questions Uploaded</strong></td>
                      <td>{stats.total_questions_uploaded}</td>
                    </tr>

                    <tr>
                      <td><strong>Verified Questions</strong></td>
                      <td>{stats.verified}</td>
                    </tr>

                    <tr>
                      <td><strong>Pending Questions</strong></td>
                      <td>{stats.pending}</td>
                    </tr>

                    <tr>
                      <td><strong>Rejected Questions</strong></td>
                      <td>{stats.rejected}</td>
                    </tr>

                    <tr>
                      <td><strong>Approval Rate</strong></td>
                      <td>{stats.approval_rate}%</td>
                    </tr>

                  </tbody>

                </table>

              </div>

            </>
          )
        )}

      </div>
    </Layout>
  );
}

export default TeacherStatistics;