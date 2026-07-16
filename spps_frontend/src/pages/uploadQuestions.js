import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";


const API_URL = process.env.REACT_APP_API_URL;


function UploadQuestions() {

  const navigate = useNavigate();

  const [subject, setSubject] = useState("mathematics");
  const [file, setFile] = useState(null);


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



  const handleFileChange = (e) => {

    if (e.target.files.length > 0) {

      setFile(e.target.files[0]);

    }

  };



  const handleUpload = async () => {


    if (!file) {

      alert("Please select a PDF file.");

      return;

    }


    const formData = new FormData();


    formData.append("file", file);

    formData.append("subject", subject);



    try {


      const response = await fetch(
        `${API_URL}/teachers/upload_pdf`,
        {
          method: "POST",

          headers: {
            Authorization:
            `Bearer ${localStorage.getItem("token")}`
          },

          body: formData
        }
      );



      const data = await response.json();



      if (response.ok) {

        alert("Question paper uploaded successfully!");

        console.log(data);

        setFile(null);

      }

      else {

        alert(data.detail || "Upload failed");

      }


    }

    catch(error) {

      console.error(error);

      alert("Unable to connect to server");

    }


  };



  return (

    <Layout>

      <div className="dashboard-page">


       <div className="hero-section">
  <h1>Upload Question Paper</h1>

  <p>
    Upload a PDF question paper to automatically extract and store questions.
  </p>

</div>



        <div className="upload-container">


          <div className="upload-box">


            <div className="upload-icon">
              📄
            </div>


            <h2>Upload PDF</h2>
          <br/>
          <a
      href={`${process.env.PUBLIC_URL}/Format%20(1).pdf`}
      download="Format.pdf"
      style={{
        display: "inline-block",
        padding: "12px 24px",
        backgroundColor: "#2E8B57",
        color: "#fff",
        textDecoration: "none",
        borderRadius: "8px",
        fontWeight: "600",
        fontSize: "15px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        transition: "0.3s",
      }}
      onMouseEnter={(e) =>
        (e.target.style.backgroundColor = "#246B45")
      }
      onMouseLeave={(e) =>
        (e.target.style.backgroundColor = "#2E8B57")
      }
    >
      Download Sample PDF Format
    </a>
    <br/><br/>
            <p>
              Choose the subject and upload a question paper.
            </p>

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




            <div className="file-upload">


              <input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                hidden
              />



              <label
                htmlFor="pdf-upload"
                className="upload-file-btn"
              >
                Choose PDF
              </label>



              <p className="file-name">

                {file ? file.name : "No file selected"}

              </p>



            </div>




            <button
              className="upload-btn"
              onClick={handleUpload}
            >

              Upload Question Paper

            </button>



          </div>


        </div>


      </div>


    </Layout>

  );

}


export default UploadQuestions;
