import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import axios from "axios";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_URL = process.env.REACT_APP_API_URL;

const CombinedQuiz = () => {
  const { auth } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const fetchQuestions = async () => {
    try {
      console.log("Fetching questions from API...");
      const { data } = await axios.get(
        `${API_URL}/api/result/random-questions-all-quizes`
      );
      console.log("Fetched questions:", data);
      if (Array.isArray(data?.questions)) {
        setQuestions(data.questions);
      } else {
        toast.error("Invalid questions data received.");
        setQuestions([]);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Failed to load questions.");
      setQuestions([]);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timer > 0 && !isQuizFinished) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !isQuizFinished) {
      handleNextQuestion();
    }
  }, [timer, isQuizFinished]);

  const handleNextQuestion = () => {
    if (questions.length === 0) return;

    const currentQuestion = questions[currentQuestionIndex];

    if (
      selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswer
    ) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestionIndex + 1 === questions.length) {
      setIsQuizFinished(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimer(30);
    }
  };

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
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Failed to submit quiz.");
      setIsSubmitting(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = answer;
      return newAnswers;
    });
  };

  if (questions.length === 0) {
    return <div className="text-center mt-5">Loading questions...</div>;
  }

  if (currentQuestionIndex >= questions.length) {
    return <div className="text-center mt-5">No more questions.</div>;
  }

  if (isQuizFinished) {
    return (
      <Layout>
        <div className="text-center mt-5">
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Results"}
          </button>
        </div>
      </Layout>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Layout>
      <div className="container border border-dark rounded p-4 mt-5">
        <h2 className="text-center">Combined Quiz</h2>
        <h4 className="text-center">
          Question {currentQuestionIndex + 1} of {questions.length}
        </h4>
        <h5 className="mt-4">{currentQuestion.questionText}</h5>
        <div className="mb-4">
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="form-check">
              <input
                type="radio"
                id={`option${index}`}
                name="answer"
                className="form-check-input"
                value={option}
                checked={selectedAnswers[currentQuestionIndex] === option}
                onChange={() => handleAnswerSelect(option)}
              />
              <label htmlFor={`option${index}`} className="form-check-label">
                {option}
              </label>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <p className="font-weight-bold">Time remaining: {timer} seconds</p>
        </div>
        <button
          className="btn btn-success"
          onClick={handleNextQuestion}
          disabled={selectedAnswers[currentQuestionIndex] === undefined}
        >
          Next Question
        </button>
      </div>
    </Layout>
  );
};

export default CombinedQuiz;
