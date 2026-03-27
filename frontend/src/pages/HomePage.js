// src/pages/HomePage.js
import React from "react";
import Layout from "../components/layout/Layout.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext.js";
import toast from "react-hot-toast";

const HomePage = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const user = auth?.user;

  const handleStartQuiz = () => {
    if (!user) {
      toast.error("Please log in to start a quiz 🙂");
      navigate("/login");
      return;
    }
    navigate("/select-quiz");
  };

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .home-root {
          min-height: 100vh;
          background: #0a0a0a;
          color: #e8e8e8;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Ambient background blobs */
        .home-root::before {
          content: '';
          position: fixed;
          top: -200px;
          left: -200px;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(52, 211, 153, 0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .home-root::after {
          content: '';
          position: fixed;
          bottom: -200px;
          right: -100px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(52, 211, 153, 0.05) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .home-inner {
          position: relative;
          z-index: 1;
          max-width: 960px;
          margin: 0 auto;
          padding: 80px 24px 60px;
        }

        /* Badge */
        .mqa-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(52, 211, 153, 0.1);
          border: 1px solid rgba(52, 211, 153, 0.3);
          color: #34d399;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 100px;
          margin-bottom: 32px;
        }
        .mqa-badge-dot {
          width: 7px;
          height: 7px;
          background: #34d399;
          border-radius: 50%;
          animation: pulse-dot 2s infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.7); }
        }

        /* Hero heading */
        .hero-heading {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.8rem, 6vw, 4.5rem);
          font-weight: 800;
          line-height: 1.08;
          letter-spacing: -0.02em;
          color: #f0f0f0;
          margin-bottom: 20px;
        }
        .hero-heading .accent {
          color: #34d399;
        }

        .hero-sub {
          font-size: 1.05rem;
          color: #888;
          max-width: 560px;
          margin: 0 auto 32px;
          line-height: 1.7;
        }

        /* Feature pills */
        .feature-pills {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-bottom: 40px;
        }
        .pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 100px;
          padding: 7px 16px;
          font-size: 0.88rem;
          color: #ccc;
          font-weight: 500;
          transition: border-color 0.2s, color 0.2s;
        }
        .pill:hover {
          border-color: rgba(52, 211, 153, 0.4);
          color: #34d399;
        }

        /* CTA buttons */
        .cta-group {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          margin-bottom: 16px;
        }
        .btn-primary-dark {
          background: #34d399;
          color: #0a0a0a;
          border: none;
          border-radius: 8px;
          padding: 14px 32px;
          font-size: 0.95rem;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 0 24px rgba(52, 211, 153, 0.25);
        }
        .btn-primary-dark:hover {
          background: #6ee7b7;
          transform: translateY(-1px);
          box-shadow: 0 0 36px rgba(52, 211, 153, 0.4);
        }
        .btn-secondary-dark {
          background: transparent;
          color: #e8e8e8;
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 8px;
          padding: 14px 32px;
          font-size: 0.95rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .btn-secondary-dark:hover {
          border-color: rgba(52, 211, 153, 0.5);
          color: #34d399;
          background: rgba(52, 211, 153, 0.05);
        }

        .login-hint {
          font-size: 0.8rem;
          color: #555;
          margin-top: 4px;
        }

        /* Divider */
        .section-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.06);
          margin: 64px 0 48px;
        }

        /* Stats row */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 48px;
        }
        .stat-cell {
          background: #0f0f0f;
          padding: 28px 20px;
          text-align: center;
        }
        .stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          color: #34d399;
          line-height: 1;
          margin-bottom: 6px;
        }
        .stat-label {
          font-size: 0.8rem;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 500;
        }

        /* Feature cards */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 640px) {
          .features-grid { grid-template-columns: 1fr; }
          .stats-row { grid-template-columns: 1fr; }
          .hero-heading { font-size: 2.4rem; }
        }
        .feature-card {
          background: #111;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 28px 24px;
          transition: border-color 0.25s, transform 0.2s;
          position: relative;
          overflow: hidden;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(52,211,153,0.4), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .feature-card:hover {
          border-color: rgba(52, 211, 153, 0.25);
          transform: translateY(-3px);
        }
        .feature-card:hover::before {
          opacity: 1;
        }
        .feature-icon {
          font-size: 1.6rem;
          margin-bottom: 14px;
          display: block;
        }
        .feature-title {
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #e8e8e8;
          margin-bottom: 8px;
        }
        .feature-desc {
          font-size: 0.85rem;
          color: #666;
          line-height: 1.6;
          margin: 0;
        }

        /* Bottom CTA */
        .bottom-cta {
          text-align: center;
          margin-top: 48px;
          color: #555;
          font-size: 0.9rem;
        }
        .bottom-cta button {
          background: none;
          border: none;
          color: #34d399;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.9rem;
          padding: 0;
          text-decoration: underline;
          text-underline-offset: 3px;
          font-family: 'DM Sans', sans-serif;
        }
        .bottom-cta button:hover {
          color: #6ee7b7;
        }
      `}</style>

      <div className="home-root">
        <div className="home-inner">
          {/* HERO */}
          <div style={{ textAlign: "center" }}>
            <div className="mqa-badge">
              <span className="mqa-badge-dot" />
              Math Quiz Arena • MERN
            </div>

            <h1 className="hero-heading">
              Practice smarter.
              <br />
              <span className="accent">Ace every exam.</span>
            </h1>

            <p className="hero-sub">
              Sharpen your quantitative aptitude with timed quizzes, instant
              feedback, and a live leaderboard — designed for students, job
              seekers and competitive exam aspirants.
            </p>

            <div className="feature-pills">
              <span className="pill">✨ Topic-wise quizzes</span>
              <span className="pill">⚡ Instant scoring</span>
              <span className="pill">🏆 Live leaderboard</span>
              <span className="pill">📊 Difficulty levels</span>
            </div>

            <div className="cta-group">
              <button className="btn-primary-dark" onClick={handleStartQuiz}>
                📌 Start your first quiz →
              </button>
              <button className="btn-secondary-dark" onClick={handleStartQuiz}>
                Browse Categories
              </button>
            </div>

            {!user && (
              <p className="login-hint">
                🔒 You'll need to log in before starting a quiz.
              </p>
            )}
          </div>

          <hr className="section-divider" />

          {/* STATS */}
          <div className="stats-row">
            <div className="stat-cell">
              <div className="stat-value">10+</div>
              <div className="stat-label">Topics covered</div>
            </div>
            <div className="stat-cell">
              <div className="stat-value">3</div>
              <div className="stat-label">Difficulty levels</div>
            </div>
            <div className="stat-cell">
              <div className="stat-value">Live</div>
              <div className="stat-label">Leaderboard</div>
            </div>
          </div>

          {/* FEATURE CARDS */}
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">⏱️</span>
              <div className="feature-title">Timed Practice</div>
              <p className="feature-desc">
                Improve speed with real exam-style timed quizzes that keep you
                sharp under pressure.
              </p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">💡</span>
              <div className="feature-title">Smart Question Pool</div>
              <p className="feature-desc">
                Numbers, Ratio, Profit-Loss, Percentage & more — curated for
                competitive exams.
              </p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">🏆</span>
              <div className="feature-title">Leaderboard & Streaks</div>
              <p className="feature-desc">
                Challenge others — climb the ranks daily and build unstoppable
                streaks.
              </p>
            </div>
          </div>

          <div className="bottom-cta">
            Ready to level up?{" "}
            <button onClick={handleStartQuiz}>Start now</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
