import React, { useEffect, useState, useRef, useCallback } from "react";
import Layout from "../components/layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/authContext";

const API_URL = process.env.REACT_APP_API_URL;
const QUESTION_TIME = 30;

const QuizAttempt = () => {
  const { auth } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [submitting, setSubmitting] = useState(false);

  const timerRef = useRef(null);
  // Refs so the timer callback always reads the latest values without stale closures
  const questionsRef = useRef([]);
  const indexRef = useRef(0);
  const answersRef = useRef([]);
  const selectedRef = useRef(null);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);
  useEffect(() => {
    indexRef.current = currentIndex;
  }, [currentIndex]);
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  // ── Fetch ────────────────────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      try {
        const [qRes, quizRes] = await Promise.all([
          axios.get(`${API_URL}/api/result/random-questions/${id}`),
          axios.get(`${API_URL}/api/quiz/get-single-quiz/${id}`),
        ]);
        if (!qRes.data?.questions) throw new Error("Invalid data");
        setQuestions(qRes.data.questions);
        setQuiz(quizRes.data?.quiz || null);
      } catch (err) {
        setError("Failed to load quiz");
        console.error("❌ Error loading quiz:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  // ── Core navigation logic (reads from refs, safe for timer) ──
  const advance = useCallback((timedOut = false) => {
    clearInterval(timerRef.current);

    const qs = questionsRef.current;
    const idx = indexRef.current;
    const currentQ = qs[idx];

    if (!currentQ) return; // guard against empty/loading state

    const chosenAnswer = timedOut ? null : selectedRef.current;

    const newAnswers = [
      ...answersRef.current,
      {
        // fallback chain for any _id / id field your API returns
        questionId: currentQ._id ?? currentQ.id ?? `q_${idx}`,
        selected: chosenAnswer,
      },
    ];

    answersRef.current = newAnswers;
    setAnswers(newAnswers);
    setSelected(null);

    if (idx + 1 < qs.length) {
      setCurrentIndex(idx + 1);
      setTimeLeft(QUESTION_TIME);
    } else {
      doSubmit(newAnswers);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep a stable ref so the interval callback always calls the latest version
  const advanceRef = useRef(advance);
  useEffect(() => {
    advanceRef.current = advance;
  }, [advance]);

  // ── Timer ────────────────────────────────────────────────────
  useEffect(() => {
    if (loading || questions.length === 0) return;
    clearInterval(timerRef.current);
    setTimeLeft(QUESTION_TIME);

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          advanceRef.current(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentIndex, loading, questions.length]);

  // ── Submit ───────────────────────────────────────────────────
  const doSubmit = async (finalAnswers) => {
    setSubmitting(true);
    try {
      const score = finalAnswers.filter((a, i) => {
        const q = questionsRef.current[i];
        return (
          q && a.selected !== null && q.options[a.selected] === q.correctAnswer
        );
      }).length;

      const answers = finalAnswers.map((a, i) => {
        const q = questionsRef.current[i];
        const selectedAnswer =
          a.selected !== null ? (q?.options[a.selected] ?? "") : "";
        return {
          questionId: a.questionId,
          selectedAnswer,
          isCorrect: selectedAnswer === q?.correctAnswer,
        };
      });

      await axios.post(`${API_URL}/api/result/submit-quiz`, {
        userId: auth.user._id,
        score,
        answers,
      });

      navigate("/dashboard/user/results");
    } catch (err) {
      console.error("❌ Submit error:", err);
      setError("Failed to submit. Please try again.");
      setSubmitting(false);
    }
  };

  // ── Derived ──────────────────────────────────────────────────
  const currentQ = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const progress =
    questions.length > 0 ? (currentIndex / questions.length) * 100 : 0;
  const timerState = timeLeft <= 5 ? "danger" : timeLeft <= 10 ? "warn" : "";
  const OPTIONS = ["A", "B", "C", "D", "E"];

  // Question text — tries every common field name the API might return
  const questionText =
    currentQ?.question ||
    currentQ?.title ||
    currentQ?.questionText ||
    currentQ?.text ||
    "Question unavailable";

  // Options — handle both string arrays and object arrays
  const optionsList = currentQ?.options ?? [];
  const getOptionLabel = (opt) => {
    if (typeof opt === "string") return opt;
    return opt?.text ?? opt?.value ?? opt?.option ?? JSON.stringify(opt);
  };

  // ── Loading ──────────────────────────────────────────────────
  if (loading) {
    return (
      <Layout>
        <style>{CSS}</style>
        <div className="qa-loading">
          <div className="qa-orbit" />
          <p className="qa-loading-text">Loading quiz…</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <style>{CSS}</style>
        <div className="qa-error">
          <div className="qa-error-icon">⚠️</div>
          <p className="qa-error-msg">{error}</p>
        </div>
      </Layout>
    );
  }

  if (submitting) {
    return (
      <Layout>
        <style>{CSS}</style>
        <div className="qa-loading">
          <div className="qa-orbit" />
          <p className="qa-loading-text">Submitting your answers…</p>
        </div>
      </Layout>
    );
  }

  // ── Main ─────────────────────────────────────────────────────
  return (
    <Layout>
      <style>{CSS}</style>

      <div className="qa-root">
        <div className="qa-orb qa-orb-1" />
        <div className="qa-orb qa-orb-2" />

        <div className="qa-inner" key={currentIndex}>
          {/* Top bar */}
          <div className="qa-topbar">
            <div className="qa-progress-wrap">
              <div className="qa-progress-label">
                <span className="qa-step-text">Progress</span>
                <span className="qa-step-frac">
                  {currentIndex + 1} / {questions.length}
                </span>
              </div>
              <div className="qa-track">
                <div
                  className="qa-fill"
                  style={{ width: `${Math.max(progress, 2)}%` }}
                />
              </div>
            </div>
            <div className={`qa-timer ${timerState}`}>
              <span className="timer-dot" />
              <span>{timeLeft}s</span>
            </div>
          </div>

          {/* Card */}
          <div className="qa-card">
            {/* Subject strip */}
            <div className="qa-subject">
              <span className="qa-subject-dot" />
              <span className="qa-subject-name">{quiz?.title || "Quiz"}</span>
            </div>

            {/* Question */}
            <div className="qa-qarea">
              <p className="qa-qtext">{questionText}</p>
            </div>

            {/* Options */}
            <div className="qa-options">
              {optionsList.map((opt, i) => (
                <div
                  key={i}
                  className={`qa-opt ${selected === i ? "selected" : ""}`}
                  onClick={() => setSelected(i)}
                >
                  <div className="qa-opt-key">{OPTIONS[i] ?? i + 1}</div>
                  <span className="qa-opt-text">{getOptionLabel(opt)}</span>
                </div>
              ))}
              {optionsList.length === 0 && (
                <p
                  style={{
                    color: "rgba(255,255,255,0.3)",
                    fontSize: "0.85rem",
                    padding: "8px 0",
                  }}
                >
                  No options found for this question.
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="qa-footer">
              <button className="qa-skip" onClick={() => advance(true)}>
                Skip question
              </button>
              <button
                className={`btn-next ${selected !== null ? "active" : ""}`}
                onClick={() => {
                  if (selected !== null) advance(false);
                }}
              >
                {isLast ? "Submit Quiz" : "Next Question"}
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// ── Styles ────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap');

  .qa-root {
    min-height: 100vh;
    background: #07090f;
    font-family: 'Outfit', sans-serif;
    position: relative;
    overflow: hidden;
  }
  .qa-root::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none; z-index: 0;
  }
  .qa-orb {
    position: fixed; border-radius: 50%;
    pointer-events: none; z-index: 0; filter: blur(80px);
  }
  .qa-orb-1 {
    width: 500px; height: 500px; top: -140px; left: -140px;
    background: radial-gradient(circle, rgba(124,111,255,0.07) 0%, transparent 70%);
  }
  .qa-orb-2 {
    width: 380px; height: 380px; bottom: -60px; right: -80px;
    background: radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 70%);
  }
  .qa-inner {
    position: relative; z-index: 1;
    max-width: 680px; margin: 0 auto;
    padding: 52px 24px 72px;
    animation: qa-fadein 0.4s ease both;
  }
  @keyframes qa-fadein {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .qa-topbar { display: flex; align-items: center; gap: 16px; margin-bottom: 22px; }
  .qa-progress-wrap { flex: 1; display: flex; flex-direction: column; gap: 7px; }
  .qa-progress-label { display: flex; justify-content: space-between; align-items: center; }
  .qa-step-text { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.3); }
  .qa-step-frac { font-size: 11px; font-weight: 700; color: #7c6fff; letter-spacing: 0.04em; }
  .qa-track { height: 3px; background: rgba(255,255,255,0.05); border-radius: 99px; overflow: hidden; }
  .qa-fill { height: 100%; background: linear-gradient(90deg, #7c6fff, #a5b4fc); border-radius: 99px; transition: width 0.5s cubic-bezier(0.4,0,0.2,1); }

  .qa-timer {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 8px 14px; border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.07);
    background: #0f1117; font-size: 0.82rem; font-weight: 700;
    color: #e8e8ef; letter-spacing: 0.04em; white-space: nowrap;
    transition: border-color 0.3s, color 0.3s;
    font-family: 'Outfit', sans-serif; min-width: 62px;
  }
  .qa-timer.warn   { border-color: rgba(251,191,36,0.4);  color: #fbbf24; }
  .qa-timer.danger { border-color: rgba(239,68,68,0.4);   color: #f87171; }
  .timer-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #7c6fff; animation: qa-pulse 1.4s infinite; flex-shrink: 0;
  }
  .qa-timer.warn   .timer-dot { background: #fbbf24; }
  .qa-timer.danger .timer-dot { background: #f87171; }
  @keyframes qa-pulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50%      { opacity: 0.3; transform: scale(0.6); }
  }

  .qa-card { background: #0f1117; border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; overflow: hidden; }

  .qa-subject { padding: 14px 28px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; gap: 10px; }
  .qa-subject-dot { width: 7px; height: 7px; border-radius: 50%; background: #7c6fff; flex-shrink: 0; }
  .qa-subject-name { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(165,180,252,0.65); }

  .qa-qarea { padding: 32px 28px 28px; border-bottom: 1px solid rgba(255,255,255,0.06); min-height: 100px; }
  .qa-qtext { font-family: 'Instrument Serif', serif; font-size: clamp(1.1rem, 2.8vw, 1.4rem); font-weight: 400; line-height: 1.55; color: #f0f0f5; letter-spacing: -0.005em; margin: 0; }

  .qa-options { padding: 22px 28px; display: flex; flex-direction: column; gap: 10px; }
  .qa-opt {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 18px; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 13px; background: rgba(255,255,255,0.025);
    cursor: pointer; transition: background 0.18s, border-color 0.18s, transform 0.15s;
    user-select: none;
  }
  .qa-opt:hover { background: rgba(124,111,255,0.07); border-color: rgba(124,111,255,0.22); transform: translateX(3px); }
  .qa-opt.selected { background: rgba(124,111,255,0.12); border-color: rgba(124,111,255,0.45); transform: translateX(3px); }
  .qa-opt-key {
    width: 30px; height: 30px; flex-shrink: 0; border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.04em;
    color: rgba(255,255,255,0.35);
    transition: background 0.18s, border-color 0.18s, color 0.18s;
    font-family: 'Outfit', sans-serif;
  }
  .qa-opt.selected .qa-opt-key { background: #7c6fff; border-color: #7c6fff; color: #fff; }
  .qa-opt-text { font-size: 0.9rem; color: rgba(255,255,255,0.55); line-height: 1.4; font-weight: 400; transition: color 0.18s; }
  .qa-opt:hover .qa-opt-text, .qa-opt.selected .qa-opt-text { color: rgba(255,255,255,0.88); }

  .qa-footer {
    padding: 18px 28px; border-top: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;
  }
  .qa-skip { font-size: 0.8rem; font-weight: 500; color: rgba(255,255,255,0.3); background: none; border: none; cursor: pointer; font-family: 'Outfit', sans-serif; padding: 0; transition: color 0.2s; }
  .qa-skip:hover { color: rgba(255,255,255,0.6); }
  .btn-next {
    display: inline-flex; align-items: center; gap: 10px;
    background: #7c6fff; color: #fff; border: none; border-radius: 11px;
    padding: 12px 24px; font-size: 0.87rem; font-weight: 600;
    font-family: 'Outfit', sans-serif; cursor: pointer; letter-spacing: 0.01em;
    transition: background 0.2s, transform 0.15s, opacity 0.2s, box-shadow 0.2s;
    opacity: 0.4; pointer-events: none;
  }
  .btn-next.active { opacity: 1; pointer-events: all; box-shadow: 0 0 28px rgba(124,111,255,0.28); }
  .btn-next.active:hover { background: #9585ff; transform: translateY(-1px); box-shadow: 0 0 40px rgba(124,111,255,0.4); }
  .btn-arrow { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; background: rgba(255,255,255,0.14); border-radius: 5px; font-size: 0.75rem; }

  .qa-loading { min-height: 100vh; background: #07090f; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; }
  .qa-orbit { position: relative; width: 48px; height: 48px; }
  .qa-orbit::before, .qa-orbit::after { content: ''; position: absolute; border-radius: 50%; border: 2px solid transparent; }
  .qa-orbit::before { inset: 0; border-top-color: #7c6fff; border-right-color: #7c6fff; animation: qa-spin 1s linear infinite; }
  .qa-orbit::after { inset: 8px; border-bottom-color: rgba(124,111,255,0.3); border-left-color: rgba(124,111,255,0.3); animation: qa-spin 1.6s linear infinite reverse; }
  @keyframes qa-spin { to { transform: rotate(360deg); } }
  .qa-loading-text { font-family: 'Outfit', sans-serif; color: rgba(255,255,255,0.25); font-size: 0.82rem; letter-spacing: 0.06em; text-transform: uppercase; }

  .qa-error { min-height: 100vh; background: #07090f; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; font-family: 'Outfit', sans-serif; }
  .qa-error-icon { font-size: 2rem; width: 52px; height: 52px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); border-radius: 14px; display: flex; align-items: center; justify-content: center; }
  .qa-error-msg { color: #f87171; font-size: 0.9rem; font-weight: 500; }

  @media (max-width: 520px) {
    .qa-inner { padding: 32px 14px 56px; }
    .qa-qarea, .qa-options, .qa-footer, .qa-subject { padding-left: 18px; padding-right: 18px; }
    .qa-footer { flex-direction: column; align-items: stretch; }
    .btn-next { justify-content: center; }
  }
`;

export default QuizAttempt;
