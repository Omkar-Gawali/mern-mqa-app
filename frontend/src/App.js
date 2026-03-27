import React from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import UserRoute from "./Routes/UserRoute";
import UserDashboard from "./User/UserDashboard";
import AdminRoute from "./Routes/AdminRoute";
import AdminDashboard from "./Admin/AdminDashboard";
import SelectQuizPage from "./pages/SelectQuizPage";
import CreateQuiz from "./Admin/CreateQuiz";
import AddQuestion from "./Admin/AddQuestion";
import AllQuestions from "./Admin/AllQuestions";
import QuizPage from "./User/QuizPage";
import CombinedQuiz from "./User/CombinedQuiz";
import UserResultsPage from "./User/UserResultsPage";
import UserLeaderboardPage from "./User/UserLeaderboardPage";
import LeaderboardPage from "./Admin/LeaderboardPage";
import AdminResultsPage from "./Admin/AdminResultsPage";
import QuizAttempt from "./pages/QuizAttempt";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/select-quiz/:id" element={<QuizAttempt />} />
          <Route path="/select-quiz" element={<SelectQuizPage />} />
          <Route path="/select-quiz/combined-test" element={<CombinedQuiz />} />
          {/* <Route path="/quiz/:id/attempt" element={<QuizAttempt />} /> */}

          <Route path="/dashboard" element={<UserRoute />}>
            <Route path="user" element={<UserDashboard />} />
            <Route path="user/results" element={<UserResultsPage />} />
            <Route path="user/leaderboard" element={<UserLeaderboardPage />} />
          </Route>

          <Route path="/dashboard" element={<AdminRoute />}>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/create-quiz" element={<CreateQuiz />} />
            <Route path="admin/add-question" element={<AddQuestion />} />
            <Route path="admin/all-questions" element={<AllQuestions />} />
            <Route
              path="admin/get-all-results"
              element={<AdminResultsPage />}
            />
            <Route path="admin/leaderboard" element={<LeaderboardPage />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </>
  );
};

export default App;
