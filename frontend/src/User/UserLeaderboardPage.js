import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/authContext";
import axios from "axios";
import UserMenu from "./UserMenu";

const API_URL = process.env.REACT_APP_API_URL;

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  .ul-root {
    min-height: 100vh;
    background: #050709;
    font-family: 'Syne', sans-serif;
    position: relative;
  }
  .ul-root::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.013) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.013) 1px, transparent 1px);
    background-size: 52px 52px;
    pointer-events: none; z-index: 0;
  }
  .ul-glow {
    position: fixed; border-radius: 50%;
    pointer-events: none; z-index: 0; filter: blur(100px);
  }
  .ul-glow-1 {
    width: 600px; height: 600px; top: -200px; left: -200px;
    background: radial-gradient(circle, rgba(0,255,136,0.04) 0%, transparent 70%);
  }
  .ul-glow-2 {
    width: 400px; height: 400px; bottom: 0; right: -100px;
    background: radial-gradient(circle, rgba(0,200,255,0.035) 0%, transparent 70%);
  }

  .ul-wrap {
    position: relative; z-index: 1;
    padding: 48px 24px 80px;
  }

  /* ── Header ── */
  .ul-header { margin-bottom: 44px; display: flex; flex-direction: column; gap: 6px; }
  .ul-header-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem; font-weight: 500;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: #00ff88; opacity: 0.7;
  }
  .ul-header h1 {
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    font-weight: 800; color: #f0f0f5;
    margin: 0; letter-spacing: -0.02em; line-height: 1.1;
  }
  .ul-header h1 span { color: #00ff88; }

  /* ── Layout ── */
  .ul-layout { display: flex; gap: 28px; align-items: flex-start; }
  .ul-sidebar { width: 220px; flex-shrink: 0; }
  .ul-main { flex: 1; min-width: 0; }

  /* ── Podium (top 3) ── */
  .ul-podium {
  display: flex; align-items: flex-end; justify-content: center;
  gap: 16px; margin-bottom: 32px; padding: 28px 20px 0;
}
.ul-pod {
  flex: 1; max-width: 160px;
  display: flex; flex-direction: column; align-items: center; gap: 8px;
}
.ul-pod-avatar {
  width: 48px; height: 48px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem; font-weight: 800;
  font-family: 'Syne', sans-serif; color: #f0f0f5;
}
.ul-pod-name {
  font-size: 0.8rem; font-weight: 700; color: rgba(255,255,255,0.7);
  text-align: center; max-width: 120px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.ul-pod-score {
  font-family: 'DM Mono', monospace;
  font-size: 0.9rem; font-weight: 500;
}
.ul-pod-platform {
  width: 100%; border-radius: 10px 10px 0 0;
  display: flex; align-items: center; justify-content: center;
  padding: 12px 0;
}
.ul-pod-medal { font-size: 1.1rem; }

/* rank-specific */
.ul-pod-1 .ul-pod-avatar { background: rgba(255,213,0,0.1); border: 1px solid rgba(255,213,0,0.25); }
.ul-pod-1 .ul-pod-score  { color: #ffd500; }
.ul-pod-1 .ul-pod-platform { height: 72px; background: rgba(255,213,0,0.05); border: 1px solid rgba(255,213,0,0.12); border-bottom: none; }

.ul-pod-2 .ul-pod-avatar { background: rgba(148,163,184,0.08); border: 1px solid rgba(148,163,184,0.2); }
.ul-pod-2 .ul-pod-score  { color: #94a3b8; }
.ul-pod-2 .ul-pod-platform { height: 52px; background: rgba(148,163,184,0.04); border: 1px solid rgba(148,163,184,0.1); border-bottom: none; }

.ul-pod-3 .ul-pod-avatar { background: rgba(205,127,50,0.08); border: 1px solid rgba(205,127,50,0.2); }
.ul-pod-3 .ul-pod-score  { color: #cd7f32; }
.ul-pod-3 .ul-pod-platform { height: 38px; background: rgba(205,127,50,0.04); border: 1px solid rgba(205,127,50,0.1); border-bottom: none; }

  .ul-podium {
    display: flex; align-items: flex-end; justify-content: center;
    gap: 12px; margin-bottom: 32px; padding: 28px 20px 0;
  }
  .ul-pod {
    flex: 1; max-width: 160px;
    display: flex; flex-direction: column; align-items: center; gap: 10px;
  }
  .ul-pod-avatar {
    width: 52px; height: 52px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem; font-weight: 800;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04);
    color: #f0f0f5; letter-spacing: -0.02em;
    font-family: 'Syne', sans-serif;
  }
  .ul-pod-name {
    font-size: 0.8rem; font-weight: 700; color: rgba(255,255,255,0.7);
    text-align: center; max-width: 120px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .ul-pod-score {
    font-family: 'DM Mono', monospace;
    font-size: 1rem; font-weight: 500; letter-spacing: 0.02em;
  }
  .ul-pod-block {
    width: 100%; border-radius: 10px 10px 0 0;
    display: flex; flex-direction: column; align-items: center; justify-content: flex-end;
    padding: 10px 0;
    border: 1px solid rgba(255,255,255,0.07); border-bottom: none;
  }
  .ul-pod-rank {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem; font-weight: 500; letter-spacing: 0.08em;
    opacity: 0.5;
  }

  /* rank-specific colours */
  .ul-pod-1 .ul-pod-avatar { border-color: rgba(255,213,0,0.3); background: rgba(255,213,0,0.07); }
  .ul-pod-1 .ul-pod-score  { color: #ffd500; }
  .ul-pod-1 .ul-pod-block  { height: 72px; background: rgba(255,213,0,0.04); border-color: rgba(255,213,0,0.15); }
  .ul-pod-1 .ul-pod-rank   { color: #ffd500; }

  .ul-pod-2 .ul-pod-avatar { border-color: rgba(148,163,184,0.3); background: rgba(148,163,184,0.06); }
  .ul-pod-2 .ul-pod-score  { color: #94a3b8; }
  .ul-pod-2 .ul-pod-block  { height: 52px; background: rgba(148,163,184,0.03); border-color: rgba(148,163,184,0.12); }
  .ul-pod-2 .ul-pod-rank   { color: #94a3b8; }

  .ul-pod-3 .ul-pod-avatar { border-color: rgba(205,127,50,0.3); background: rgba(205,127,50,0.06); }
  .ul-pod-3 .ul-pod-score  { color: #cd7f32; }
  .ul-pod-3 .ul-pod-block  { height: 38px; background: rgba(205,127,50,0.03); border-color: rgba(205,127,50,0.12); }
  .ul-pod-3 .ul-pod-rank   { color: #cd7f32; }

  /* ── Table card ── */
  .ul-card {
    background: #0b0e14;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; overflow: hidden;
  }

  .ul-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
  .ul-table thead tr {
    background: rgba(255,255,255,0.025);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .ul-table th {
    padding: 11px 20px;
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem; font-weight: 500;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(255,255,255,0.25); text-align: left;
  }
  .ul-table th.center { text-align: center; }
  .ul-table tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.15s;
  }
  .ul-table tbody tr:last-child { border-bottom: none; }
  .ul-table tbody tr:hover { background: rgba(255,255,255,0.018); }
  .ul-table tbody tr.ul-me { background: rgba(0,255,136,0.04); }
  .ul-table tbody tr.ul-me:hover { background: rgba(0,255,136,0.07); }
  .ul-table td {
    padding: 14px 20px; color: rgba(255,255,255,0.55);
    vertical-align: middle; font-weight: 400;
  }
  .ul-table td.center { text-align: center; }

  /* rank badge */
  .ul-rank {
    display: inline-flex; align-items: center; justify-content: center;
    width: 28px; height: 28px; border-radius: 8px;
    font-family: 'DM Mono', monospace; font-size: 0.72rem; font-weight: 500;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.3);
  }
  .ul-rank.gold   { background: rgba(255,213,0,0.08);   border-color: rgba(255,213,0,0.25);   color: #ffd500; }
  .ul-rank.silver { background: rgba(148,163,184,0.08); border-color: rgba(148,163,184,0.25); color: #94a3b8; }
  .ul-rank.bronze { background: rgba(205,127,50,0.08);  border-color: rgba(205,127,50,0.25);  color: #cd7f32; }

  .ul-username { font-weight: 700; color: rgba(255,255,255,0.75); }
  .ul-you {
    display: inline-flex; align-items: center;
    margin-left: 8px; padding: 2px 8px; border-radius: 5px;
    font-size: 0.65rem; font-weight: 600; letter-spacing: 0.08em;
    background: rgba(0,255,136,0.08); border: 1px solid rgba(0,255,136,0.2); color: #00ff88;
    font-family: 'DM Mono', monospace; text-transform: uppercase;
  }

  .ul-score-wrap { display: flex; align-items: center; gap: 10px; }
  .ul-score-val {
    font-family: 'DM Mono', monospace; font-size: 0.88rem;
    font-weight: 500; color: #00ff88; min-width: 28px;
  }
  .ul-bar-track {
    flex: 1; height: 3px;
    background: rgba(255,255,255,0.05); border-radius: 99px; overflow: hidden;
  }
  .ul-bar-fill { height: 100%; background: #00ff88; border-radius: 99px; }

  /* ── Loading ── */
  .ul-loading {
    min-height: 100vh; background: #050709;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px;
  }
  .ul-spinner { position: relative; width: 44px; height: 44px; }
  .ul-spinner::before, .ul-spinner::after {
    content: ''; position: absolute; border-radius: 50%; border: 2px solid transparent;
  }
  .ul-spinner::before {
    inset: 0; border-top-color: #00ff88; border-right-color: #00ff88;
    animation: ul-spin 1s linear infinite;
  }
  .ul-spinner::after {
    inset: 9px; border-bottom-color: rgba(0,255,136,0.25); border-left-color: rgba(0,255,136,0.25);
    animation: ul-spin 1.7s linear infinite reverse;
  }
  @keyframes ul-spin { to { transform: rotate(360deg); } }
  .ul-loading-text {
    font-family: 'DM Mono', monospace; font-size: 0.75rem;
    color: rgba(255,255,255,0.2); letter-spacing: 0.1em; text-transform: uppercase;
  }

  /* ── Pagination ── */
  .ul-pagination {
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
    padding: 16px 20px; border-top: 1px solid rgba(255,255,255,0.06);
    flex-wrap: wrap;
  }
  .ul-page-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 9px 18px; border-radius: 10px;
    background: transparent; border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.4); font-family: 'Syne', sans-serif;
    font-size: 0.8rem; font-weight: 600; cursor: pointer;
    transition: all 0.2s;
  }
  .ul-page-btn:hover:not(:disabled) { border-color: rgba(0,255,136,0.3); color: #00ff88; }
  .ul-page-btn:disabled { opacity: 0.2; cursor: not-allowed; }
  .ul-page-info {
    font-family: 'DM Mono', monospace; font-size: 0.72rem;
    color: rgba(255,255,255,0.2); letter-spacing: 0.06em;
  }

  @media (max-width: 768px) {
    .ul-layout { flex-direction: column; }
    .ul-sidebar { width: 100%; }
    .ul-podium { padding: 16px 8px 0; }
    .ul-pod { max-width: 110px; }
  }
`;

const MEDALS = ["gold", "silver", "bronze"];
const MEDAL_LABELS = ["🥇", "🥈", "🥉"];

const UserLeaderboardPage = () => {
  const { auth } = useAuth();
  const [results, setResults] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  const fetchUsernames = async (userIds) => {
    const unique = [...new Set(userIds)];
    const responses = await Promise.all(
      unique.map((userId) =>
        axios
          .get(`${API_URL}/api/result/get-username/${userId}`)
          .then(({ data }) => ({ userId, username: data.userName }))
          .catch(() => ({ userId, username: "Unknown" })),
      ),
    );
    const map = {};
    responses.forEach(({ userId, username }) => (map[userId] = username));
    setUsernames(map);
  };

  const fetchResults = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/result/get-all-results`);
      setResults(data.results);
      fetchUsernames(data.results.map((r) => r.userId));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="ul-loading">
        <style>{CSS}</style>
        <div className="ul-spinner" />
        <p className="ul-loading-text">Loading leaderboard…</p>
      </div>
    );
  }

  // Aggregate best score per user
  const aggregated = results.reduce((acc, r) => {
    if (!acc[r.userId] || acc[r.userId].score < r.score) {
      acc[r.userId] = {
        userId: r.userId,
        score: r.score,
        totalQuestions: r.answers.length,
      };
    }
    return acc;
  }, {});
  const sorted = Object.values(aggregated).sort((a, b) => b.score - a.score);
  const maxScore = sorted[0]?.score || 1;

  const top3 = sorted.slice(0, 3);
  // reorder for podium: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);
  const podiumRanks = top3[1] ? [2, 1, 3] : [1, 3].slice(0, top3.length);

  const totalPages = Math.ceil(sorted.length / resultsPerPage);
  const paginated = sorted.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage,
  );

  return (
    <Layout>
      <style>{CSS}</style>
      <div className="ul-root">
        <div className="ul-glow ul-glow-1" />
        <div className="ul-glow ul-glow-2" />

        <div className="ul-wrap">
          <div className="ul-header">
            <span className="ul-header-label">Dashboard · Leaderboard</span>
            <h1>
              Top <span>Performers</span>
            </h1>
          </div>

          <div className="ul-layout">
            <div className="ul-sidebar">
              <UserMenu />
            </div>

            <div className="ul-main">
              {/* Podium */}
              {top3.length > 0 && (
                <div className="ul-podium">
                  {podiumOrder.map((entry, i) => {
                    const rank = podiumRanks[i];
                    const name = usernames[entry.userId] || "…";
                    const initial = name.charAt(0).toUpperCase();
                    return (
                      <div
                        key={entry.userId}
                        className={`ul-pod ul-pod-${rank}`}
                      >
                        <div className="ul-pod-avatar">{initial}</div>
                        <div className="ul-pod-name">{name}</div>
                        <div className="ul-pod-score">{entry.score} pts</div>
                        <div className="ul-pod-platform">
                          <span className="ul-pod-medal">
                            {MEDAL_LABELS[rank - 1]}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Full table */}
              <div className="ul-card">
                <table className="ul-table">
                  <thead>
                    <tr>
                      <th style={{ width: 52 }} className="center">
                        Rank
                      </th>
                      <th>Player</th>
                      <th>Score</th>
                      <th className="center">Questions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((entry, i) => {
                      const globalRank =
                        i + 1 + (currentPage - 1) * resultsPerPage;
                      const isMe = auth?.user?._id === entry.userId;
                      const name = usernames[entry.userId] || "Loading…";
                      const medalClass =
                        globalRank <= 3 ? MEDALS[globalRank - 1] : "";
                      const pct = Math.round((entry.score / maxScore) * 100);

                      return (
                        <tr key={entry.userId} className={isMe ? "ul-me" : ""}>
                          <td className="center">
                            <span className={`ul-rank ${medalClass}`}>
                              {globalRank}
                            </span>
                          </td>
                          <td>
                            <span className="ul-username">{name}</span>
                            {isMe && <span className="ul-you">you</span>}
                          </td>
                          <td>
                            <div className="ul-score-wrap">
                              <span className="ul-score-val">
                                {entry.score}
                              </span>
                              <div className="ul-bar-track">
                                <div
                                  className="ul-bar-fill"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td
                            className="center"
                            style={{
                              fontFamily: "'DM Mono', monospace",
                              fontSize: "0.8rem",
                              color: "rgba(255,255,255,0.3)",
                            }}
                          >
                            {entry.totalQuestions}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {totalPages > 1 && (
                  <div className="ul-pagination">
                    <button
                      className="ul-page-btn"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      ← Prev
                    </button>
                    <span className="ul-page-info">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      className="ul-page-btn"
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
      </div>
    </Layout>
  );
};

export default UserLeaderboardPage;
