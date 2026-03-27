import Layout from "../components/layout/Layout";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";
import AdminMenu from "./AdminMenu";

const API_URL = process.env.REACT_APP_API_URL;

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');

  .ar-root * { box-sizing: border-box; }

  .ar-root {
    font-family: 'Syne', sans-serif;
    background: #0a0a0f;
    min-height: 100vh;
    color: #e8e8f0;
  }

  /* ── Header ── */
  .ar-header {
    padding: 36px 0 28px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 32px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }
  .ar-breadcrumb {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.18em;
    color: #39ff7e;
    text-transform: uppercase;
    margin-bottom: 8px;
    opacity: 0.9;
  }
  .ar-title {
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 800;
    letter-spacing: -0.02em;
    margin: 0;
    line-height: 1;
  }
  .ar-title span { color: #39ff7e; }

  .ar-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    background: rgba(57,255,126,0.1);
    color: #39ff7e;
    border: 1px solid rgba(57,255,126,0.25);
    padding: 5px 14px;
    border-radius: 100px;
    white-space: nowrap;
  }

  /* ── Layout grid ── */
  .ar-grid {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 24px;
    align-items: start;
  }
  @media (max-width: 768px) {
    .ar-grid { grid-template-columns: 1fr; }
  }

  /* ── Section label ── */
  .ar-section-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #39ff7e;
    margin-bottom: 20px;
  }
  .ar-section-label::before {
    content: '';
    display: block;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #39ff7e;
    box-shadow: 0 0 8px #39ff7e;
    flex-shrink: 0;
  }

  /* ── Result card ── */
  .ar-card {
    background: #111118;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 16px;
    transition: border-color 0.2s;
  }
  .ar-card:hover { border-color: rgba(255,255,255,0.13); }

  .ar-card-header {
    padding: 18px 24px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }

  .ar-user-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .ar-avatar {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: rgba(57,255,126,0.12);
    border: 1px solid rgba(57,255,126,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    color: #39ff7e;
    flex-shrink: 0;
  }

  .ar-username {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  .ar-timestamp {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: rgba(232,232,240,0.35);
    margin-top: 2px;
  }

  .ar-score-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    font-weight: 500;
    padding: 6px 16px;
    border-radius: 100px;
    border: 1px solid;
    white-space: nowrap;
  }
  .ar-score-pill.high {
    background: rgba(57,255,126,0.1);
    color: #39ff7e;
    border-color: rgba(57,255,126,0.3);
  }
  .ar-score-pill.mid {
    background: rgba(255,196,0,0.1);
    color: #ffc400;
    border-color: rgba(255,196,0,0.3);
  }
  .ar-score-pill.low {
    background: rgba(255,65,65,0.08);
    color: #ff6b6b;
    border-color: rgba(255,65,65,0.25);
  }

  /* ── Score bar ── */
  .ar-score-bar-wrap {
    padding: 0 24px;
    margin: 14px 0 4px;
  }
  .ar-score-bar-track {
    height: 3px;
    background: rgba(255,255,255,0.06);
    border-radius: 100px;
    overflow: hidden;
  }
  .ar-score-bar-fill {
    height: 100%;
    border-radius: 100px;
    transition: width 0.6s cubic-bezier(0.34,1.56,0.64,1);
  }
  .ar-score-bar-fill.high { background: #39ff7e; box-shadow: 0 0 8px rgba(57,255,126,0.5); }
  .ar-score-bar-fill.mid  { background: #ffc400; box-shadow: 0 0 8px rgba(255,196,0,0.4); }
  .ar-score-bar-fill.low  { background: #ff6b6b; box-shadow: 0 0 8px rgba(255,65,65,0.4); }

  /* ── Table ── */
  .ar-table-wrap {
    padding: 16px 24px 20px;
    overflow-x: auto;
  }

  .ar-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  .ar-table thead tr {
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .ar-table th {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(232,232,240,0.35);
    font-weight: 500;
    padding: 0 12px 10px;
    text-align: left;
  }
  .ar-table th:last-child { text-align: center; }

  .ar-table tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.15s;
  }
  .ar-table tbody tr:last-child { border-bottom: none; }
  .ar-table tbody tr:hover { background: rgba(255,255,255,0.02); }

  .ar-table td {
    padding: 11px 12px;
    color: rgba(232,232,240,0.75);
    vertical-align: middle;
    line-height: 1.45;
  }
  .ar-table td:last-child { text-align: center; }

  .ar-q-num {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: rgba(232,232,240,0.25);
    margin-right: 8px;
  }

  .ar-answer-cell {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: rgba(232,232,240,0.55);
  }
  .ar-answer-cell.not-attempted {
    color: rgba(232,232,240,0.2);
    font-style: italic;
  }

  .ar-result-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.08em;
    padding: 3px 10px;
    border-radius: 100px;
    border: 1px solid;
    white-space: nowrap;
  }
  .ar-result-badge.correct {
    background: rgba(57,255,126,0.1);
    color: #39ff7e;
    border-color: rgba(57,255,126,0.3);
  }
  .ar-result-badge.incorrect {
    background: rgba(255,65,65,0.08);
    color: #ff6b6b;
    border-color: rgba(255,65,65,0.2);
  }

  /* ── Empty ── */
  .ar-empty {
    background: #111118;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 64px 28px;
    text-align: center;
  }
  .ar-empty-icon { font-size: 40px; opacity: 0.35; margin-bottom: 14px; }
  .ar-empty-title { font-size: 18px; font-weight: 700; margin-bottom: 6px; }
  .ar-empty-sub { font-size: 13px; color: rgba(232,232,240,0.4); }

  /* ── Loading ── */
  .ar-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    gap: 16px;
  }
  .ar-spinner {
    width: 36px; height: 36px;
    border: 2px solid rgba(57,255,126,0.15);
    border-top-color: #39ff7e;
    border-radius: 50%;
    animation: ar-spin 0.75s linear infinite;
  }
  @keyframes ar-spin { to { transform: rotate(360deg); } }
  .ar-loading-text {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(232,232,240,0.35);
  }

  /* ── Error ── */
  .ar-error {
    background: rgba(255,65,65,0.07);
    border: 1px solid rgba(255,65,65,0.2);
    border-radius: 14px;
    padding: 20px 24px;
    color: #ff6b6b;
    font-size: 14px;
    text-align: center;
    margin: 40px 0;
  }

  /* ── Pagination ── */
  .ar-pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 24px;
    padding-bottom: 32px;
  }
  .ar-page-btn {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: #e8e8f0;
    border-radius: 9px;
    padding: 9px 20px;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
  }
  .ar-page-btn:hover:not(:disabled) {
    background: rgba(57,255,126,0.08);
    border-color: rgba(57,255,126,0.3);
    color: #39ff7e;
  }
  .ar-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .ar-page-info {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: rgba(232,232,240,0.45);
  }
  .ar-page-info strong { color: #e8e8f0; }
`;

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const getScoreClass = (score, total) => {
  if (!total) return "mid";
  const pct = score / total;
  if (pct >= 0.7) return "high";
  if (pct >= 0.4) return "mid";
  return "low";
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

/* ─── Component ──────────────────────────────────────────────────────────── */
const AdminResultsPage = () => {
  const { auth } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState({});
  const [usernames, setUsernames] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(5);
  const [error, setError] = useState(null);

  const getQuestionText = async (questionId) => {
    if (questions[questionId]) return questions[questionId];
    try {
      const { data } = await axios.get(
        `${API_URL}/api/result/get-question-text/${questionId}`,
      );
      setQuestions((prev) => ({ ...prev, [questionId]: data.qText }));
      return data.qText;
    } catch {
      return "Question not found";
    }
  };

  const getUsername = async (userId) => {
    if (usernames[userId]) return usernames[userId];
    try {
      const { data } = await axios.get(
        `${API_URL}/api/result/get-username/${userId}`,
      );
      setUsernames((prev) => ({ ...prev, [userId]: data.userName }));
      return data.userName;
    } catch {
      return "Unknown User";
    }
  };

  const fetchResults = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/result/get-all-results`);
      const resultsWithDetails = await Promise.all(
        data.results.map(async (result) => {
          const username = await getUsername(result.userId);
          const answersWithText = await Promise.all(
            result.answers.map(async (answer) => {
              const questionText = await getQuestionText(answer.questionId);
              return { ...answer, questionText };
            }),
          );
          return { ...result, username, answers: answersWithText };
        }),
      );
      setResults(resultsWithDetails);
    } catch {
      setError("Failed to fetch results. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const indexOfLast = currentPage * resultsPerPage;
  const indexOfFirst = indexOfLast - resultsPerPage;
  const currentResults = results.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(1, Math.ceil(results.length / resultsPerPage));

  if (loading) {
    return (
      <Layout>
        <style>{styles}</style>
        <div className="ar-root">
          <div className="ar-loading">
            <div className="ar-spinner" />
            <span className="ar-loading-text">Loading results…</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <style>{styles}</style>
        <div className="ar-root">
          <div className="container-fluid px-4">
            <div className="ar-error">{error}</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <style>{styles}</style>
      <div className="ar-root">
        <div className="container-fluid px-4">
          {/* Header */}
          <div className="ar-header">
            <div>
              <div className="ar-breadcrumb">Admin · Results</div>
              <h1 className="ar-title">
                Quiz <span>Results</span>
              </h1>
            </div>
            <span className="ar-badge">{results.length} attempts</span>
          </div>

          {/* Grid */}
          <div className="ar-grid">
            <div>
              <AdminMenu />
            </div>

            <div>
              <div className="ar-section-label">All attempts</div>

              {currentResults.length === 0 ? (
                <div className="ar-empty">
                  <div className="ar-empty-icon">📊</div>
                  <div className="ar-empty-title">No results yet</div>
                  <p className="ar-empty-sub">
                    Once users attempt quizzes, their results will appear here.
                  </p>
                </div>
              ) : (
                currentResults.map((result) => {
                  const scoreClass = getScoreClass(
                    result.score,
                    result.answers.length,
                  );
                  const pct = result.answers.length
                    ? Math.round((result.score / result.answers.length) * 100)
                    : 0;

                  return (
                    <div key={result._id} className="ar-card">
                      {/* Card header */}
                      <div className="ar-card-header">
                        <div className="ar-user-row">
                          <div className="ar-avatar">
                            {getInitials(result.username)}
                          </div>
                          <div>
                            <div className="ar-username">{result.username}</div>
                            <div className="ar-timestamp">
                              {new Date(result.timestamp).toLocaleString(
                                undefined,
                                {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                },
                              )}
                            </div>
                          </div>
                        </div>

                        <span className={`ar-score-pill ${scoreClass}`}>
                          {result.score} / {result.answers.length}
                          &nbsp;·&nbsp;{pct}%
                        </span>
                      </div>

                      {/* Score bar */}
                      <div className="ar-score-bar-wrap">
                        <div className="ar-score-bar-track">
                          <div
                            className={`ar-score-bar-fill ${scoreClass}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      {/* Table */}
                      <div className="ar-table-wrap">
                        <table className="ar-table">
                          <thead>
                            <tr>
                              <th style={{ width: "55%" }}>Question</th>
                              <th style={{ width: "28%" }}>Selected Answer</th>
                              <th style={{ width: "17%" }}>Result</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.answers.map((answer, idx) => (
                              <tr key={answer.questionId}>
                                <td>
                                  <span className="ar-q-num">
                                    Q{String(idx + 1).padStart(2, "0")}
                                  </span>
                                  {answer.questionText || "Question not found"}
                                </td>
                                <td>
                                  {answer.selectedAnswer ? (
                                    <span className="ar-answer-cell">
                                      {answer.selectedAnswer}
                                    </span>
                                  ) : (
                                    <span className="ar-answer-cell not-attempted">
                                      Not attempted
                                    </span>
                                  )}
                                </td>
                                <td>
                                  <span
                                    className={`ar-result-badge ${
                                      answer.isCorrect ? "correct" : "incorrect"
                                    }`}
                                  >
                                    {answer.isCorrect ? "✓ Correct" : "✗ Wrong"}
                                  </span>
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
                <div className="ar-pagination">
                  <button
                    className="ar-page-btn"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    ← Prev
                  </button>
                  <span className="ar-page-info">
                    Page <strong>{currentPage}</strong> of{" "}
                    <strong>{totalPages}</strong>
                  </span>
                  <button
                    className="ar-page-btn"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
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

export default AdminResultsPage;
