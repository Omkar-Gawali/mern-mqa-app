import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');

  .login-root {
    min-height: 100vh;
    background: #0a0a0f;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    font-family: 'Syne', sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* Grid background */
  .login-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(99,255,180,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,255,180,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  /* Glow orb */
  .login-root::after {
    content: '';
    position: fixed;
    top: -120px;
    left: 50%;
    transform: translateX(-50%);
    width: 500px;
    height: 300px;
    background: radial-gradient(ellipse, rgba(99,255,180,0.07) 0%, transparent 70%);
    pointer-events: none;
  }

  /* Floating symbols */
  .login-symbols {
    position: fixed;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }
  .login-sym {
    position: absolute;
    font-family: 'Space Mono', monospace;
    color: rgba(99,255,180,0.06);
    font-size: 1.4rem;
    animation: floatUp 18s linear infinite;
    user-select: none;
  }
  @keyframes floatUp {
    from { transform: translateY(110vh) rotate(0deg); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    to   { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
  }

  /* Card */
  .login-card {
    position: relative;
    background: rgba(16, 16, 24, 0.95);
    border: 1px solid rgba(99, 255, 180, 0.15);
    border-radius: 20px;
    padding: 2.5rem 2rem;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 0 80px rgba(99,255,180,0.05), 0 24px 64px rgba(0,0,0,0.6);
    animation: cardIn 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(28px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* Corner accents */
  .login-card::before {
    content: '';
    position: absolute;
    top: -1px; left: -1px;
    width: 60px; height: 60px;
    border-top: 2px solid #63ffb4;
    border-left: 2px solid #63ffb4;
    border-radius: 20px 0 0 0;
  }
  .login-card::after {
    content: '';
    position: absolute;
    bottom: -1px; right: -1px;
    width: 60px; height: 60px;
    border-bottom: 2px solid #63ffb4;
    border-right: 2px solid #63ffb4;
    border-radius: 0 0 20px 0;
  }

  /* Badge */
  .login-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(99,255,180,0.08);
    border: 1px solid rgba(99,255,180,0.2);
    border-radius: 100px;
    padding: 4px 14px;
    font-size: 0.72rem;
    font-family: 'Space Mono', monospace;
    color: #63ffb4;
    letter-spacing: 0.08em;
    margin-bottom: 1.2rem;
    text-transform: uppercase;
  }
  .login-badge-dot {
    width: 6px; height: 6px;
    background: #63ffb4;
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.7); }
  }

  .login-title {
    font-size: 1.85rem;
    font-weight: 800;
    color: #f0f0f8;
    line-height: 1.15;
    margin: 0 0 0.3rem;
    letter-spacing: -0.02em;
  }
  .login-title span { color: #63ffb4; }

  .login-subtitle {
    font-size: 0.85rem;
    color: rgba(255,255,255,0.35);
    margin-bottom: 2rem;
    font-weight: 400;
  }

  /* Fields */
  .login-field {
    margin-bottom: 1.1rem;
    animation: fieldIn 0.4s cubic-bezier(0.22,1,0.36,1) both;
  }
  .login-field:nth-child(1) { animation-delay: 0.05s; }
  .login-field:nth-child(2) { animation-delay: 0.12s; }
  @keyframes fieldIn {
    from { opacity: 0; transform: translateX(-10px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .login-label {
    display: block;
    font-size: 0.75rem;
    font-weight: 700;
    color: rgba(255,255,255,0.45);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.4rem;
  }

  .login-input-wrap { position: relative; }
  .login-input-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(99,255,180,0.4);
    font-size: 0.9rem;
    pointer-events: none;
    font-family: 'Space Mono', monospace;
    font-weight: 700;
  }
  .login-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 11px 14px 11px 36px;
    font-size: 0.88rem;
    color: #f0f0f8;
    font-family: 'Syne', sans-serif;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }
  .login-input::placeholder {
    color: rgba(255,255,255,0.2);
    font-size: 0.83rem;
  }
  .login-input:focus {
    border-color: rgba(99,255,180,0.5);
    background: rgba(99,255,180,0.04);
    box-shadow: 0 0 0 3px rgba(99,255,180,0.08);
  }

  /* Forgot password link row */
  .login-forgot-row {
    display: flex;
    justify-content: flex-end;
    margin-top: -0.5rem;
    margin-bottom: 1.4rem;
  }
  .login-forgot-link {
    font-size: 0.78rem;
    color: rgba(99,255,180,0.6);
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s;
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'Syne', sans-serif;
    padding: 0;
  }
  .login-forgot-link:hover { color: #63ffb4; text-decoration: underline; }

  /* Primary button */
  .login-btn {
    width: 100%;
    background: #63ffb4;
    color: #0a0a0f;
    border: none;
    border-radius: 10px;
    padding: 13px;
    font-size: 0.92rem;
    font-weight: 800;
    font-family: 'Syne', sans-serif;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 0.75rem;
  }
  .login-btn:hover {
    background: #7fffca;
    box-shadow: 0 0 28px rgba(99,255,180,0.35);
    transform: translateY(-1px);
  }
  .login-btn:active { transform: translateY(0); }
  .login-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; box-shadow: none; }

  /* Spinner */
  .login-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(10,10,15,0.25);
    border-top-color: #0a0a0f;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Divider */
  .login-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 1rem 0;
  }
  .login-divider-line {
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.07);
  }
  .login-divider-text {
    font-size: 0.72rem;
    color: rgba(255,255,255,0.25);
    font-family: 'Space Mono', monospace;
  }

  /* Register link */
  .login-register-link {
    text-align: center;
    font-size: 0.85rem;
    color: rgba(255,255,255,0.35);
  }
  .login-register-link a {
    color: #63ffb4;
    text-decoration: none;
    font-weight: 700;
    transition: color 0.2s;
  }
  .login-register-link a:hover { color: #7fffca; text-decoration: underline; }
`;

const SYMBOLS = [
  { sym: "×", left: "7%", delay: "0s", dur: "15s" },
  { sym: "÷", left: "18%", delay: "4s", dur: "18s" },
  { sym: "∑", left: "33%", delay: "7s", dur: "13s" },
  { sym: "=", left: "55%", delay: "2s", dur: "20s" },
  { sym: "π", left: "70%", delay: "9s", dur: "16s" },
  { sym: "√", left: "85%", delay: "5s", dur: "14s" },
  { sym: "∞", left: "94%", delay: "11s", dur: "17s" },
];

const API_URL = process.env.REACT_APP_API_URL;

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      toast.success(data?.message || "Welcome back!");
      setAuth({ user: data.user, token: data.token });
      localStorage.setItem("auth", JSON.stringify(data));
      setEmail("");
      setPassword("");
      navigate("/");
    } catch {
      toast.error("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Layout>
        <style>{styles}</style>
        <div className="login-root">
          {/* Floating math symbols */}
          <div className="login-symbols">
            {SYMBOLS.map((s, i) => (
              <span
                key={i}
                className="login-sym"
                style={{
                  left: s.left,
                  animationDelay: s.delay,
                  animationDuration: s.dur,
                }}
              >
                {s.sym}
              </span>
            ))}
          </div>

          <div className="login-card">
            <div>
              <span className="login-badge">
                <span className="login-badge-dot" />
                Math Quiz Arena
              </span>
            </div>

            <h1 className="login-title">
              Welcome <span>back</span>
            </h1>
            <p className="login-subtitle">
              Sign in to continue your practice streak.
            </p>

            <form onSubmit={handleLogin}>
              <div className="login-field">
                <label className="login-label">Email</label>
                <div className="login-input-wrap">
                  <span className="login-input-icon">@</span>
                  <input
                    type="email"
                    className="login-input"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="login-field">
                <label className="login-label">Password</label>
                <div className="login-input-wrap">
                  <span className="login-input-icon">⊕</span>
                  <input
                    type="password"
                    className="login-input"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {/* Forgot password */}
              <div className="login-forgot-row">
                <button
                  type="button"
                  className="login-forgot-link"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="login-spinner" /> Signing in…
                  </>
                ) : (
                  <>Sign In →</>
                )}
              </button>
            </form>

            <div className="login-divider">
              <div className="login-divider-line" />
              <span className="login-divider-text">or</span>
              <div className="login-divider-line" />
            </div>

            <p className="login-register-link">
              Don't have an account? <Link to="/register">Create one</Link>
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Login;
