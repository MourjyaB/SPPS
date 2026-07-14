import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import "../styles/performance.css";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import {
  Legend
} from "recharts";

function Performance() {
  const navigate = useNavigate();

  const [subject, setSubject] = useState("chemistry");

  const [overallData, setOverallData] = useState(null);
  const [subjectData, setSubjectData] = useState(null);

  const [barData, setBarData] = useState([]);

  // Session Check
  useEffect(() => {
    const interval = setInterval(() => {
      const expiry = localStorage.getItem("token_expiry");

      if (expiry && Date.now() > Number(expiry)) {
        alert("Session expired.");

        localStorage.clear();

        navigate("/login");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  // =========================
  // Overall Results
  // =========================

  const fetchOverall = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/students/overall_results`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) return;

      const data = await response.json();

      setOverallData(data);

    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // Subject Results
  // =========================

  const fetchSubject = async (selectedSubject) => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(

        `${process.env.REACT_APP_API_URL}/students/subject-wise_results/${selectedSubject}?subject_name=${selectedSubject}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

      );

      if (!response.ok) {
        setSubjectData(null);
        return;
      }

      const data = await response.json();

      setSubjectData(data);

    } catch (err) {

      console.log(err);

      setSubjectData(null);

    }
  };

  // =========================
  // Subject Comparison Graph
  // =========================

  const fetchBarData = async () => {

    try {

      const token = localStorage.getItem("token");

      const subjects = [
        "C Programming", 
        "Chemistry", 
        "Computer Networks",
        "Data Interpretation", 
        "DSA",
        "English",
        "Logical Reasoning", 
        "Maths",
        "Oops",
        "Physics",
        "Python"
      ];

      const results = await Promise.all(

        subjects.map(async (sub) => {

          try {

            const response = await fetch(

              `${process.env.REACT_APP_API_URL}/students/subject-wise_results/${sub}?subject_name=${sub}`,

              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }

            );

            if (!response.ok) {
              return {
                subject:
                  sub.charAt(0).toUpperCase() +
                  sub.slice(1),
                average: 0,
              };
            }

            const data = await response.json();

            return {

              subject:
                sub.charAt(0).toUpperCase() +
                sub.slice(1),

              average: data.average_score ?? 0,

            };

          } catch {

            return {

              subject:
                sub.charAt(0).toUpperCase() +
                sub.slice(1),

              average: 0,

            };

          }

        })

      );

      setBarData(results);

    } catch (err) {

      console.log(err);

    }

  };

  // Load Overall + Bar Graph

  useEffect(() => {

    fetchOverall();

    fetchBarData();

  }, []);

  // Load Selected Subject

  useEffect(() => {

    fetchSubject(subject);

  }, [subject]);
    // =========================
  // Graph Data
  // =========================

  const overallGraph =
  overallData?.recent_scores?.map((score, index) => ({
    test: `Test ${index + 1}`,
    score,
    predicted:
      overallData?.predicted_next_score ?? 0
  })) || [];

  const subjectGraph =
  subjectData?.recent_scores?.map((score, index) => ({
    test: `Test ${index + 1}`,
    score,
    predicted:
      subjectData?.predicted_next_score ?? 0
  })) || [];

  // =========================
  // Difficulty Text
  // =========================

  const difficultyText = (difficulty) => {
    if (difficulty === "E") return "Easy";
    if (difficulty === "M") return "Moderate";
    if (difficulty === "D") return "Difficult";
    return "-";
  };

  // =========================
  // Performance Insight
  // =========================

  const getInsight = () => {

    if (!subjectData)
      return "No performance data available for this subject yet.";

    const avg = subjectData.average_score ?? 0;

    if (avg >= 80)
      return "Excellent performance. Keep challenging yourself with higher difficulty questions.";

    if (avg >= 60)
      return "Good performance. Continue practicing regularly to improve consistency.";

    if (avg >= 40)
      return "Fair performance. Focus on weak concepts and attempt more practice questions.";

    return "Average score is below 40%. Focus on fundamentals before attempting harder questions.";
  };

  // =========================
  // JSX
  // =========================

  return (
  <Layout>

    <div className="dashboard-page performance-page">

      <div className="hero-section">

        <h1>Performance Analytics</h1>

        <p>
          Track your overall and subject-wise academic progress.
        </p>

      </div>


      {/* Overall Performance */}

      <div className="section">

        <h2>Overall Performance</h2>

        <div className="stats-grid">

          <div className="home-card">

            <h3>Average Score</h3>

            <h1>
              {overallData?.average_score ?? 0}%
            </h1>

          </div>


          <div className="home-card">

            <h3>Predicted Next Score</h3>

            <h1>
              {overallData?.predicted_next_score != null
                ? Number(overallData.predicted_next_score).toFixed(1)
                : "0.0"}%
            </h1>

          </div>


          <div className="home-card">

            <h3>Current Difficulty</h3>

            <h1>
              {difficultyText(overallData?.current_difficulty)}
            </h1>

          </div>


        </div>

      </div>



      {/* Overall Performance Graph */}

      <div className="section">

        <h2>Overall Performance Trend</h2>

        <ResponsiveContainer width="100%" height={320}>

          <LineChart data={overallGraph}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="test" />

            <YAxis domain={[0, 100]} />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#14532d"
              strokeWidth={4}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#0d0d0dff"
              strokeWidth={3}
              strokeDasharray="8 8"
            />
          <Legend />
          </LineChart>

        </ResponsiveContainer>

      </div>



      {/* Subject Comparison */}

      <div className="section">

<h2>Subject Comparison</h2>

<ResponsiveContainer width="100%" height={450}>

<BarChart
  data={barData}
>

<CartesianGrid strokeDasharray="3 3" />

<XAxis
  dataKey="subject"
  angle={-35}
  textAnchor="end"
  interval={0}
/>

<YAxis domain={[0,100]} />

<Tooltip />

<Bar
  dataKey="average"
  fill="#14532d"
  radius={[8,8,0,0]}
/>

</BarChart>

</ResponsiveContainer>

</div>




      {/* Subject Analytics */}

      <div className="section">

        <h2>Subject Analytics</h2>


        <select
          className="subject-select"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >

          <option value="">Choose Subject</option>
            <option value="C Programming">C Programming</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Computer Networks">Computer Networks</option>
            <option value="Data Interpretation">Data Interpretation</option>
            <option value="DSA">DSA</option>
            <option value="English">English</option>
            <option value="Logical Reasoning">Logical Reasoning</option>
            <option value="Maths">Maths</option>
            <option value="Oops">Oops</option>
            <option value="Physics">Physics</option>
            <option value="Python">Python</option>
            </select>

        {subjectData ? (

          <>


            <div className="stats-grid">


              <div className="home-card">

                <h3>Subject Average</h3>

                <h1>
                  {subjectData?.average_score ?? 0}%
                </h1>

              </div>



              <div className="home-card">

                <h3>Predicted Next Score</h3>

                <h1>

                  {subjectData?.predicted_next_score != null
                    ? Number(subjectData.predicted_next_score).toFixed(1)
                    : "0.0"}%

                </h1>

              </div>



              <div className="home-card">

                <h3>Current Difficulty</h3>

                <h1>

                  {difficultyText(
                    subjectData?.current_difficulty
                  )}

                </h1>

              </div>



            </div>





            {/* Subject Performance Graph */}


            <div className="section">


              <h2>
                {subject.charAt(0).toUpperCase() +
                  subject.slice(1)}
                {" "}Performance Trend
              </h2>



              <ResponsiveContainer
                width="100%"
                height={320}
              >

                <LineChart data={subjectGraph}>


                  <CartesianGrid
                    strokeDasharray="3 3"
                  />


                  <XAxis
                    dataKey="test"
                  />


                  <YAxis
                    domain={[0, 100]}
                  />


                  <Tooltip />


                  <Line

                    type="monotone"

                    dataKey="score"

                    stroke="#166534"

                    strokeWidth={4}

                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#0a0a0aff"
                    strokeWidth={3}
                    strokeDasharray="8 8"
                  />

                <Legend />
                </LineChart>


              </ResponsiveContainer>


            </div>


            {/* Performance Insight */}


            <div className="section">


              <h2>
                Performance Insight
              </h2>

                <h3>
                  {getInsight()}
                </h3>
            </div>
          </>
        ) : (

          <div className="home-card">

            <h3>
              No Attempts Found
            </h3>

            <p>
              You have not attempted any tests for this subject yet.
            </p>

          </div>


        )}



      </div>


    </div>


  </Layout>

);
}
export default Performance;