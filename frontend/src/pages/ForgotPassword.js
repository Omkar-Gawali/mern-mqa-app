import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";

const API_URL = process.env.REACT_APP_API_URL;

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');

  .fp-root * { box-sizing: border-box; }

  .fp-root {
    font-family: 'Syne', sans-serif;
    background: #0a0a0f;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 16px;
    color: #e8e8f0;
  }

  /* ── Card ── */
  .fp-card {
    width: 100%;
    max-width: 420px;
    background: #111118;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 40px 36px 36px;
    position: relative;
    overflow: hidden;
  }

  /* subtle top glow */
  .fp-card::before {
    content: '';
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: 200px; height: 1px;
    background: linear-gradient(90deg, transparent, #39ff7e, transparent);
  }

  /* ── Icon badge ── */
  .fp-icon-wrap {
    width: 52px; height: 52px;
    border-radius: 14px;
    background: rgba(57,255,126,0.1);
    border: 1px solid rgba(57,255,126,0.25);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
  }
  .fp-icon-wrap svg {
    color: #39ff7e;
  }

  /* ── Heading ── */
  .fp-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #39ff7e;
    text-align: center;
    margin-bottom: 6px;
    opacity: 0.85;
  }
  .fp-title {
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.02em;
    text-align: center;
    margin: 0 0 6px;
    color: #e8e8f0;
  }
  .fp-title span { color: #39ff7e; }
  .fp-sub {
    font-size: 12px;
    text-align: center;
    color: rgba(232,232,240,0.38);
    margin-bottom: 32px;
    line-height: 1.6;
  }

  /* ── Steps indicator ── */
  .fp-steps {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    margin-bottom: 28px;
  }
  .fp-step-dot {
    width: 28px; height: 28px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    border: 1.5px solid rgba(255,255,255,0.1);
    background: #0a0a0f;
    color: rgba(232,232,240,0.3);
    transition: all 0.25s;
    flex-shrink: 0;
  }
  .fp-step-dot.active {
    border-color: #39ff7e;
    background: rgba(57,255,126,0.12);
    color: #39ff7e;
    box-shadow: 0 0 10px rgba(57,255,126,0.25);
  }
  .fp-step-dot.done {
    border-color: rgba(57,255,126,0.4);
    background: rgba(57,255,126,0.08);
    color: #39ff7e;
  }
  .fp-step-line {
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.07);
    max-width: 40px;
    transition: background 0.25s;
  }
  .fp-step-line.done { background: rgba(57,255,126,0.3); }

  /* ── Field group ── */
  .fp-field {
    margin-bottom: 16px;
  }
  .fp-label {
    display: block;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(232,232,240,0.4);
    margin-bottom: 8px;
  }
  .fp-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }
  .fp-input-icon {
    position: absolute;
    left: 14px;
    color: rgba(232,232,240,0.25);
    display: flex;
    pointer-events: none;
  }
  .fp-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 11px;
    color: #e8e8f0;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    padding: 12px 14px 12px 40px;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    caret-color: #39ff7e;
  }
  .fp-input::placeholder { color: rgba(232,232,240,0.2); }
  .fp-input:focus {
    border-color: rgba(57,255,126,0.45);
    background: rgba(57,255,126,0.04);
    box-shadow: 0 0 0 3px rgba(57,255,126,0.08);
  }

  /* password toggle */
  .fp-eye-btn {
    position: absolute;
    right: 13px;
    background: none;
    border: none;
    cursor: pointer;
    color: rgba(232,232,240,0.25);
    display: flex;
    padding: 2px;
    transition: color 0.2s;
  }
  .fp-eye-btn:hover { color: #39ff7e; }

  /* ── Submit button ── */
  .fp-submit {
    width: 100%;
    margin-top: 8px;
    padding: 13px;
    border-radius: 11px;
    border: none;
    background: #39ff7e;
    color: #0a0a0f;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 0.04em;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: opacity 0.2s, box-shadow 0.2s, transform 0.15s;
  }
  .fp-submit:hover:not(:disabled) {
    box-shadow: 0 0 24px rgba(57,255,126,0.35);
    transform: translateY(-1px);
  }
  .fp-submit:active { transform: translateY(0); }
  .fp-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  /* spinner inside button */
  .fp-btn-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(10,10,15,0.3);
    border-top-color: #0a0a0f;
    border-radius: 50%;
    animation: fp-spin 0.7s linear infinite;
  }
  @keyframes fp-spin { to { transform: rotate(360deg); } }

  /* ── Back to login ── */
  .fp-back {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 22px;
    font-size: 13px;
    color: rgba(232,232,240,0.35);
  }
  .fp-back a {
    color: #39ff7e;
    text-decoration: none;
    font-weight: 700;
    transition: opacity 0.2s;
  }
  .fp-back a:hover { opacity: 0.75; }
