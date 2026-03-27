import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const DisplayQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/result/random-questions/${id}`,
      );
      if (!res.data || !res.data.questions) throw new Error("Invalid data");
      setQuestions(res.data.questions);
    } catch (err) {
      setError("Failed to load questions");
      console.error("❌ Error fetching questions:", err);
    }
  };

  const getSingleQuiz = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/quiz/get-single-quiz/${id}`);
      setQuiz(res.data?.quiz || null);
    } catch (err) {
      setError("Failed to load quiz");
      console.error("❌ Error loading quiz:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchQuestions(), getSingleQuiz()]);
      setLoading(false);
    };
    loadData();
  }, [id]);

  // ── Loading ──
  if (loading) {
    return (
      <Layout>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap');
          .dq-loading {
            min-height: 100vh;
            background: #06090f;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 20px;
          }
          .dq-orbit {
            position: relative;
            width: 48px; height: 48px;
          }
          .dq-orbit::before, .dq-orbit::after {
            content: '';
            position: absolute;
            border-radius: 50%;
            border: 2px solid transparent;
          }
          .dq-orbit::before {
            inset: 0;
            border-top-color: #7c6fff;
            border-right-color: #7c6fff;
            animation: dq-spin 1s linear infinite;
          }
          .dq-orbit::after {
            inset: 8px;
            border-bottom-color: rgba(124,111,255,0.35);
            border-left-color: rgba(124,111,255,0.35);
            animation: dq-spin 1.6s linear infinite reverse;
          }
          @keyframes dq-spin { to { transform: rotate(360deg); } }
          .dq-loading-text {
            font-family: 'Outfit', sans-serif;
            color: rgba(255,255,255,0.3);
            font-size: 0.82rem;
            letter-spacing: 0.06em;
            text-transform: uppercase;
          }
        `}</style>
        <div className="dq-loading">
          <div className="dq-orbit" />
          <p className="dq-loading-text">Preparing your quiz</p>
        </div>
      </Layout>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <Layout>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600&display=swap');
          .dq-error {
            min-height: 100vh;
            background: #06090f;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 14px;
            font-family: 'Outfit', sans-serif;
          }
          .dq-error-icon {
            width: 52px; height: 52px;
            background: rgba(239,68,68,0.08);
            border: 1px solid rgba(239,68,68,0.2);
            border-radius: 14px;
            display: flex; align-items: center; justify-content: center;
            font-size: 1.4rem;
          }
          .dq-error-msg { color: #f87171; font-size: 0.9rem; font-weight: 500; }
          .dq-error-sub { color: rgba(255,255,255,0.25); font-size: 0.8rem; }
        `}</style>
        <div className="dq-error">
          <div className="dq-error-icon">⚠️</div>
          <p className="dq-error-msg">{error}</p>
          <p className="dq-error-sub">Please try again or contact support.</p>
        </div>
      </Layout>
    );
  }

  // ── Main ──
  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap');

        /* ── Reset & base ── */
        .dq-root {
          min-height: 100vh;
          background: #06090f;
          font-family: 'Outfit', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* ── Background ambient orbs ── */
        .dq-orb {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
          filter: blur(80px);
        }
        .dq-orb-1 {
          width: 480px; height: 480px;
          top: -120px; left: -120px;
          background: radial-gradient(circle, rgba(124,111,255,0.08) 0%, transparent 70%);
        }
        .dq-orb-2 {
          width: 360px; height: 360px;
          bottom: 0; right: -80px;
          background: radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%);
        }

        /* ── Grid lines ── */
        .dq-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none; z-index: 0;
        }

        .dq-inner {
          position: relative; z-index: 1;
          max-width: 780px;
          margin: 0 auto;
          padding: 52px 24px 80px;
          animation: dq-fadein 0.5s ease both;
        }
        @keyframes dq-fadein {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Back button ── */
        .dq-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.4);
          font-size: 0.8rem;
          font-family: 'Outfit', sans-serif;
          font-weight: 500;
          letter-spacing: 0.03em;
          cursor: pointer;
          padding: 7px 14px;
          border-radius: 8px;
          margin-bottom: 48px;
          transition: all 0.2s;
        }
        .dq-back:hover {
          color: #fff;
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.12);
          transform: translateX(-2px);
        }
        .dq-back-arrow { font-size: 0.9rem; }

        /* ── Header ── */
        .dq-header { margin-bottom: 40px; }

        .dq-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #7c6fff;
          margin-bottom: 14px;
        }
        .dq-eyebrow-line {
          width: 24px; height: 1px;
          background: #7c6fff;
          opacity: 0.6;
        }

        .dq-heading {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 400;
          color: #f4f4f5;
          line-height: 1.15;
          letter-spacing: -0.01em;
          margin-bottom: 10px;
        }
        .dq-heading em {
          font-style: italic;
          color: #a5b4fc;
        }

        .dq-sub {
          font-size: 0.88rem;
          color: rgba(255,255,255,0.3);
          font-weight: 400;
          line-height: 1.5;
        }

        /* ── Stats row ── */
        .dq-stats {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin: 28px 0 36px;
        }
        .dq-stat {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 8px 16px;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.45);
          font-weight: 500;
          transition: border-color 0.2s, background 0.2s;
        }
        .dq-stat:hover {
          background: rgba(124,111,255,0.06);
          border-color: rgba(124,111,255,0.2);
          color: rgba(255,255,255,0.65);
        }
        .dq-stat-value {
          color: #a5b4fc;
          font-weight: 700;
        }
        .dq-stat-icon { font-size: 0.9rem; }

        /* ── Divider ── */
        .dq-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 0 0 30px;
          color: rgba(255,255,255,0.12);
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .dq-divider::before, .dq-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.06);
        }

        /* ── Question cards ── */
        .dq-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 48px;
        }

        .dq-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 18px 22px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          cursor: default;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
          animation: dq-cardIn 0.4s ease both;
        }
        .dq-card:hover {
          background: rgba(124,111,255,0.05);
          border-color: rgba(124,111,255,0.18);
          transform: translateX(4px);
        }
        @keyframes dq-cardIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .dq-qnum {
          min-width: 32px; height: 32px;
          background: rgba(124,111,255,0.1);
          border: 1px solid rgba(124,111,255,0.18);
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Outfit', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          color: #a5b4fc;
          flex-shrink: 0;
          letter-spacing: 0.03em;
        }

        .dq-qtext {
          font-size: 0.88rem;
          color: rgba(255,255,255,0.62);
          line-height: 1.65;
          margin: 0;
          padding-top: 5px;
          font-weight: 400;
        }

        /* ── CTA ── */
        .dq-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 28px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          gap: 24px;
          flex-wrap: wrap;
        }
        .dq-cta-info { display: flex; flex-direction: column; gap: 3px; }
        .dq-cta-label {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.25);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .dq-cta-ready {
          font-size: 1rem;
          color: rgba(255,255,255,0.75);
          font-weight: 600;
        }

        .btn-start {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #7c6fff;
          color: #fff;
          border: none;
          border-radius: 11px;
          padding: 13px 28px;
          font-size: 0.88rem;
          font-weight: 600;
          font-family: 'Outfit', sans-serif;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 0 32px rgba(124,111,255,0.28), 0 2px 8px rgba(0,0,0,0.4);
          white-space: nowrap;
        }
        .btn-start:hover {
          background: #9585ff;
          transform: translateY(-1px);
          box-shadow: 0 0 48px rgba(124,111,255,0.45), 0 4px 16px rgba(0,0,0,0.5);
        }
        .btn-start:active {
          transform: translateY(0);
        }
        .btn-start-arrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px; height: 20px;
          background: rgba(255,255,255,0.15);
          border-radius: 5px;
          font-size: 0.75rem;
        }

        @media (max-width: 560px) {
          .dq-inner { padding: 36px 16px 60px; }
          .dq-cta { flex-direction: column; align-items: flex-start; }
          .btn-start { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="dq-root">
        <div className="dq-orb dq-orb-1" />
        <div className="dq-orb dq-orb-2" />

        <div className="dq-inner">
          {/* Back */}
          <button className="dq-back" onClick={() => navigate(-1)}>
            <span className="dq-back-arrow">←</span>
            Back to quizzes
          </button>

          {/* Header */}
          <div className="dq-header">
            <div className="dq-eyebrow">
              <span className="dq-eyebrow-line" />
              Quiz Preview
            </div>
            <h2 className="dq-heading">
              <em>{quiz?.title}</em>
            </h2>
            <p className="dq-sub">Review all questions before you begin.</p>
          </div>

          {/* Stats */}
          <div className="dq-stats">
            <div className="dq-stat">
              <span className="dq-stat-icon">📋</span>
              <span className="dq-stat-value">{questions.length}</span>{" "}
              Questions
            </div>
            <div className="dq-stat">
              <span className="dq-stat-icon">⏱️</span>
              Timed Quiz
            </div>
            <div className="dq-stat">
              <span className="dq-stat-icon">⚡</span>
              Instant Scoring
            </div>
          </div>

          {/* Section divider */}
          <div className="dq-divider">Questions</div>

          {/* Questions list */}
          <div className="dq-list">
            {questions.map((q, i) => (
              <div
                className="dq-card"
                key={q._id || i}
                style={{ animationDelay: `${i * 35}ms` }}
              >
                <div className="dq-qnum">Q{i + 1}</div>
                <p className="dq-qtext">
                  {q.question || q.title || "Question text unavailable"}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="dq-cta">
            <div className="dq-cta-info">
              <span className="dq-cta-label">All set?</span>
              <span className="dq-cta-ready">Start when you're ready</span>
            </div>
            <button
              className="btn-start"
              onClick={() => navigate(`/quiz/${id}/attempt`)}
            >
              Begin Quiz
              <span className="btn-start-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DisplayQuestions;
