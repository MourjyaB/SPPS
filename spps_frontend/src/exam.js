import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

/* ✅ Fisher-Yates Shuffle */
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function Exam() {
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [visited, setVisited] = useState({});
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300);

  /* ✅ Load & shuffle questions */
  useEffect(() => {
    const originalQuestions = [
      { q: "1 + 1", options: ["1", "2", "3", "4"], answer: "2" },
      { q: "2 + 2", options: ["2", "3", "4", "5"], answer: "4" },
      { q: "3 + 3", options: ["5", "6", "7", "8"], answer: "6" },
      { q: "4 + 4", options: ["6", "7", "8", "9"], answer: "8" },
      { q: "5 + 5", options: ["8", "9", "10", "11"], answer: "10" },
      { q: "6 + 6", options: ["10", "11", "12", "13"], answer: "12" },
      { q: "7 + 7", options: ["12", "13", "14", "15"], answer: "14" },
      { q: "8 + 8", options: ["14", "15", "16", "17"], answer: "16" },
      { q: "9 + 9", options: ["16", "17", "18", "19"], answer: "18" },
      { q: "10 + 10", options: ["18", "19", "20", "21"], answer: "20" }
    ];

    const shuffled = shuffleArray(
      originalQuestions.map((q) => ({
        ...q,
        options: shuffleArray(q.options)
      }))
    );

    setQuestions(shuffled);
  }, []);

  /* ✅ Prevent multiple submissions */
  const handleSubmit = useCallback(() => {
    if (score !== null) return;

    let finalScore = 0;

    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer) {
        finalScore++;
      }
    });

    setScore(finalScore);
  }, [selectedAnswers, questions, score]);

  /* ✅ Fixed Timer (no interval bug) */
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

  /* ✅ Track visited */
  useEffect(() => {
    setVisited((prev) => ({ ...prev, [currentQ]: true }));
  }, [currentQ]);

  /* ✅ Answer selection (clean update) */
  const handleOptionClick = (option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ]: option
    }));
  };

  /* ✅ Answer count */
  const answeredCount = Object.keys(selectedAnswers).length;

  /* ✅ Navigation */
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

  /* ✅ Format timer */
  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  /* Wait for questions */
  if (questions.length === 0) return null;

  /* ✅ Result screen */
  if (score !== null) {
    return (
      <div className="container">
        <div className="form">
          <h2>The Final Score</h2>
          <h3>{score} / {questions.length}</h3>
        </div>
      </div>
    );
  }

  return (
  <div className="exam-container">

    {/* Main */}
    <div className="exam-main">
      <h2>Time Left: {formatTime()}</h2>
      <h4>Answered: {answeredCount} / {questions.length}</h4>

      <h3>Question {currentQ + 1}</h3>
      <p>{questions[currentQ].q}</p>

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
          {opt}
        </button>
      ))}

      <div className="nav-buttons">
        <button
          className="nav-btn prev-btn"
          onClick={handlePrev}
          disabled={currentQ === 0}
        >
          Previous
        </button>

        <button
          className="nav-btn next-btn"
          onClick={handleNext}
        >
          {currentQ === questions.length - 1 ? "Submit" : "Next"}
        </button>
      </div>
    </div> {/* CLOSE exam-main HERE */}

    {/* Sidebar */}
    <div className="exam-sidebar">
      {questions.map((_, index) => {
        let className = "q-btn";

        if (selectedAnswers[index]) {
          className += " answered";
        } else if (visited[index]) {
          className += " visited";
        }

        if (index === currentQ) {
          className += " current";
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
);
}

export default Exam;