import Layout from "../components/layout/Layout";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";
import UserMenu from "./UserMenu";
import toast from "react-hot-toast";

const API_URL = process.env.REACT_APP_API_URL;

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  .ur-root {
    min-height: 100vh;
    background: #050709;
    font-family: 'Syne', sans-serif;
    position: relative;
  }

  .ur-root::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.013) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.013) 1px, transparent 1px);
    background-size: 52px 52px;
    pointer-events: none; z-index: 0;
  }

  .ur-glow {
    position: fixed; border-radius: 50%;
    pointer-events: none; z-index: 0; filter: blur(100px);
  }
  .ur-glow-1 {
    width: 600px; height: 600px; top: -200px; left: -200px;
    background: radial-gradient(circle, rgba(0,255,136,0.04) 0%, transparent 70%);
  }
  .ur-glow-2 {
    width: 400px; height: 400px; bottom: 0; right: -100px;
    background: radial-gradient(circle, rgba(0,200,255,0.035) 0%, transparent 70%);
  }

  .ur-wrap {
    position: relative; z-index: 1;
    padding: 48px 24px 80px;
  }

  /* ── Header ── */
  .ur-header {
    margin-bottom: 44px;
    display: flex; flex-direction: column; gap: 6px;
  }
  .ur-header-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem; font-weight: 500;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: #00ff88; opacity: 0.7;
  }
  .ur-header h1 {
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    font-weight: 800; color: #f0f0f5;
    margin: 0; letter-spacing: -0.02em; line-height: 1.1;
  }
  .ur-header h1 span { color: #00ff88; }

  /* ── Layout grid ── */
  .ur-layout { display: flex; gap: 28px; align-items: flex-start; }
  .ur-sidebar { width: 220px; flex-shrink: 0; }
  .ur-main { flex: 1; min-width: 0; }

  /* ── Result card ── */
  .ur-card {
    background: #0b0e14;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; overflow: hidden;
    margin-bottom: 24px;
    animation: ur-in 0.4s ease both;
  }
  @keyframes ur-in {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ur-card-header {
    padding: 20px 24px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;
  }
  .ur-card-left { display: flex; flex-direction: column; gap: 5px; }
  .ur-username {
    font-size: 1rem; font-weight: 700; color: #f0f0f5; letter-spacing: -0.01em;
    display: flex; align-items: center; gap: 8px;
  }
  .ur-username-dot {
    width: 8px; height: 8px; border-radius: 50%; background: #00ff88;
    box-shadow: 0 0 8px #00ff88; flex-shrink: 0;
  }
  .ur-date {
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem; color: rgba(255,255,255,0.28);
    letter-spacing: 0.04em;
  }

  .ur-score-pill {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 18px; border-radius: 12px;
    background: rgba(0,255,136,0.07);
    border: 1px solid rgba(0,255,136,0.18);
  }
  .ur-score-num {
    font-family: 'DM Mono', monospace;
    font-size: 1.15rem; font-weight: 500; color: #00ff88; letter-spacing: 0.02em;
  }
  .ur-score-bar-wrap {
    width: 80px; height: 4px;
    background: rgba(255,255,255,0.06); border-radius: 99px; overflow: hidden;
  }
  .ur-score-bar {
    height: 100%; background: #00ff88; border-radius: 99px;
    transition: width 1s cubic-bezier(0.4,0,0.2,1);
  }

  /* ── Table ── */
  .ur-table-wrap { padding: 0; overflow-x: auto; }
  .ur-table {
    width: 100%; border-collapse: collapse;
    font-size: 0.85rem;
  }
  .ur-table thead tr {
    background: rgba(255,255,255,0.025);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .ur-table th {
    padding: 11px 20px;
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem; font-weight: 500;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(255,255,255,0.25); text-align: left;
  }
  .ur-table th.center { text-align: center; }
  .ur-table tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.15s;
  }
  .ur-table tbody tr:last-child { border-bottom: none; }
  .ur-table tbody tr:hover { background: rgba(255,255,255,0.018); }
  .ur-table td {
    padding: 14px 20px; color: rgba(255,255,255,0.6);
    line-height: 1.45; vertical-align: middle;
    font-size: 0.84rem; font-weight: 400;
  }
  .ur-table td.center { text-align: center; }

  .ur-q-text { color: rgba(255,255,255,0.75); font-weight: 500; }

  /* Answer badge */
  .ur-ans {
    display: inline-flex; align-items: center;
    padding: 5px 12px; border-radius: 8px;
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem; font-weight: 500;
    letter-spacing: 0.02em;
  }
  .ur-ans-value {
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.7);
  }
  .ur-ans-skipped {
    background: rgba(251,191,36,0.08);
    border: 1px solid rgba(251,191,36,0.2);
    color: #fbbf24;
  }

  /* Status */
  .ur-status { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .ur-correct, .ur-incorrect {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 14px; border-radius: 8px;
    font-size: 0.76rem; font-weight: 600; letter-spacing: 0.03em;
  }
  .ur-correct {
    background: rgba(0,255,136,0.08);
    border: 1px solid rgba(0,255,136,0.2);
    color: #00ff88;
  }
  .ur-incorrect {
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.2);
    color: #f87171;
  }
  .ur-correct-ans {
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem; color: rgba(255,255,255,0.2);
    letter-spacing: 0.03em;
  }

  /* ── Empty ── */
  .ur-empty {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 80px 24px; gap: 14px;
    border: 1px dashed rgba(255,255,255,0.08); border-radius: 18px;
    background: #0b0e14;
  }
  .ur-empty-icon { font-size: 2.5rem; opacity: 0.3; }
  .ur-empty-text {
    font-size: 0.88rem; color: rgba(255,255,255,0.2);
    font-family: 'DM Mono', monospace; letter-spacing: 0.06em;
  }

  /* ── Loading ── */
  .ur-loading {
    min-height: 100vh; background: #050709;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px;
  }
  .ur-spinner { position: relative; width: 44px; height: 44px; }
  .ur-spinner::before, .ur-spinner::after {
    content: ''; position: absolute; border-radius: 50%;
    border: 2px solid transparent;
  }
  .ur-spinner::before {
    inset: 0; border-top-color: #00ff88; border-right-color: #00ff88;
    animation: ur-spin 1s linear infinite;
  }
  .ur-spinner::after {
    inset: 9px; border-bottom-color: rgba(0,255,136,0.25); border-left-color: rgba(0,255,136,0.25);
    animation: ur-spin 1.7s linear infinite reverse;
  }
  @keyframes ur-spin { to { transform: rotate(360deg); } }
  .ur-loading-text {
    font-family: 'DM Mono', monospace; font-size: 0.75rem;
    color: rgba(255,255,255,0.2); letter-spacing: 0.1em; text-transform: uppercase;
  }

  /* ── Pagination ── */
  .ur-pagination {
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
    margin-top: 8px; flex-wrap: wrap;
  }
  .ur-page-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px; border-radius: 10px;
    background: #0b0e14; border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.5); font-family: 'Syne', sans-serif;
    font-size: 0.82rem; font-weight: 600; cursor: pointer;
    transition: all 0.2s; letter-spacing: 0.01em;
  }
  .ur-page-btn:hover:not(:disabled) {
    border-color: rgba(0,255,136,0.3); color: #00ff88;
  }
  .ur-page-btn:disabled { opacity: 0.25; cursor: not-allowed; }
  .ur-page-info {
    font-family: 'DM Mono', monospace; font-size: 0.75rem;
    color: rgba(255,255,255,0.25); letter-spacing: 0.06em;
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .ur-layout { flex-direction: column; }
    .ur-sidebar { width: 100%; }
    .ur-table th, .ur-table td { padding: 10px 14px; }
  }
