import React from "react";
import { useAuth } from "../context/authContext";
import AdminMenu from "./AdminMenu";
import { format } from "date-fns";
import Layout from "../components/layout/Layout.js";

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');

  .ad-root * { box-sizing: border-box; }

  .ad-root {
    font-family: 'Syne', sans-serif;
    background: #0a0a0f;
    min-height: 100vh;
    color: #e8e8f0;
  }

  /* ── Header ── */
  .ad-header {
    padding: 36px 0 28px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 32px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }
  .ad-breadcrumb {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.18em;
    color: #39ff7e;
    text-transform: uppercase;
    margin-bottom: 8px;
    opacity: 0.9;
  }
  .ad-title {
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 800;
    letter-spacing: -0.02em;
    margin: 0;
    line-height: 1;
  }
  .ad-title span { color: #39ff7e; }

  .ad-status-dot {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    background: rgba(57,255,126,0.1);
    color: #39ff7e;
    border: 1px solid rgba(57,255,126,0.25);
    padding: 5px 14px;
    border-radius: 100px;
    white-space: nowrap;
  }
  .ad-status-dot::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #39ff7e;
    box-shadow: 0 0 6px #39ff7e;
    animation: ad-pulse 2s ease-in-out infinite;
  }
  @keyframes ad-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  /* ── Layout grid ── */
  .ad-grid {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 24px;
    align-items: start;
  }
  @media (max-width: 768px) {
    .ad-grid { grid-template-columns: 1fr; }
  }

  /* ── Section label ── */
  .ad-section-label {
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
  .ad-section-label::before {
    content: '';
    display: block;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #39ff7e;
    box-shadow: 0 0 8px #39ff7e;
    flex-shrink: 0;
  }

  /* ── Stats strip ── */
  .ad-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 16px;
  }
  @media (max-width: 480px) {
    .ad-stats { grid-template-columns: 1fr; }
  }

  .ad-stat-card {
    background: #111118;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    padding: 18px 20px;
    transition: border-color 0.2s;
  }
  .ad-stat-card:hover { border-color: rgba(255,255,255,0.13); }

  .ad-stat-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(232,232,240,0.35);
    margin-bottom: 8px;
  }

  .ad-stat-val {
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1;
  }
  .ad-stat-val.green  { color: #39ff7e; }
  .ad-stat-val.yellow { color: #ffc400; }
  .ad-stat-val.blue   { color: #50a0ff; font-size: 15px; padding-top: 5px; display: block; }

  .ad-stat-sub {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: rgba(232,232,240,0.3);
    margin-top: 4px;
  }

  /* ── Profile hero ── */
  .ad-profile-hero {
    background: #111118;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 24px 28px;
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 16px;
    flex-wrap: wrap;
    transition: border-color 0.2s;
  }
  .ad-profile-hero:hover { border-color: rgba(255,255,255,0.13); }

  .ad-avatar {
    width: 64px; height: 64px;
    border-radius: 16px;
    background: rgba(57,255,126,0.12);
    border: 1px solid rgba(57,255,126,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Mono', monospace;
    font-size: 22px;
    font-weight: 700;
    color: #39ff7e;
    flex-shrink: 0;
    letter-spacing: -0.02em;
  }

  .ad-profile-info { flex: 1; min-width: 0; }

  .ad-welcome {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(232,232,240,0.35);
    margin-bottom: 4px;
  }

  .ad-name {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    color: #e8e8f0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ad-role-pill {
    display: inline-block;
    margin-top: 6px;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    background: rgba(57,255,126,0.1);
    color: #39ff7e;
    border: 1px solid rgba(57,255,126,0.25);
    padding: 2px 10px;
    border-radius: 100px;
  }

  /* ── Info rows ── */
  .ad-info-card {
    background: #111118;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 16px;
  }

  .ad-info-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 15px 24px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.15s;
  }
  .ad-info-row:last-child { border-bottom: none; }
  .ad-info-row:hover { background: rgba(255,255,255,0.02); }

  .ad-info-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .ad-info-icon {
    width: 32px; height: 32px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
  }
  .ad-info-icon.green  { background: rgba(57,255,126,0.1);  border: 1px solid rgba(57,255,126,0.2); }
  .ad-info-icon.yellow { background: rgba(255,196,0,0.1);   border: 1px solid rgba(255,196,0,0.2); }
  .ad-info-icon.blue   { background: rgba(80,160,255,0.1);  border: 1px solid rgba(80,160,255,0.2); }

  .ad-info-key {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(232,232,240,0.4);
  }

  .ad-info-val {
    font-size: 13px;
    color: rgba(232,232,240,0.85);
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 240px;
    text-align: right;
  }

  .ad-streak-val {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    color: #ffc400;
  }

  /* ── Badge chips ── */
  .ad-badges-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .ad-badge-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.06em;
    padding: 4px 11px;
    border-radius: 100px;
    border: 1px solid;
    white-space: nowrap;
    font-weight: 500;
  }
  .ad-badge-chip.gold {
    background: rgba(255,196,0,0.1);
    color: #ffc400;
    border-color: rgba(255,196,0,0.3);
  }
  .ad-badge-chip.cyan {
    background: rgba(0,220,255,0.08);
    color: #00dcff;
    border-color: rgba(0,220,255,0.25);
  }
`;

/* ─── Helper ──────────────────────────────────────────────────────────────── */
const getInitials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

/* ─── Component ──────────────────────────────────────────────────────────── */
const AdminDashboard = () => {
  const { auth } = useAuth();
  const joinedDate = new Date(auth?.user?.createdAt);
  const formattedDate = !isNaN(joinedDate)
    ? format(joinedDate, "MMMM dd, yyyy")
    : "N/A";

  return (
    <Layout>
      <style>{styles}</style>
      <div className="ad-root">
        <div className="container-fluid px-4">
          {/* Header */}
          <div className="ad-header">
            <div>
              <div className="ad-breadcrumb">Admin · Dashboard</div>
              <h1 className="ad-title">
                Admin <span>Panel</span>
              </h1>
            </div>
            <span className="ad-status-dot">Online</span>
          </div>

          {/* Grid */}
          <div className="ad-grid">
            <div>
              <AdminMenu />
            </div>

            <div>
              <div className="ad-section-label">Overview</div>

              {/* Stats strip */}
              <div className="ad-stats">
                <div className="ad-stat-card">
                  <div className="ad-stat-label">Highest Streak</div>
                  <div className="ad-stat-val yellow">14</div>
                  <div className="ad-stat-sub">days</div>
                </div>
                <div className="ad-stat-card">
                  <div className="ad-stat-label">Badges Earned</div>
                  <div className="ad-stat-val green">2</div>
                  <div className="ad-stat-sub">total</div>
                </div>
                <div className="ad-stat-card">
                  <div className="ad-stat-label">Member Since</div>
                  <div className="ad-stat-val blue">{formattedDate}</div>
                  <div className="ad-stat-sub">joined</div>
                </div>
              </div>

              {/* Profile hero */}
              <div className="ad-profile-hero">
                <div className="ad-avatar">{getInitials(auth?.user?.name)}</div>
                <div className="ad-profile-info">
                  <div className="ad-welcome">Welcome back</div>
                  <div className="ad-name">{auth?.user?.name || "Admin"}</div>
                  <span className="ad-role-pill">Administrator</span>
                </div>
              </div>

              {/* Info rows */}
              <div className="ad-info-card">
                <div className="ad-info-row">
                  <div className="ad-info-left">
                    <div className="ad-info-icon green">✉</div>
                    <span className="ad-info-key">Email</span>
                  </div>
                  <span className="ad-info-val">
                    {auth?.user?.email || "N/A"}
                  </span>
                </div>

                <div className="ad-info-row">
                  <div className="ad-info-left">
                    <div className="ad-info-icon yellow">🔥</div>
                    <span className="ad-info-key">Highest Streak</span>
                  </div>
                  <span className="ad-streak-val">14 days 🔥</span>
                </div>

                <div className="ad-info-row">
                  <div className="ad-info-left">
                    <div className="ad-info-icon blue">🏅</div>
                    <span className="ad-info-key">Badges</span>
                  </div>
                  <div className="ad-badges-row">
                    <span className="ad-badge-chip gold">⚡ Quick Thinker</span>
                    <span className="ad-badge-chip cyan">✦ Perfect Score</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
