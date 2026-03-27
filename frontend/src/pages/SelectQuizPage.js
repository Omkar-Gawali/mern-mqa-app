import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

const SelectQuizPage = () => {
  const [quizes, setQuizes] = useState([]);
  const navigate = useNavigate();

  const getAllQuizes = async () => {
    const { data } = await axios.get(`${API_URL}/api/quiz/get-all-quizes`);
    setQuizes(data?.quizes);
  };

  useEffect(() => {
    getAllQuizes();
  }, []);

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .sqp-root {
          min-height: 100vh;
          background: #0a0a0a;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }
        .sqp-root::before {
          content: '';
          position: fixed;
          top: -200px; left: -200px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .sqp-root::after {
          content: '';
          position: fixed;
          bottom: -200px; right: -100px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(52,211,153,0.04) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .sqp-inner {
          position: relative;
          z-index: 1;
          max-width: 980px;
          margin: 0 auto;
          padding: 72px 24px 60px;
        }

        /* Header */
        .sqp-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(52,211,153,0.1);
          border: 1px solid rgba(52,211,153,0.3);
          color: #34d399;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 100px;
          margin-bottom: 20px;
        }
        .sqp-badge-dot {
          width: 6px; height: 6px;
          background: #34d399;
          border-radius: 50%;
          animation: sqp-pulse 2s infinite;
        }
        @keyframes sqp-pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.4; transform:scale(0.7); }
        }

        .sqp-heading {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          color: #f0f0f0;
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin-bottom: 12px;
        }
        .sqp-heading .accent { color: #34d399; }

        .sqp-sub {
          font-size: 0.95rem;
          color: #666;
          margin-bottom: 48px;
        }

        /* Grid */
        .sqp-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 768px) {
          .sqp-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .sqp-grid { grid-template-columns: 1fr; }
        }

        /* Quiz card */
        .quiz-card {
          background: #111;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 28px 22px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 16px;
          transition: border-color 0.25s, transform 0.2s;
          position: relative;
          overflow: hidden;
        }
        .quiz-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(52,211,153,0.5), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .quiz-card:hover {
          border-color: rgba(52,211,153,0.25);
          transform: translateY(-3px);
        }
        .quiz-card:hover::before { opacity: 1; }

        .quiz-card-icon {
          width: 48px; height: 48px;
          background: rgba(52,211,153,0.08);
          border: 1px solid rgba(52,211,153,0.15);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
        }
        .quiz-card-title {
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #e8e8e8;
          margin: 0;
        }
        .quiz-card-meta {
          font-size: 0.78rem;
          color: #555;
          margin: 0;
        }
        .btn-quiz {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(52,211,153,0.35);
          color: #34d399;
          border-radius: 8px;
          padding: 10px 0;
          font-size: 0.85rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition: background 0.2s, color 0.2s, box-shadow 0.2s;
        }
        .btn-quiz:hover {
          background: rgba(52,211,153,0.1);
          box-shadow: 0 0 18px rgba(52,211,153,0.15);
        }

        /* Combined card */
        .combined-card {
          background: linear-gradient(145deg, #0d1f16, #0a1a12);
          border: 1px solid rgba(52,211,153,0.25);
          border-radius: 16px;
          padding: 28px 22px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 16px;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .combined-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #34d399, transparent);
        }
        .combined-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 0 40px rgba(52,211,153,0.12);
        }
        .combined-card-icon {
          width: 48px; height: 48px;
          background: rgba(52,211,153,0.15);
          border: 1px solid rgba(52,211,153,0.3);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
        }
        .combined-card-title {
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #34d399;
          margin: 0;
        }
        .combined-card-meta {
          font-size: 0.78rem;
          color: #4a9e77;
          margin: 0;
        }
        .btn-combined {
          width: 100%;
          background: #34d399;
          border: none;
          color: #0a0a0a;
          border-radius: 8px;
          padding: 10px 0;
          font-size: 0.85rem;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition: background 0.2s, box-shadow 0.2s;
          box-shadow: 0 0 20px rgba(52,211,153,0.25);
        }
        .btn-combined:hover {
          background: #6ee7b7;
          box-shadow: 0 0 32px rgba(52,211,153,0.4);
        }

        /* Empty state */
        .sqp-empty {
          text-align: center;
          color: #444;
          padding: 60px 0;
          font-size: 0.9rem;
        }
      `}</style>

      <div className="sqp-root">
        <div className="sqp-inner">
          {/* Header */}
          <div style={{ textAlign: "center" }}>
            <div className="sqp-badge">
              <span className="sqp-badge-dot" />
              Select Quiz
            </div>
            <h2 className="sqp-heading">
              Choose your <span className="accent">challenge.</span>
            </h2>
            <p className="sqp-sub">
              Test your skills with topic-wise quizzes or attempt a combined
              test.
            </p>
          </div>

          {/* Grid */}
          <div className="sqp-grid">
            {quizes?.length === 0 && (
              <div className="sqp-empty" style={{ gridColumn: "1 / -1" }}>
                Loading quizzes…
              </div>
            )}

            {quizes?.map((q, i) => {
              const icons = ["📐", "➗", "📊", "💹", "🔢", "📈", "🧮", "⚖️"];
              return (
                <div className="quiz-card" key={q._id}>
                  <div className="quiz-card-icon">
                    {icons[i % icons.length]}
                  </div>
                  <div>
                    <p className="quiz-card-title">{q.title}</p>
                    <p className="quiz-card-meta">Topic-wise quiz</p>
                  </div>
                  <button
                    className="btn-quiz"
                    onClick={() => navigate(`/select-quiz/${q._id}`)}
                  >
                    Start Quiz →
                  </button>
                </div>
              );
            })}

            {/* Combined Test */}
            <div className="combined-card">
              <div className="combined-card-icon">🎯</div>
              <div>
                <p className="combined-card-title">Combined Test</p>
                <p className="combined-card-meta">
                  Mixed questions from all categories
                </p>
              </div>
              <button
                className="btn-combined"
                onClick={() => navigate(`/select-quiz/combined-test`)}
              >
                Start Combined Test →
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SelectQuizPage;
