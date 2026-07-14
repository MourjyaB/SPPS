import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../styles/exam.css";

function Exam() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const subject = searchParams.get("subject");

  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [visited, setVisited] = useState({});
  const [timeLeft, setTimeLeft] = useState(300);

  // Fetch Questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/students/generate_test/${subject}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        const formattedQuestions = data.map((q) => ({
          id: q.id,
          question: q.question,
          options: [
            q.option_a,
            q.option_b,
            q.option_c,
            q.option_d,
          ],
        }));

        setQuestions(formattedQuestions);
      } catch (error) {
        console.error(error);
        alert("Failed to load questions");
      }
    };

    fetchQuestions();
  }, [subject]);

  // Submit Test
  const handleSubmit = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        total_questions: questions.length,

        answers: questions.map((question, index) => ({
          question_id: question.id,
          selected_option: selectedAnswers[index] || "",
        })),

        difficulty_level: "easy",
      };

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/students/submit_test`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert("Failed to submit test");
        return;
      }

      localStorage.setItem(
        "latest_result",
        JSON.stringify(result)
      );

      navigate("/results");
    } catch (error) {
      console.error(error);
      alert("Submission failed");
    }
  }, [questions, selectedAnswers, navigate]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, handleSubmit]);

  // Track visited questions
  useEffect(() => {
    setVisited((prev) => ({
      ...prev,
      [currentQ]: true,
    }));
  }, [currentQ]);

  const handleOptionClick = (option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ]: option,
    }));
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      if (window.confirm("Are you sure you want to submit?")) {
        handleSubmit();
      }
    }
  };

  const handlePrev = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
    }
  };

  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  if (questions.length === 0) {
    return <h2>Loading Questions...</h2>;
  }

  return (
  <div className="exam-container">

    <div className="exam-main">

  <div className="exam-header">

    <div>

      <h1 className="exam-title">
        {subject.charAt(0).toUpperCase() + subject.slice(1)}
      </h1>

    </div>

    <div
      className={`timer-box ${
        timeLeft <= 60
          ? "danger"
          : timeLeft <= 120
          ? "warning"
          : ""
      }`}
    >
      {formatTime()}
    </div>

  </div>

  <div className="question-card">

    <h2 style={{ textAlign: "left" }}>Question {currentQ + 1}</h2>

    <p className="question-text">
      {questions[currentQ].question}
    </p>

    <div className="options-container">

      {questions[currentQ].options.map((opt, i) => (
        <button
          key={i}
          className={
            selectedAnswers[currentQ] === opt
              ? "option selected"
              : "option"
          }
          onClick={() => handleOptionClick(opt)}
        >
          {selectedAnswers[currentQ] === opt ? "✔ " : "○ "}
          {opt}
        </button>
      ))}

    </div>

  </div>

  <div className="nav-buttons">

    <button
      className="nav-btn prev-btn"
      onClick={handlePrev}
      disabled={currentQ === 0}
    >
      ← Previous
    </button>

    <button
      className="nav-btn next-btn"
      onClick={handleNext}
    >
      {currentQ === questions.length - 1
        ? "Submit"
        : "Next →"}
    </button>

  </div>

</div>

    {/* Sidebar */}

<div className="exam-sidebar">

  {/* Question Palette */}

  <div className="palette">

    <h3>Questions</h3>

    <div className="question-grid">

      {questions.map((_, index) => {

        let className = "q-btn";

        if (index === currentQ) {
          className += " current";
        } else if (selectedAnswers[index]) {
          className += " answered";
        } else if (visited[index]) {
          className += " visited";
        }

        return (
          <button
            key={index}
            className={className}
            onClick={() => setCurrentQ(index)}
          >
            {index + 1}
          </button>
        );

      })}

    </div>

  </div>

  {/* Legend */}

  <div className="legend">

    <div className="legend-item">
      <div className="legend-color current-box"></div>
      <span>Current</span>
    </div>

    <div className="legend-item">
      <div className="legend-color answered-box"></div>
      <span>Answered</span>
    </div>

    <div className="legend-item">
      <div className="legend-color visited-box"></div>
      <span>Visited</span>
    </div>

  </div>

</div>
</div>
);
}


export default Exam;