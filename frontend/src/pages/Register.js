import React, { useState } from "react";
import axios from "axios";
import validator from "validator";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/layout/Layout";

// Inline styles (no external CSS file needed)
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');

  .reg-root {
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

  /* Animated grid background */
  .reg-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(99,255,180,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,255,180,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  /* Floating math symbols */
  .math-symbols {
    position: fixed;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }
  .math-sym {
    position: absolute;
    font-family: 'Space Mono', monospace;
    color: rgba(99,255,180,0.07);
    font-size: 1.4rem;
    animation: floatSym 18s linear infinite;
    user-select: none;
  }
  @keyframes floatSym {
    from { transform: translateY(110vh) rotate(0deg); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    to { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
  }

  .reg-card {
    position: relative;
    background: rgba(16,16,24,0.95);
    border: 1px solid rgba(99,255,180,0.15);
    border-radius: 20px;
    padding: 2.5rem 2rem;
    width: 100%;
    max-width: 440px;
    box-shadow: 0 0 80px rgba(99,255,180,0.06), 0 24px 64px rgba(0,0,0,0.6);
    animation: cardIn 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(28px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* Corner accent */
  .reg-card::before {
    content: '';
    position: absolute;
    top: -1px; left: -1px;
    width: 60px; height: 60px;
    border-top: 2px solid #63ffb4;
    border-left: 2px solid #63ffb4;
    border-radius: 20px 0 0 0;
  }
  .reg-card::after {
    content: '';
    position: absolute;
    bottom: -1px; right: -1px;
    width: 60px; height: 60px;
    border-bottom: 2px solid #63ffb4;
    border-right: 2px solid #63ffb4;
    border-radius: 0 0 20px 0;
  }

  .reg-badge {
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
  .reg-badge-dot {
    width: 6px; height: 6px;
    background: #63ffb4;
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.7); }
  }

  .reg-title {
    font-size: 1.85rem;
    font-weight: 800;
    color: #f0f0f8;
    line-height: 1.15;
    margin: 0 0 0.3rem;
    letter-spacing: -0.02em;
  }
  .reg-title span {
    color: #63ffb4;
  }
  .reg-subtitle {
    font-size: 0.85rem;
    color: rgba(255,255,255,0.38);
    margin-bottom: 1.8rem;
    font-weight: 400;
  }

  .reg-error {
    background: rgba(255,80,80,0.08);
    border: 1px solid rgba(255,80,80,0.25);
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 0.82rem;
    color: #ff7070;
    margin-bottom: 1.2rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .reg-field {
    margin-bottom: 1rem;
    animation: fieldIn 0.4s cubic-bezier(0.22,1,0.36,1) both;
  }
  .reg-field:nth-child(1) { animation-delay: 0.05s; }
  .reg-field:nth-child(2) { animation-delay: 0.10s; }
  .reg-field:nth-child(3) { animation-delay: 0.15s; }
  .reg-field:nth-child(4) { animation-delay: 0.20s; }
  .reg-field:nth-child(5) { animation-delay: 0.25s; }
  @keyframes fieldIn {
    from { opacity: 0; transform: translateX(-10px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .reg-label {
    display: block;
    font-size: 0.75rem;
    font-weight: 700;
    color: rgba(255,255,255,0.5);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.4rem;
  }

  .reg-input-wrap {
    position: relative;
  }
  .reg-input-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(99,255,180,0.4);
    font-size: 0.95rem;
    pointer-events: none;
    font-family: 'Space Mono', monospace;
    font-weight: 700;
  }
  .reg-input {
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
  .reg-input::placeholder {
    color: rgba(255,255,255,0.2);
    font-size: 0.83rem;
  }
  .reg-input:focus {
    border-color: rgba(99,255,180,0.5);
    background: rgba(99,255,180,0.04);
    box-shadow: 0 0 0 3px rgba(99,255,180,0.08);
  }

  .reg-hint {
    font-size: 0.73rem;
    color: rgba(255,255,255,0.25);
    margin-top: 4px;
  }

  .reg-btn {
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
    margin-top: 0.5rem;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: relative;
    overflow: hidden;
  }
  .reg-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .reg-btn:hover {
    background: #7fffca;
    box-shadow: 0 0 28px rgba(99,255,180,0.35);
    transform: translateY(-1px);
  }
  .reg-btn:hover::after { opacity: 1; }
  .reg-btn:active { transform: translateY(0); }
  .reg-btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .reg-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(10,10,15,0.3);
    border-top-color: #0a0a0f;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .reg-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 1.4rem 0 1rem;
  }
  .reg-divider-line {
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.07);
  }
  .reg-divider-text {
    font-size: 0.72rem;
    color: rgba(255,255,255,0.25);
    font-family: 'Space Mono', monospace;
  }

  .reg-login-link {
    text-align: center;
    font-size: 0.85rem;
    color: rgba(255,255,255,0.35);
  }
  .reg-login-link a {
    color: #63ffb4;
    text-decoration: none;
    font-weight: 700;
    transition: color 0.2s;
  }
  .reg-login-link a:hover { color: #7fffca; text-decoration: underline; }

  .reg-steps {
    display: flex;
    gap: 4px;
    margin-bottom: 1.8rem;
  }
  .reg-step {
    flex: 1;
    height: 3px;
    background: rgba(255,255,255,0.1);
    border-radius: 100px;
    transition: background 0.3s;
  }
  .reg-step.active { background: #63ffb4; }
  .reg-step.done { background: rgba(99,255,180,0.4); }
`;

const SYMBOLS = [
  { sym: "∑", left: "8%", delay: "0s", dur: "14s" },
  { sym: "π", left: "20%", delay: "3s", dur: "17s" },
  { sym: "∫", left: "35%", delay: "6s", dur: "13s" },
  { sym: "√", left: "52%", delay: "1s", dur: "19s" },
  { sym: "∞", left: "68%", delay: "8s", dur: "15s" },
  { sym: "Δ", left: "82%", delay: "4s", dur: "16s" },
  { sym: "θ", left: "93%", delay: "10s", dur: "12s" },
  { sym: "÷", left: "14%", delay: "12s", dur: "20s" },
  { sym: "≠", left: "75%", delay: "2s", dur: "18s" },
];

const FIELD_ICONS = {
  name: "✦",
  email: "@",
  password: "⊕",
  phone: "#",
  answer: "?",
};

const API_URL = process.env.REACT_APP_API_URL;

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    answer: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const filledCount = Object.values(form).filter(Boolean).length;

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    const { name, email, password, phone, answer } = form;

    if (!name || !email || !password || !phone || !answer) {
      setError("All fields are required.");
      return;
    }
    if (!validator.isEmail(email)) {
      setError("Invalid email format.");
      return;
    }
    if (!validator.isLength(password, { min: 8 })) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/register`, form);
      if (data?.success) {
        toast.success("Account created! Welcome to the Arena.");
        setForm({ name: "", email: "", password: "", phone: "", answer: "" });
        navigate("/login");
      } else {
        setError(data?.message || "Registration failed.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Layout>
        <style>{styles}</style>
        <div className="reg-root">
          {/* Floating math symbols */}
          <div className="math-symbols">
            {SYMBOLS.map((s, i) => (
              <span
                key={i}
                className="math-sym"
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

          <div className="reg-card">
            {/* Badge */}
            <div>
              <span className="reg-badge">
                <span className="reg-badge-dot" />
                Math Quiz Arena
              </span>
            </div>

            <h1 className="reg-title">
              Join the <span>Arena</span>
            </h1>
            <p className="reg-subtitle">
              Create your account and start solving smarter.
            </p>

            {/* Progress bar */}
            <div className="reg-steps">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`reg-step ${filledCount > i ? "done" : ""} ${filledCount === i && i < 5 ? "active" : ""}`}
                />
              ))}
            </div>

            {error && (
              <div className="reg-error">
                <span>⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleRegister}>
              {[
                {
                  key: "name",
                  label: "Full Name",
                  type: "text",
                  placeholder: "Your name",
                },
                {
                  key: "email",
                  label: "Email",
                  type: "email",
                  placeholder: "you@example.com",
                },
                {
                  key: "password",
                  label: "Password",
                  type: "password",
                  placeholder: "Min. 8 characters",
                  hint: "Use a strong, unique password.",
                },
                {
                  key: "phone",
                  label: "Phone",
                  type: "text",
                  placeholder: "10-digit number",
                },
                {
                  key: "answer",
                  label: "Security Answer",
                  type: "text",
                  placeholder: "e.g. your favorite color",
                  hint: "Used for password recovery.",
                },
              ].map(({ key, label, type, placeholder, hint }) => (
                <div key={key} className="reg-field">
                  <label className="reg-label">{label}</label>
                  <div className="reg-input-wrap">
                    <span className="reg-input-icon">{FIELD_ICONS[key]}</span>
                    <input
                      type={type}
                      className="reg-input"
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={set(key)}
                      required
                      autoComplete={key === "password" ? "new-password" : "off"}
                    />
                  </div>
                  {hint && <div className="reg-hint">{hint}</div>}
                </div>
              ))}

              <button type="submit" className="reg-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="reg-spinner" /> Creating account…
                  </>
                ) : (
                  <>Create Account →</>
                )}
              </button>
            </form>

            <div className="reg-divider">
              <div className="reg-divider-line" />
              <span className="reg-divider-text">or</span>
              <div className="reg-divider-line" />
            </div>

            <p className="reg-login-link">
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Register;
