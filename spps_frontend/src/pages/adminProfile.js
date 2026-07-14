import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";

function AdminProfile() {

  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

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

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await fetch(

          `${process.env.REACT_APP_API_URL}/auth/me`,

          {

            headers: {

              Authorization: `Bearer ${token}`,

            },

          }

        );

        if (!response.ok) {

          throw new Error("Unable to load profile.");

        }

        const data = await response.json();

        setProfile(data);

      }

      catch (err) {

        console.log(err);

      }

    };

    fetchProfile();

  }, []);
  return (

    <Layout>

      <div className="dashboard-page">

        <div className="hero-section">

          <h1>

            Admin Profile

          </h1>

          <p>

            View your account information.

          </p>

        </div>


        {profile && (

          <div className="upload-container">

            <div className="upload-box">

  <h2>
    Account Details
  </h2>
<div style={{ textAlign: "left", marginTop: "25px" }}>

  <p>
    <strong>Username:</strong>{" "}
    {profile.username}
  </p>


  <p>
    <strong>Email:</strong>{" "}
    {profile.email}
  </p>


  <p>
    <strong>Role:</strong>{" "}
    {profile.role}
  </p>
</div>

    </div>
  </div>
  )}

  </div>

  </Layout>

  );

}

export default AdminProfile;