`;

/* ─── Tiny SVG icons ──────────────────────────────────────────────────────── */
const IconKey = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="7.5" cy="15.5" r="4.5" />
    <path d="M21 2l-9.6 9.6" />
    <path d="M15.5 7.5l3 3" />
  </svg>
);
const IconMail = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 7l10 7 10-7" />
  </svg>
);
const IconShield = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconLock = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IconEye = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconEyeOff = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
const IconArrow = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

/* ─── Component ──────────────────────────────────────────────────────────── */
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { auth, setAuth } = useAuth();

  /* which fields are filled — drives step indicator */
  const step = email ? (answer ? (newPassword ? 3 : 2) : 1) : 0;

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(`${API_URL}/api/auth/forgot-password`, {
        email,
        answer,
        newPassword,
      });
      toast.success(data?.message);
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <style>{styles}</style>
      <div className="fp-root">
        <div className="fp-card">
          {/* Lock icon */}
          <div className="fp-icon-wrap">
            <IconKey />
          </div>

          {/* Heading */}
          <div className="fp-eyebrow">Account Recovery</div>
          <h2 className="fp-title">
            Reset <span>Password</span>
          </h2>
          <p className="fp-sub">
            Verify your identity and set a new password below.
          </p>

          {/* Step indicator */}
          <div className="fp-steps">
            <div
              className={`fp-step-dot ${step > 0 ? "done" : ""} ${step === 0 ? "active" : ""}`}
            >
              1
            </div>
            <div className={`fp-step-line ${step >= 1 ? "done" : ""}`} />
            <div
              className={`fp-step-dot ${step > 1 ? "done" : ""} ${step === 1 ? "active" : ""}`}
            >
              2
            </div>
            <div className={`fp-step-line ${step >= 2 ? "done" : ""}`} />
            <div
              className={`fp-step-dot ${step === 2 ? "active" : ""} ${step === 3 ? "done" : ""}`}
            >
              3
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleForgotPassword}>
            {/* Email */}
            <div className="fp-field">
              <label className="fp-label">Email address</label>
              <div className="fp-input-wrap">
                <span className="fp-input-icon">
                  <IconMail />
                </span>
                <input
                  type="email"
                  className="fp-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Secret answer */}
            <div className="fp-field">
              <label className="fp-label">Secret Answer</label>
              <div className="fp-input-wrap">
                <span className="fp-input-icon">
                  <IconShield />
                </span>
                <input
                  type="text"
                  className="fp-input"
                  placeholder="Your security answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* New password */}
            <div className="fp-field">
              <label className="fp-label">New Password</label>
              <div className="fp-input-wrap">
                <span className="fp-input-icon">
                  <IconLock />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="fp-input"
                  placeholder="Min. 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  style={{ paddingRight: 42 }}
                />
                <button
                  type="button"
                  className="fp-eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="fp-submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="fp-btn-spinner" /> Resetting…
                </>
              ) : (
                <>
                  Reset Password <IconArrow />
                </>
              )}
            </button>
          </form>

          {/* Back link */}
          <div className="fp-back">
            Remembered it?&nbsp;<a href="/login">Back to Login</a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