`;

const UserResultsPage = () => {
  const { auth } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;

  const fetchResults = async (userId) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/result/get-results/${userId}`,
      );
      const resultsData = data.results;

      const uniqueUserIds = [...new Set(resultsData.map((r) => r.userId))];
      const uniqueQuestionIds = [
        ...new Set(
          resultsData.flatMap((r) => r.answers.map((a) => a.questionId)),
        ),
      ];

      const usernamesResponses = await Promise.all(
        uniqueUserIds.map((id) =>
          axios
            .get(`${API_URL}/api/result/get-username/${id}`)
            .then((res) => ({ id, username: res.data.userName }))
            .catch(() => ({ id, username: "Unknown User" })),
        ),
      );
      const usernamesMap = {};
      usernamesResponses.forEach(
        ({ id, username }) => (usernamesMap[id] = username),
      );

      const questionsResponses = await Promise.all(
        uniqueQuestionIds.map((id) =>
          axios
            .get(`${API_URL}/api/result/get-question-text/${id}`)
            .then((res) => ({ id, questionText: res.data.qText }))
            .catch(() => ({ id, questionText: "Question not found" })),
        ),
      );
      const questionsMap = {};
      questionsResponses.forEach(
        ({ id, questionText }) => (questionsMap[id] = questionText),
      );

      const resultsWithDetails = resultsData.map((result) => ({
        ...result,
        username: usernamesMap[result.userId] || "Unknown User",
        answers: result.answers.map((ans) => ({
          ...ans,
          questionText: questionsMap[ans.questionId] || "Question not found",
        })),
      }));

      setResults(resultsWithDetails);
    } catch (error) {
      console.error("Error fetching results:", error);
      toast.error("Failed to load results.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.user?._id) fetchResults(auth.user._id);
  }, [auth]);

  if (loading) {
    return (
      <div className="ur-loading">
        <style>{CSS}</style>
        <div className="ur-spinner" />
        <p className="ur-loading-text">Loading results…</p>
      </div>
    );
  }

  const indexOfLast = currentPage * resultsPerPage;
  const indexOfFirst = indexOfLast - resultsPerPage;
  const currentResults = results.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(results.length / resultsPerPage);

  return (
    <Layout>
      <style>{CSS}</style>
      <div className="ur-root">
        <div className="ur-glow ur-glow-1" />
        <div className="ur-glow ur-glow-2" />

        <div className="ur-wrap">
          {/* Header */}
          <div className="ur-header">
            <span className="ur-header-label">Dashboard · Results</span>
            <h1>
              Your Quiz <span>History</span>
            </h1>
          </div>

          <div className="ur-layout">
            {/* Sidebar */}
            <div className="ur-sidebar">
              <UserMenu />
            </div>

            {/* Main */}
            <div className="ur-main">
              {currentResults.length === 0 ? (
                <div className="ur-empty">
                  <div className="ur-empty-icon">📭</div>
                  <p className="ur-empty-text">No results yet</p>
                </div>
              ) : (
                currentResults.map((result, ri) => {
                  const pct = result.answers.length
                    ? Math.round((result.score / result.answers.length) * 100)
                    : 0;
                  return (
                    <div
                      className="ur-card"
                      key={result._id}
                      style={{ animationDelay: `${ri * 0.06}s` }}
                    >
                      {/* Card header */}
                      <div className="ur-card-header">
                        <div className="ur-card-left">
                          <div className="ur-username">
                            <span className="ur-username-dot" />
                            {result.username}
                          </div>
                          <div className="ur-date">
                            {new Date(result.timestamp).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </div>
                        </div>
                        <div className="ur-score-pill">
                          <span className="ur-score-num">
                            {result.score}/{result.answers.length}
                          </span>
                          <div className="ur-score-bar-wrap">
                            <div
                              className="ur-score-bar"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Table */}
                      <div className="ur-table-wrap">
                        <table className="ur-table">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Question</th>
                              <th className="center">Your Answer</th>
                              <th className="center">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.answers.map((answer, i) => (
                              <tr key={i}>
                                <td
                                  style={{
                                    fontFamily: "'DM Mono', monospace",
                                    fontSize: "0.7rem",
                                    color: "rgba(255,255,255,0.2)",
                                    width: "36px",
                                  }}
                                >
                                  {String(i + 1).padStart(2, "0")}
                                </td>
                                <td className="ur-q-text">
                                  {answer.questionText}
                                </td>
                                <td className="center">
                                  {answer.selectedAnswer ? (
                                    <span className="ur-ans ur-ans-value">
                                      {answer.selectedAnswer}
                                    </span>
                                  ) : (
                                    <span className="ur-ans ur-ans-skipped">
                                      ⏭ skipped
                                    </span>
                                  )}
                                </td>
                                <td className="center">
                                  <div className="ur-status">
                                    {answer.isCorrect ? (
                                      <span className="ur-correct">
                                        ✓ Correct
                                      </span>
                                    ) : (
                                      <span className="ur-incorrect">
                                        ✗ Incorrect
                                      </span>
                                    )}
                                    {!answer.isCorrect &&
                                      answer.correctAnswer && (
                                        <span className="ur-correct-ans">
                                          → {answer.correctAnswer}
                                        </span>
                                      )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Pagination */}
              {results.length > resultsPerPage && (
                <div className="ur-pagination">
                  <button
                    className="ur-page-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    ← Prev
                  </button>
                  <span className="ur-page-info">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    className="ur-page-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserResultsPage;
