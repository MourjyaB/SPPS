import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";

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

function StudentReport() {

  const navigate = useNavigate();

  const [studentId, setStudentId] = useState("");

  const [report, setReport] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [selectedSubject, setSelectedSubject] = useState("");

  // =========================
  // Session Check
  // =========================

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

  // =========================
  // Fetch Student Report
  // =========================

  const fetchReport = async () => {

    if (!studentId.trim()) {

      alert("Enter Student ID");

      return;

    }

    setLoading(true);

    setError("");

    setReport(null);

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(

        `${process.env.REACT_APP_API_URL}/teachers/student_report/${studentId}`,

        {

          headers: {

            Authorization: `Bearer ${token}`,

          },

        }

      );

      if (!response.ok) {

        setError("Student report not found.");

        setLoading(false);

        return;

      }

      const data = await response.json();

        setReport(data);

        if (data.subjects && data.subjects.length > 0) {

        setSelectedSubject(data.subjects[0].subject);

        }

    }

    catch (err) {

      console.log(err);

      setError("Unable to load report.");

    }

    finally {

      setLoading(false);

    }

  };

  // =========================
  // Overall Graph
  // =========================

  const overallGraph =
    report?.overall?.recent_scores?.map((score, index) => ({
      test: `Test ${index + 1}`,
      score
    })) || [];

  // =========================
  // Subject Comparison Graph
  // =========================

  const subjectBarData =
    report?.subjects?.map((item) => ({

      subject:
        item.subject.charAt(0).toUpperCase() +
        item.subject.slice(1),

      average: item.average,

      prediction: item.prediction

    })) || [];
    const selectedSubjectData =
  report?.subjects?.find(
    (item) => item.subject === selectedSubject
  );
      // =========================
  // JSX
  // =========================

  return (

    <Layout>

      <div className="dashboard-page">

        <div className="hero-section">

          <h1>
            Student Report
          </h1>

          <p>
            View overall and subject-wise performance of any student.
          </p>

        </div>


        {/* Search Student */}

        <div className="upload-container">

          <div className="upload-box">

            <h2>
              Search Student
            </h2>

            <p>
              Enter the Student ID to generate the report.
            </p>

            <input

              type="number"

              className="subject-select"

              placeholder="Student ID"

              value={studentId}

              onChange={(e) => setStudentId(e.target.value)}

              onKeyDown={(e) => {

                if (e.key === "Enter") {

                  fetchReport();

                }

              }}

            />

            <br />

            <br />

            <button

              className="upload-btn"

              onClick={fetchReport}

              disabled={loading}

            >

              {loading ? "Loading..." : "Generate Report"}

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


        {report && (

          <>

            {/* Overall Statistics */}

            <div className="section">

              <h2>
                Overall Performance
              </h2>

              <div className="stats-grid">

                <div className="home-card">

                  <h3>
                    Student ID
                  </h3>

                  <h1>

                    {report.student_id}

                  </h1>

                </div>


                <div className="home-card">

                  <h3>
                    Average Score
                  </h3>

                  <h1>

                    {report.overall.average}%

                  </h1>

                </div>


                <div className="home-card">

                  <h3>
                    Predicted Score
                  </h3>

                  <h1>

                    {Number(
                      report.overall.prediction
                    ).toFixed(1)}%

                  </h1>

                </div>

              </div>

            </div>


            {/* Overall Graph */}

            <div className="section">

              <h2>
                Overall Performance Trend
              </h2>

              <ResponsiveContainer
                width="100%"
                height={320}
              >

                <LineChart
                  data={overallGraph}
                >

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

                    stroke="#14532d"

                    strokeWidth={4}

                  />

                </LineChart>

              </ResponsiveContainer>

            </div>


            {/* Subject Comparison */}

            <div className="section">

              <h2>
                Subject Comparison
              </h2>

              <ResponsiveContainer
                width="100%"
                height={320}
              >

                <BarChart
                  data={subjectBarData}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="subject"
                  />

                  <YAxis
                    domain={[0, 100]}
                  />

                  <Tooltip />

                  <Bar

                    dataKey="average"

                    fill="#14532d"

                    radius={[8, 8, 0, 0]}

                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

            {/* Subject Analytics */}

            <div className="section">

                <h2>Subject-wise Analytics</h2>
            <select

                className="subject-select"
                value={selectedSubject}
                onChange={(e)=>setSelectedSubject(e.target.value)}
                >
                    <option value="">Select Subject</option>
                    {report.subjects.map((subject,index)=>(
                        <option key={index} value={subject.subject}>
                            {subject.subject.charAt(0).toUpperCase()+subject.subject.slice(1)}
                        </option>

))}


</select>



{selectedSubjectData && (

<>


<div className="stats-grid">
<div className="home-card">

<h3>
Average Score
</h3>

<h1>

{selectedSubjectData.average}%

</h1>

</div>




<div className="home-card">

<h3>
Predicted Score
</h3>

<h1>

{
Number(
selectedSubjectData.prediction
).toFixed(1)
}%

</h1>

</div>


</div>



<h2>

{
selectedSubjectData.subject.charAt(0).toUpperCase()
+
selectedSubjectData.subject.slice(1)
} Performance Trend

</h2>



<ResponsiveContainer
width="100%"
height={320}
>


<LineChart

data={
selectedSubjectData.recent_scores.map(
(score,index)=>({

test:`Test ${index+1}`,

score

})
)

}

>


<CartesianGrid
strokeDasharray="3 3"
/>


<XAxis
dataKey="test"
/>


<YAxis
domain={[0,100]}
/>


<Tooltip />


<Line

type="monotone"

dataKey="score"

stroke="#166534"

strokeWidth={4}

/>


</LineChart>


</ResponsiveContainer>


</>

)}


</div>


            {/* Performance Insight */}

            <div className="section">

              <h2> Performance Insight </h2>              
                <h3>
                  {report.overall.average >= 80
                    ? "Excellent academic performance. The student is consistently performing at a high level."
                    : report.overall.average >= 60
                    ? "Good performance. With continued practice, the student can achieve excellent results."
                    : report.overall.average >= 40
                    ? "Average performance. Additional focus on weaker topics is recommended."
                    : "Performance is below expectations. Regular practice and concept revision are strongly recommended."}
                </h3>

            </div>

          </>

        )}

      </div>

    </Layout>

  );

}

export default StudentReport;