import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/authContext";
import axios from "axios";
import AdminMenu from "./AdminMenu";

const API_URL = process.env.REACT_APP_API_URL;

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');

  .lb-root * { box-sizing: border-box; }

  .lb-root {
    font-family: 'Syne', sans-serif;
    background: #0a0a0f;
    min-height: 100vh;
    color: #e8e8f0;
  }

  /* ── Header ── */
  .lb-header {
    padding: 36px 0 28px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 32px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }
  .lb-breadcrumb {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.18em;
    color: #39ff7e;
    text-transform: uppercase;
    margin-bottom: 8px;
    opacity: 0.9;
  }
  .lb-title {
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 800;
    letter-spacing: -0.02em;
    margin: 0;
    line-height: 1;
  }
  .lb-title span { color: #39ff7e; }

  .lb-badge {
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

  /* ── Header right cluster ── */
  .lb-header-right {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  /* ── Export button ── */
  .lb-export-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: #39ff7e;
    background: rgba(57,255,126,0.08);
    border: 1px solid rgba(57,255,126,0.3);
    border-radius: 10px;
    padding: 8px 16px;
    cursor: pointer;
    position: relative;
    transition: background 0.18s, box-shadow 0.18s, color 0.18s;
    white-space: nowrap;
  }
  .lb-export-btn:hover {
    background: rgba(57,255,126,0.15);
    box-shadow: 0 0 18px rgba(57,255,126,0.2);
  }
  .lb-export-btn svg { flex-shrink: 0; }

  /* ── Dropdown ── */
  .lb-export-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background: #16161f;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    overflow: hidden;
    z-index: 200;
    min-width: 200px;
    box-shadow: 0 12px 40px rgba(0,0,0,0.6);
  }
  .lb-export-dropdown button {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 12px 18px;
    background: transparent;
    border: none;
    color: #c8c8d8;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    text-align: left;
    transition: background 0.15s, color 0.15s;
  }
  .lb-export-dropdown button:hover {
    background: rgba(255,255,255,0.05);
    color: #e8e8f0;
  }
  .lb-export-dropdown button + button {
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  .lb-export-dot-csv { color: #39ff7e; font-size: 16px; }
  .lb-export-dot-txt { color: #ffc400; font-size: 16px; }

  /* ── Layout grid ── */
  .lb-grid {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 24px;
    align-items: start;
  }
  @media (max-width: 768px) {
    .lb-grid { grid-template-columns: 1fr; }
  }

  /* ── Section label ── */
  .lb-section-label {
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
  .lb-section-label::before {
    content: '';
    display: block;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #39ff7e;
    box-shadow: 0 0 8px #39ff7e;
    flex-shrink: 0;
  }

  /* ── Podium (top 3) ── */
  .lb-podium {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }
  @media (max-width: 500px) {
    .lb-podium { grid-template-columns: 1fr; }
  }

  .lb-podium-card {
    background: #111118;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 20px 16px;
    text-align: center;
    transition: border-color 0.2s, transform 0.2s;
    position: relative;
    overflow: hidden;
  }
  .lb-podium-card:hover { transform: translateY(-2px); }

  .lb-podium-card.rank-1 {
    border-color: rgba(255,196,0,0.35);
    background: linear-gradient(160deg, #111118 60%, rgba(255,196,0,0.06));
  }
  .lb-podium-card.rank-2 {
    border-color: rgba(180,180,210,0.3);
    background: linear-gradient(160deg, #111118 60%, rgba(180,180,210,0.05));
  }
  .lb-podium-card.rank-3 {
    border-color: rgba(200,120,60,0.3);
    background: linear-gradient(160deg, #111118 60%, rgba(200,120,60,0.05));
  }

  .lb-podium-medal {
    font-size: 28px;
    margin-bottom: 10px;
    line-height: 1;
  }

  .lb-podium-rank {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .lb-podium-rank.rank-1 { color: #ffc400; }
  .lb-podium-rank.rank-2 { color: #b4b4d2; }
  .lb-podium-rank.rank-3 { color: #c8783c; }

  .lb-podium-name {
    font-size: 14px;
    font-weight: 700;
    color: #e8e8f0;
    margin-bottom: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .lb-podium-score {
    font-family: 'DM Mono', monospace;
    font-size: 22px;
    font-weight: 700;
    line-height: 1;
  }
  .lb-podium-score.rank-1 { color: #ffc400; }
  .lb-podium-score.rank-2 { color: #b4b4d2; }
  .lb-podium-score.rank-3 { color: #c8783c; }

  .lb-podium-total {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: rgba(232,232,240,0.3);
    margin-top: 3px;
  }

  /* ── Main table card ── */
  .lb-card {
    background: #111118;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 16px;
  }

  /* ── Table ── */
  .lb-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  .lb-table thead tr {
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .lb-table th {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(232,232,240,0.35);
    font-weight: 500;
    padding: 14px 20px;
    text-align: left;
  }
  .lb-table th.center { text-align: center; }

  .lb-table tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.15s;
  }
  .lb-table tbody tr:last-child { border-bottom: none; }
  .lb-table tbody tr:hover { background: rgba(255,255,255,0.02); }
  .lb-table tbody tr.is-top { background: rgba(57,255,126,0.03); }
  .lb-table tbody tr.is-top:hover { background: rgba(57,255,126,0.06); }

  .lb-table td {
    padding: 14px 20px;
    color: rgba(232,232,240,0.8);
    vertical-align: middle;
  }
  .lb-table td.center { text-align: center; }

  /* ── Rank cell ── */
  .lb-rank-cell {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .lb-rank-num {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: rgba(232,232,240,0.3);
  }

  .lb-rank-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px; height: 28px;
    border-radius: 8px;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    border: 1px solid;
  }
  .lb-rank-badge.gold   { background: rgba(255,196,0,0.12);  color: #ffc400; border-color: rgba(255,196,0,0.3); }
  .lb-rank-badge.silver { background: rgba(180,180,210,0.1); color: #b4b4d2; border-color: rgba(180,180,210,0.25); }
  .lb-rank-badge.bronze { background: rgba(200,120,60,0.1);  color: #c8783c; border-color: rgba(200,120,60,0.25); }

  /* ── User cell ── */
  .lb-user-cell {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .lb-avatar {
    width: 32px; height: 32px;
    border-radius: 9px;
    background: rgba(57,255,126,0.1);
    border: 1px solid rgba(57,255,126,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    color: #39ff7e;
    flex-shrink: 0;
  }
  .lb-avatar.gold   { background: rgba(255,196,0,0.1);  border-color: rgba(255,196,0,0.25);  color: #ffc400; }
  .lb-avatar.silver { background: rgba(180,180,210,0.1); border-color: rgba(180,180,210,0.2); color: #b4b4d2; }
  .lb-avatar.bronze { background: rgba(200,120,60,0.1); border-color: rgba(200,120,60,0.2);  color: #c8783c; }

  .lb-username {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: #e8e8f0;
  }

  /* ── Score cell ── */
  .lb-score {
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    font-weight: 700;
    color: #39ff7e;
  }
  .lb-score.gold   { color: #ffc400; }
  .lb-score.silver { color: #b4b4d2; }
  .lb-score.bronze { color: #c8783c; }

  .lb-total {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: rgba(232,232,240,0.35);
  }

  /* ── Pct bar ── */
  .lb-pct-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .lb-pct-track {
    flex: 1;
    height: 3px;
    background: rgba(255,255,255,0.06);
    border-radius: 100px;
    overflow: hidden;
    min-width: 60px;
  }
  .lb-pct-fill {
    height: 100%;
    border-radius: 100px;
    background: rgba(57,255,126,0.5);
  }
  .lb-pct-fill.gold   { background: #ffc400; }
  .lb-pct-fill.silver { background: #b4b4d2; }
  .lb-pct-fill.bronze { background: #c8783c; }
  .lb-pct-label {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: rgba(232,232,240,0.4);
    white-space: nowrap;
    min-width: 36px;
    text-align: right;
  }

  /* ── Empty ── */
  .lb-empty {
    padding: 64px 28px;
    text-align: center;
  }
  .lb-empty-icon { font-size: 40px; opacity: 0.35; margin-bottom: 14px; }
  .lb-empty-title { font-size: 18px; font-weight: 700; margin-bottom: 6px; }
  .lb-empty-sub { font-size: 13px; color: rgba(232,232,240,0.4); }

  /* ── Loading ── */
  .lb-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    gap: 16px;
  }
  .lb-spinner {
    width: 36px; height: 36px;
    border: 2px solid rgba(57,255,126,0.15);
    border-top-color: #39ff7e;
    border-radius: 50%;
    animation: lb-spin 0.75s linear infinite;
  }
  @keyframes lb-spin { to { transform: rotate(360deg); } }
  .lb-loading-text {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(232,232,240,0.35);
  }

  /* ── Pagination ── */
  .lb-pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 24px;
    padding-bottom: 32px;
  }
  .lb-page-btn {
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
  .lb-page-btn:hover:not(:disabled) {
    background: rgba(57,255,126,0.08);
    border-color: rgba(57,255,126,0.3);
    color: #39ff7e;
  }
  .lb-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .lb-page-info {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: rgba(232,232,240,0.45);
  }
  .lb-page-info strong { color: #e8e8f0; }
`;

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const getInitials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

const MEDALS = ["gold", "silver", "bronze"];
const MEDAL_ICONS = ["🥇", "🥈", "🥉"];
const RANK_LABELS = ["1st", "2nd", "3rd"];

const today = () => new Date().toISOString().slice(0, 10);

/* ─── Download helpers ────────────────────────────────────────────────────── */
const downloadCSV = (sortedResults, usernames) => {
  const headers = [
    "Rank",
    "Player",
    "Best Score",
    "Total Questions",
    "Accuracy (%)",
  ];
  const rows = sortedResults.map((r, i) => {
    const name = usernames[r.userId] || "Unknown";
    const pct = r.totalQuestions
      ? Math.round((r.score / r.totalQuestions) * 100)
      : 0;
    return [i + 1, name, r.score, r.totalQuestions, pct];
  });
  const csv =
    "data:text/csv;charset=utf-8," +
    [headers, ...rows].map((row) => row.join(",")).join("\n");
  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(csv));
  link.setAttribute("download", `MQA_Leaderboard_${today()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const downloadTXT = (sortedResults, usernames) => {
  const line = "─".repeat(56);
  const pad = (s, n) => String(s).padEnd(n);
  const rows = sortedResults.map((r, i) => {
    const name = usernames[r.userId] || "Unknown";
    const pct = r.totalQuestions
      ? Math.round((r.score / r.totalQuestions) * 100)
      : 0;
    return `${pad(i + 1, 6)}${pad(name, 18)}${pad(`${r.score}/${r.totalQuestions}`, 14)}${pct}%`;
  });
  const content = [
    "MATH QUIZ ARENA — LEADERBOARD REPORT",
    `Generated : ${new Date().toLocaleString()}`,
    `Players   : ${sortedResults.length}`,
    line,
    `${pad("Rank", 6)}${pad("Player", 18)}${pad("Score", 14)}Accuracy`,
    line,
    ...rows,
    line,
  ].join("\n");
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `MQA_Leaderboard_${today()}.txt`;
  link.click();
  URL.revokeObjectURL(url);
};

/* ─── Export Button with dropdown ────────────────────────────────────────── */
const ExportButton = ({ sortedResults, usernames }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Click-away overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
          }}
        />
      )}

      <div style={{ position: "relative", zIndex: 101 }}>
        <button className="lb-export-btn" onClick={() => setOpen((o) => !o)}>
          {/* Download icon */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export Report
          {/* Chevron */}
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {open && (
          <div className="lb-export-dropdown">
            <button
              onClick={() => {
                downloadCSV(sortedResults, usernames);
                setOpen(false);
              }}
            >
              <span className="lb-export-dot-csv">⬇</span>
              Download as CSV
            </button>
            <button
              onClick={() => {
                downloadTXT(sortedResults, usernames);
                setOpen(false);
              }}
            >
              <span className="lb-export-dot-txt">⬇</span>
              Download Report (.txt)
            </button>
          </div>
        )}
      </div>
    </>
  );
};

/* ─── Component ──────────────────────────────────────────────────────────── */
const LeaderboardPage = () => {
  const { auth } = useAuth();
  const [results, setResults] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(7);

  const fetchUsernames = async (userIds) => {
    const usernamePromises = userIds.map(async (userId) => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/result/get-username/${userId}`,
        );
        return { userId, username: data.userName };
      } catch {
        return { userId, username: "Unknown User" };
      }
    });
    const usernameResults = await Promise.all(usernamePromises);
    const map = {};
    usernameResults.forEach(({ userId, username }) => {
      map[userId] = username;
    });
    setUsernames(map);
  };

  const fetchResults = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/result/get-all-results`);
      setResults(data.results || []);
      const userIds = data.results.map((r) => r.userId);
      await fetchUsernames(userIds);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Layout>
        <style>{styles}</style>
        <div className="lb-root">
          <div className="lb-loading">
            <div className="lb-spinner" />
            <span className="lb-loading-text">Loading leaderboard…</span>
          </div>
        </div>
      </Layout>
    );
  }

  /* ── Aggregate: best score per user ── */
  const aggregated = results.reduce((acc, { userId, score, answers }) => {
    if (!acc[userId] || acc[userId].score < score) {
      acc[userId] = { userId, score, totalQuestions: answers.length };
    }
    return acc;
  }, {});
  const sortedResults = Object.values(aggregated).sort(
    (a, b) => b.score - a.score,
  );

  const indexOfLast = currentPage * resultsPerPage;
  const indexOfFirst = indexOfLast - resultsPerPage;
  const currentResults = sortedResults.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(
    1,
    Math.ceil(sortedResults.length / resultsPerPage),
  );

  const top3 = sortedResults.slice(0, 3);

  return (
    <Layout>
      <style>{styles}</style>
      <div className="lb-root">
        <div className="container-fluid px-4">
          {/* Header */}
          <div className="lb-header">
            <div>
              <div className="lb-breadcrumb">Admin · Leaderboard</div>
              <h1 className="lb-title">
                Leader<span>board</span>
              </h1>
            </div>

            {/* Right: badge + export button */}
            <div className="lb-header-right">
              <span className="lb-badge">{sortedResults.length} players</span>
              {sortedResults.length > 0 && (
                <ExportButton
                  sortedResults={sortedResults}
                  usernames={usernames}
                />
              )}
            </div>
          </div>

          {/* Grid */}
          <div className="lb-grid">
            <div>
              <AdminMenu />
            </div>

            <div>
              <div className="lb-section-label">Top scores</div>

              {sortedResults.length === 0 ? (
                <div className="lb-card">
                  <div className="lb-empty">
                    <div className="lb-empty-icon">🏆</div>
                    <div className="lb-empty-title">No scores yet</div>
                    <p className="lb-empty-sub">
                      Once users start attempting quizzes, their scores will
                      appear here.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Podium — always shows top 3 regardless of page */}
                  {top3.length >= 1 && (
                    <div className="lb-podium">
                      {top3.map((result, i) => {
                        const name = usernames[result.userId] || "—";
                        const pct = result.totalQuestions
                          ? Math.round(
                              (result.score / result.totalQuestions) * 100,
                            )
                          : 0;
                        return (
                          <div
                            key={result.userId}
                            className={`lb-podium-card rank-${i + 1}`}
                          >
                            <div className="lb-podium-medal">
                              {MEDAL_ICONS[i]}
                            </div>
                            <div className={`lb-podium-rank rank-${i + 1}`}>
                              {RANK_LABELS[i]}
                            </div>
                            <div className="lb-podium-name">{name}</div>
                            <div className={`lb-podium-score rank-${i + 1}`}>
                              {result.score}
                            </div>
                            <div className="lb-podium-total">
                              / {result.totalQuestions} · {pct}%
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Full table */}
                  <div className="lb-card">
                    <table className="lb-table">
                      <thead>
                        <tr>
                          <th className="center" style={{ width: 60 }}>
                            Rank
                          </th>
                          <th>Player</th>
                          <th className="center">Best Score</th>
                          <th>Accuracy</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentResults.map((result, i) => {
                          const globalRank = i + 1 + indexOfFirst;
                          const medal = MEDALS[globalRank - 1] || null;
                          const name = usernames[result.userId] || "Loading…";
                          const pct = result.totalQuestions
                            ? Math.round(
                                (result.score / result.totalQuestions) * 100,
                              )
                            : 0;

                          return (
                            <tr
                              key={result.userId}
                              className={medal ? "is-top" : ""}
                            >
                              {/* Rank */}
                              <td className="center">
                                <div className="lb-rank-cell">
                                  {medal ? (
                                    <span className={`lb-rank-badge ${medal}`}>
                                      {globalRank}
                                    </span>
                                  ) : (
                                    <span className="lb-rank-num">
                                      #{globalRank}
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Player */}
                              <td>
                                <div className="lb-user-cell">
                                  <div
                                    className={`lb-avatar${medal ? ` ${medal}` : ""}`}
                                  >
                                    {getInitials(name)}
                                  </div>
                                  <span className="lb-username">{name}</span>
                                </div>
                              </td>

                              {/* Score */}
                              <td className="center">
                                <span
                                  className={`lb-score${medal ? ` ${medal}` : ""}`}
                                >
                                  {result.score}
                                  <span
                                    style={{
                                      fontWeight: 400,
                                      opacity: 0.4,
                                      fontSize: 11,
                                    }}
                                  >
                                    /{result.totalQuestions}
                                  </span>
                                </span>
                              </td>

                              {/* Accuracy bar */}
                              <td>
                                <div className="lb-pct-wrap">
                                  <div className="lb-pct-track">
                                    <div
                                      className={`lb-pct-fill${medal ? ` ${medal}` : ""}`}
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                  <span className="lb-pct-label">{pct}%</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {sortedResults.length > resultsPerPage && (
                    <div className="lb-pagination">
                      <button
                        className="lb-page-btn"
                        onClick={() =>
                          setCurrentPage((p) => Math.max(p - 1, 1))
                        }
                        disabled={currentPage === 1}
                      >
                        ← Prev
                      </button>
                      <span className="lb-page-info">
                        Page <strong>{currentPage}</strong> of{" "}
                        <strong>{totalPages}</strong>
                      </span>
                      <button
                        className="lb-page-btn"
                        onClick={() =>
                          setCurrentPage((p) => Math.min(p + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LeaderboardPage;
