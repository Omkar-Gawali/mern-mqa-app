import React, { useEffect, useState, useCallback } from "react";
import Layout from "../components/layout/Layout";
import axios from "axios";
import { useAuth } from "../context/authContext";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const API_URL = process.env.REACT_APP_API_URL;

const QuizPage = () => {
  const [quiz, setQuiz] = useState(null);
  const { auth } = useAuth();
  const params = useParams();

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!auth?.user) {
      toast.error("You must be logged in to attempt the quiz.");
      navigate("/login");
    }
  }, [auth, navigate]);

  // Fetch Questions
  const fetchQuestions = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/result/random-questions/${params.id}`
      );

      if (!data.questions) {
        toast.error("No questions found for this quiz.");
        console.log("API Response:", data);
        return;
      }

      setQuestions(data?.questions);
    } catch (err) {
      console.error("Fetch Questions Error:", err);
      toast.error("Failed to load questions");
    }
  }, [params.id]);

  // Fetch Quiz Info
  const getSingleQuiz = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/quiz/get-single-quiz/${params.id}`
      );

      setQuiz(data?.quiz);
    } catch (err) {
      console.error("Fetch Quiz Error:", err);
      toast.error("Failed to load quiz");
    }
  }, [params.id]);

  useEffect(() => {
    fetchQuestions();
    getSingleQuiz();
  }, [fetchQuestions, getSingleQuiz]);

  // Timer Logic
  useEffect(() => {
    if (timer > 0 && !isQuizFinished) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (timer === 0) {
      handleNextQuestion();
    }
  }, [timer, isQuizFinished]);

  // Next Question Logic
  const handleNextQuestion = () => {
    const current = questions[currentQuestionIndex];

    // Add to score if correct
    if (selectedAnswers[currentQuestionIndex] === current.correctAnswer) {
      setScore((prev) => prev + 1);
    }

    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex === questions.length) {
      setIsQuizFinished(true);
    } else {
      setCurrentQuestionIndex(nextIndex);
      setTimer(30);
    }
  };

  // Submit Quiz
  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const answers = questions.map((question, index) => ({
        questionId: question._id,
        selectedAnswer: selectedAnswers[index] || "",
        isCorrect: selectedAnswers[index] === question.correctAnswer,
      }));

      await axios.post(`${API_URL}/api/result/submit-quiz`, {
        userId: auth.user._id,
        score,
        answers,
      });

      toast.success("Quiz submitted!");
      navigate("/dashboard/user/results");
    } catch (err) {
      console.error("Submit Error:", err);
      toast.error("Failed to submit quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswers((prev) => {
      const updated = [...prev];
      updated[currentQuestionIndex] = answer;
      return updated;
    });
  };

  // When quiz is finished – show submit button
  if (isQuizFinished) {
    return (
      <Layout>
        <div className="text-center mt-5">
          <h2>Quiz Completed 🎉</h2>
          <button
            className="btn btn-primary mt-3"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Results"}
          </button>
        </div>
      </Layout>
    );
  }

  if (questions.length === 0 || !quiz)
    return <div className="text-center mt-5">Loading questions...</div>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Layout>
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="card shadow-lg p-4 border-0 rounded-4">
              <h2 className="text-center fw-bold">{quiz.title}</h2>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="badge bg-primary fs-6">
                  Question {currentQuestionIndex + 1} / {questions.length}
                </span>

                <span className="badge bg-warning text-dark fs-6 px-3 py-2">
                  ⏳ {timer}s
                </span>
              </div>

              <h5 className="mt-4 fw-semibold">
                {currentQuestion.questionText}
              </h5>

              <div className="mt-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected =
                    selectedAnswers[currentQuestionIndex] === option;

                  return (
                    <label
                      key={index}
                      className={`d-block p-3 rounded-3 mb-3 border option-card ${
                        isSelected
                          ? "bg-success text-white border-success"
                          : "bg-light border-secondary"
                      }`}
                      style={{ cursor: "pointer", transition: "0.3s" }}
                      onClick={() => handleAnswerSelect(option)}
                    >
                      <input
                        type="radio"
                        name="answer"
                        className="form-check-input me-3"
                        checked={isSelected}
                        onChange={() => handleAnswerSelect(option)}
                        style={{ transform: "scale(1.4)" }}
                      />
                      {option}
                    </label>
                  );
                })}
              </div>

              <div className="d-flex justify-content-end mt-4">
                <button
                  className="btn btn-primary px-4 py-2"
                  onClick={handleNextQuestion}
                  disabled={selectedAnswers[currentQuestionIndex] === undefined}
                >
                  Next Question →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuizPage;
