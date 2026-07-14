import React, { useEffect, useState } from "react";
import Layout from "../components/layout";
import "../styles/admin.css";

import {
  FaUsers,
  FaUserGraduate,
  FaUserShield,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaArrowRight
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

function AdminDashboard() {

  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok)
          throw new Error("Unable to fetch dashboard");

        const data = await response.json();

        setDashboard(data);

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }

    };

    fetchDashboard();

  }, [API_URL]);

  if (loading) {

    return (

      <Layout>

        <div className="admin-container">

          <h2>Loading Dashboard...</h2>

        </div>

      </Layout>

    );

  }

  const verificationRate = Math.round(
    (dashboard.verified_questions / dashboard.total_questions) * 100
  );

  const pendingRate = Math.round(
    (dashboard.pending_questions / dashboard.total_questions) * 100
  );

  const rejectedRate = Math.round(
    (dashboard.rejected_questions / dashboard.total_questions) * 100
  );

  return (

    <Layout>

      <div className="admin-container">

        {/* Banner */}

        <div className="dashboard-banner">

          <h1>Admin Dashboard</h1>
          <span>
            Manage users, questions and monitor platform activity.
          </span>

        </div>

        {/* Statistics */}

        <div className="dashboard-grid">

          <div className="dashboard-card">

            <FaUsers className="card-icon"/>

            <div>

              <h2>{dashboard.total_users}</h2>

              <p>Total Users</p>

            </div>

          </div>

          <div className="dashboard-card">

            <FaChalkboardTeacher className="card-icon"/>

            <div>

              <h2>{dashboard.total_active_teachers}</h2>

              <p>Teachers</p>

            </div>

          </div>

          <div className="dashboard-card">

            <FaUserGraduate className="card-icon"/>

            <div>

              <h2>{dashboard.total_active_students}</h2>

              <p>Students</p>

            </div>

          </div>

          <div className="dashboard-card">

            <FaUserShield className="card-icon"/>

            <div>

              <h2>{dashboard.total_active_admins}</h2>

              <p>Admins</p>

            </div>

          </div>

        </div>

        {/* Middle Section */}

        <div className="dashboard-middle">

          {/* Question Bank */}

          <div className="question-panel">

            <h2>Question Bank</h2>

            <h1>{dashboard.total_questions}</h1>

            <p>Total Questions Available</p>

            <div className="progress-row">

              <div>

                <FaCheckCircle className="green"/>

                Verified

              </div>

              <span>{verificationRate}%</span>

            </div>

            <div className="progress-bar">

              <div
                className="progress verified"
                style={{width:`${verificationRate}%`}}
              />

            </div>

            <div className="question-stats">

              <div>

                <FaCheckCircle className="green"/>
                <h3>Verified</h3>
                {dashboard.verified_questions}

              </div>

              <div>

                <FaClock className="orange"/>
                <h3>Pending</h3>
                {dashboard.pending_questions}

              </div>

              <div>

                <FaTimesCircle className="red"/>
                <h3>Rejected</h3>
                {dashboard.rejected_questions}

              </div>

            </div>

          </div>

          {/* Overview */}

          <div className="overview-panel">

            <h2>System Overview</h2>

            <div className="overview-item">

              <span>Tests Conducted</span>

              <strong>{dashboard.total_tests_taken}</strong>

            </div>

            <div className="overview-item">

              <span>Banned Users</span>

              <strong>{dashboard.total_banned_users}</strong>

            </div>

            <div className="overview-item">

              <span>Verification Rate</span>

              <strong>{verificationRate}%</strong>

            </div>

            <div className="overview-item">

              <span>Pending Rate</span>

              <strong>{pendingRate}%</strong>

            </div>

            <div className="overview-item">

              <span>Rejected Rate</span>

              <strong>{rejectedRate}%</strong>

            </div>

            <div className="system-status">

              {verificationRate > 70 ?

                <span className="healthy">

                  🟢 Healthy System

                </span>

                :

                <span className="warning">

                  🟠 Needs Attention

                </span>

              }

            </div>

          </div>

        </div>

        {/* Quick Actions */}

        <div className="quick-actions">

          <h2>Quick Actions</h2>

          <div className="action-grid">

            <button
              onClick={() => navigate("/question-management")}
            >
              Manage Questions

              <FaArrowRight/>

            </button>

            <button
              onClick={() => navigate("/user-management")}
            >
              Manage Users

              <FaArrowRight/>

            </button>

            <button
              onClick={() => navigate("/teacher-stats")}
            >
              Teacher Statistics

              <FaArrowRight/>

            </button>

            <button
              onClick={() => navigate("/user-management")}
            >
              Search User

              <FaArrowRight/>

            </button>

          </div>

        </div>

      </div>

    </Layout>

  );

}

export default AdminDashboard;