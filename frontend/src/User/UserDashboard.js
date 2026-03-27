import React from "react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/authContext";
import UserMenu from "./UserMenu";
import { format } from "date-fns";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  .ud-root {
    min-height: 100vh;
    background: #050709;
    font-family: 'Syne', sans-serif;
    position: relative;
  }
  .ud-root::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.013) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.013) 1px, transparent 1px);
    background-size: 52px 52px;
    pointer-events: none; z-index: 0;
  }
  .ud-glow {
    position: fixed; border-radius: 50%;
    pointer-events: none; z-index: 0; filter: blur(100px);
  }
  .ud-glow-1 {
    width: 600px; height: 600px; top: -200px; left: -200px;
    background: radial-gradient(circle, rgba(0,255,136,0.04) 0%, transparent 70%);
  }
  .ud-glow-2 {
    width: 400px; height: 400px; bottom: 0; right: -100px;
    background: radial-gradient(circle, rgba(0,200,255,0.035) 0%, transparent 70%);
  }

  .ud-wrap {
    position: relative; z-index: 1;
    padding: 48px 24px 80px;
  }

  /* ── Header ── */
  .ud-header { margin-bottom: 44px; display: flex; flex-direction: column; gap: 6px; }
  .ud-header-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem; font-weight: 500;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: #00ff88; opacity: 0.7;
  }
  .ud-header h1 {
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    font-weight: 800; color: #f0f0f5;
    margin: 0; letter-spacing: -0.02em; line-height: 1.1;
  }
  .ud-header h1 span { color: #00ff88; }

  /* ── Layout ── */
  .ud-layout { display: flex; gap: 28px; align-items: flex-start; }
  .ud-sidebar { width: 220px; flex-shrink: 0; }
  .ud-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 20px; }

  /* ── Avatar card ── */
  .ud-avatar-card {
    background: #0b0e14;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; overflow: hidden;
    padding: 28px;
    display: flex; align-items: center; gap: 24px;
    animation: ud-in 0.4s ease both;
  }
  @keyframes ud-in {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ud-avatar {
    width: 68px; height: 68px; border-radius: 18px; flex-shrink: 0;
    background: rgba(0,255,136,0.07);
    border: 1px solid rgba(0,255,136,0.18);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.8rem; font-weight: 800; color: #00ff88;
    font-family: 'Syne', sans-serif; letter-spacing: -0.02em;
  }
  .ud-avatar-info { display: flex; flex-direction: column; gap: 5px; }
  .ud-name {
    font-size: 1.3rem; font-weight: 800; color: #f0f0f5;
    letter-spacing: -0.02em; line-height: 1;
  }
  .ud-role {
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem; font-weight: 500;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(0,255,136,0.55);
  }

  /* ── Info card ── */
  .ud-info-card {
    background: #0b0e14;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; overflow: hidden;
    animation: ud-in 0.4s ease 0.08s both;
  }
  .ud-info-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 24px; gap: 16px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .ud-info-row:last-child { border-bottom: none; }
  .ud-info-label {
    display: flex; align-items: center; gap: 10px;
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(255,255,255,0.22);
  }
  .ud-info-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: rgba(255,255,255,0.12); flex-shrink: 0;
  }
  .ud-info-value {
    font-size: 0.88rem; font-weight: 600;
    color: rgba(255,255,255,0.65);
    font-family: 'Syne', sans-serif;
  }

  /* ── Badges card ── */
  .ud-badges-card {
    background: #0b0e14;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; overflow: hidden;
    animation: ud-in 0.4s ease 0.14s both;
  }
  .ud-badges-header {
    padding: 14px 24px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    display: flex; align-items: center; gap: 8px;
  }
  .ud-badges-header-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #00ff88;
    box-shadow: 0 0 6px #00ff88;
  }
  .ud-badges-header-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem; font-weight: 500;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(255,255,255,0.22);
  }
  .ud-badges-body {
    padding: 20px 24px;
    display: flex; flex-wrap: wrap; gap: 10px;
  }
  .ud-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 9px 16px; border-radius: 10px;
    font-size: 0.8rem; font-weight: 600;
    font-family: 'Syne', sans-serif;
    letter-spacing: 0.01em;
  }
  .ud-badge-gold {
    background: rgba(255,213,0,0.07);
    border: 1px solid rgba(255,213,0,0.2);
    color: #ffd500;
  }
  .ud-badge-cyan {
    background: rgba(0,200,255,0.07);
    border: 1px solid rgba(0,200,255,0.2);
    color: #00c8ff;
  }
  .ud-badge-icon { font-size: 0.9rem; }

  @media (max-width: 768px) {
    .ud-layout { flex-direction: column; }
    .ud-sidebar { width: 100%; }
    .ud-avatar-card { flex-direction: column; text-align: center; }
  }
`;

const UserDashboard = () => {
  const { auth } = useAuth();
  const name = auth?.user?.name || "User";
  const initial = name.charAt(0).toUpperCase();
  const joinedDate = auth?.user?.createdAt
    ? format(new Date(auth.user.createdAt), "MMMM dd, yyyy")
    : "N/A";

  return (
    <Layout>
      <style>{CSS}</style>
      <div className="ud-root">
        <div className="ud-glow ud-glow-1" />
        <div className="ud-glow ud-glow-2" />

        <div className="ud-wrap">
          {/* Header */}
          <div className="ud-header">
            <span className="ud-header-label">Dashboard · Profile</span>
            <h1>
              Welcome back, <span>{name}</span>
            </h1>
          </div>

          <div className="ud-layout">
            <div className="ud-sidebar">
              <UserMenu />
            </div>

            <div className="ud-main">
              {/* Avatar card */}
              <div className="ud-avatar-card">
                <div className="ud-avatar">{initial}</div>
                <div className="ud-avatar-info">
                  <div className="ud-name">{name}</div>
                  <div className="ud-role">Member</div>
                </div>
              </div>

              {/* Info card */}
              <div className="ud-info-card">
                <div className="ud-info-row">
                  <span className="ud-info-label">
                    <span className="ud-info-dot" /> Email
                  </span>
                  <span className="ud-info-value">
                    {auth?.user?.email || "N/A"}
                  </span>
                </div>
                <div className="ud-info-row">
                  <span className="ud-info-label">
                    <span className="ud-info-dot" /> Member since
                  </span>
                  <span className="ud-info-value">{joinedDate}</span>
                </div>
                <div className="ud-info-row">
                  <span className="ud-info-label">
                    <span className="ud-info-dot" /> Role
                  </span>
                  <span className="ud-info-value">
                    {auth?.user?.role || "User"}
                  </span>
                </div>
              </div>

              {/* Badges card */}
              <div className="ud-badges-card">
                <div className="ud-badges-header">
                  <span className="ud-badges-header-dot" />
                  <span className="ud-badges-header-label">Achievements</span>
                </div>
                <div className="ud-badges-body">
                  <span className="ud-badge ud-badge-gold">
                    <span className="ud-badge-icon">⚡</span>
                    Quick Thinker
                  </span>
                  <span className="ud-badge ud-badge-cyan">
                    <span className="ud-badge-icon">✦</span>
                    Perfect Score
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
