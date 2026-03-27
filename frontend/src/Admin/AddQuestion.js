import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { Select } from "antd";
import AdminMenu from "./AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

const API_URL = process.env.REACT_APP_API_URL;

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  .aq-root {
    min-height: 100vh;
    background: #050709;
    font-family: 'Syne', sans-serif;
    position: relative;
  }
  .aq-root::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.013) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.013) 1px, transparent 1px);
    background-size: 52px 52px;
    pointer-events: none; z-index: 0;
  }
  .aq-glow {
    position: fixed; border-radius: 50%;
    pointer-events: none; z-index: 0; filter: blur(100px);
  }
  .aq-glow-1 {
    width: 600px; height: 600px; top: -200px; left: -200px;
    background: radial-gradient(circle, rgba(0,255,136,0.04) 0%, transparent 70%);
  }
  .aq-glow-2 {
    width: 400px; height: 400px; bottom: 0; right: -100px;
    background: radial-gradient(circle, rgba(0,200,255,0.035) 0%, transparent 70%);
  }

  .aq-wrap {
    position: relative; z-index: 1;
    padding: 48px 24px 80px;
  }

  /* ── Header ── */
  .aq-header { margin-bottom: 44px; display: flex; flex-direction: column; gap: 6px; }
  .aq-header-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem; font-weight: 500;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: #00ff88; opacity: 0.7;
  }
  .aq-header h1 {
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    font-weight: 800; color: #f0f0f5;
    margin: 0; letter-spacing: -0.02em; line-height: 1.1;
  }
  .aq-header h1 span { color: #00ff88; }

  /* ── Layout ── */
  .aq-layout { display: flex; gap: 28px; align-items: flex-start; }
  .aq-sidebar { width: 220px; flex-shrink: 0; }
  .aq-main { flex: 1; min-width: 0; }

  /* ── Form card ── */
  .aq-card {
    background: #0b0e14;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; overflow: hidden;
    animation: aq-in 0.4s ease both;
  }
  @keyframes aq-in {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .aq-card-header {
    padding: 18px 28px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; gap: 10px;
  }
  .aq-card-header-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #00ff88; box-shadow: 0 0 8px #00ff88;
  }
  .aq-card-header-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem; font-weight: 500;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(255,255,255,0.22);
  }

  .aq-form { padding: 28px; display: flex; flex-direction: column; gap: 24px; }

  /* ── Field ── */
  .aq-field { display: flex; flex-direction: column; gap: 8px; }
  .aq-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem; font-weight: 500;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(255,255,255,0.3);
  }
  .aq-hint {
    font-size: 0.75rem; color: rgba(255,255,255,0.2);
    font-family: 'DM Mono', monospace; letter-spacing: 0.02em;
    margin-top: -4px;
  }

  /* Inputs & textareas */
  .aq-input, .aq-textarea {
    width: 100%; background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;
    color: rgba(255,255,255,0.75); font-family: 'Syne', sans-serif;
    font-size: 0.88rem; font-weight: 500;
    padding: 12px 16px; outline: none; resize: vertical;
    transition: border-color 0.2s, background 0.2s;
    box-sizing: border-box;
  }
  .aq-input::placeholder, .aq-textarea::placeholder { color: rgba(255,255,255,0.18); }
  .aq-input:focus, .aq-textarea:focus {
    border-color: rgba(0,255,136,0.3);
    background: rgba(0,255,136,0.03);
  }

  /* Ant Design Select override */
  .aq-select .ant-select-selector {
    background: rgba(255,255,255,0.03) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    border-radius: 12px !important;
    color: rgba(255,255,255,0.75) !important;
    font-family: 'Syne', sans-serif !important;
    font-size: 0.88rem !important;
    padding: 8px 16px !important;
    height: auto !important;
    min-height: 46px !important;
    transition: border-color 0.2s !important;
  }
  .aq-select.ant-select-focused .ant-select-selector,
  .aq-select .ant-select-selector:hover {
    border-color: rgba(0,255,136,0.3) !important;
    box-shadow: none !important;
  }
  .aq-select .ant-select-selection-placeholder {
    color: rgba(233, 231, 231, 0.18) !important;
    font-family: 'Syne', sans-serif !important;
  }
  .aq-select .ant-select-arrow { color: rgba(255,255,255,0.25) !important; }

  /* ── Radio group ── */
  .aq-radio-group { display: flex; gap: 10px; flex-wrap: wrap; }
  .aq-radio-label {
    display: flex; align-items: center; gap: 10px;
    padding: 11px 20px; border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.02);
    cursor: pointer; transition: all 0.18s;
    font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.4);
    user-select: none;
  }
  .aq-radio-label:hover { border-color: rgba(0,255,136,0.2); color: rgba(255,255,255,0.65); }
  .aq-radio-label input[type="radio"] { display: none; }
  .aq-radio-label.checked {
    background: rgba(0,255,136,0.07);
    border-color: rgba(0,255,136,0.25);
    color: #00ff88;
  }
  .aq-radio-dot {
    width: 14px; height: 14px; border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
    transition: border-color 0.18s; flex-shrink: 0;
  }
  .aq-radio-label.checked .aq-radio-dot {
    border-color: #00ff88;
    background: rgba(0,255,136,0.15);
  }
  .aq-radio-inner {
    width: 6px; height: 6px; border-radius: 50%;
    background: #00ff88; opacity: 0; transition: opacity 0.15s;
  }
  .aq-radio-label.checked .aq-radio-inner { opacity: 1; }

  /* ── Options grid ── */
  .aq-options-grid { display: flex; flex-direction: column; gap: 10px; }
  .aq-option-row { display: flex; align-items: flex-start; gap: 12px; }
  .aq-option-key {
    width: 30px; height: 30px; flex-shrink: 0; border-radius: 8px; margin-top: 2px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Mono', monospace; font-size: 0.7rem; font-weight: 500;
    color: rgba(255,255,255,0.2); letter-spacing: 0.04em;
  }

  /* ── Divider ── */
  .aq-divider { height: 1px; background: rgba(255,255,255,0.05); }

  /* ── Submit button ── */
  .aq-submit {
    width: 100%; padding: 14px;
    background: #00ff88; border: none; border-radius: 12px;
    font-family: 'Syne', sans-serif; font-size: 0.92rem; font-weight: 700;
    color: #050709; letter-spacing: 0.01em; cursor: pointer;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  }
  .aq-submit:hover {
    background: #33ffaa;
    transform: translateY(-1px);
    box-shadow: 0 0 32px rgba(0,255,136,0.25);
  }
  .aq-submit:active { transform: translateY(0); }

  @media (max-width: 768px) {
    .aq-layout { flex-direction: column; }
    .aq-sidebar { width: 100%; }
    .aq-form { padding: 18px; }
  }
`;

const OPTION_KEYS = ["A", "B", "C", "D"];

const AddQuestion = () => {
  const navigate = useNavigate();
  const [quizes, setQuizes] = useState([]);
  const [quizId, setQuizId] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [numberOfOptions, setNumberOfOptions] = useState("");
  const [options, setOptions] = useState([""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const handleNumOptionsChange = (val) => {
    const n = parseInt(val, 10);
    setNumberOfOptions(n);
    setOptions(new Array(n).fill(""));
  };

  const handleOptionChange = (index, e) => {
    const updated = [...options];
    updated[index] = e.target.value;
    setOptions(updated);
  };

  const getAllQuizes = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/quiz/get-all-quizes`);
      if (data?.success) setQuizes(data.quizes);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllQuizes();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${API_URL}/api/question/add-question`,
        { quizId, questionText, options, correctAnswer },
      );
      toast.success(data?.message);
      setQuizId("");
      setOptions([""]);
      setQuestionText("");
      setCorrectAnswer("");
      navigate("/dashboard/admin/all-questions");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <style>{CSS}</style>
      <div className="aq-root">
        <div className="aq-glow aq-glow-1" />
        <div className="aq-glow aq-glow-2" />

        <div className="aq-wrap">
          <div className="aq-header">
            <span className="aq-header-label">Admin · Questions</span>
            <h1>
              Add <span>Question</span>
            </h1>
          </div>

          <div className="aq-layout">
            <div className="aq-sidebar">
              <AdminMenu />
            </div>

            <div className="aq-main">
              <div className="aq-card">
                <div className="aq-card-header">
                  <span className="aq-card-header-dot" />
                  <span className="aq-card-header-label">New question</span>
                </div>

                <form onSubmit={handleCreate} className="aq-form">
                  {/* Quiz select */}
                  <div className="aq-field">
                    <label className="aq-label">Select Quiz</label>
                    <Select
                      className="aq-select"
                      variant={false}
                      size="large"
                      required
                      placeholder="Choose a quiz"
                      onChange={(value) => setQuizId(value)}
                      showSearch
                      value={quizId || undefined}
                      style={{ width: "100%" }}
                      dropdownStyle={{
                        background: "#0f1117",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "12px",
                      }}
                    >
                      {quizes?.map((q) => (
                        <Option
                          className="text-light"
                          key={q._id}
                          value={q._id}
                        >
                          {q.title}
                        </Option>
                      ))}
                    </Select>
                  </div>

                  <div className="aq-divider" />

                  {/* Question text */}
                  <div className="aq-field">
                    <label className="aq-label">Question Text</label>
                    <textarea
                      className="aq-textarea"
                      rows={3}
                      value={questionText}
                      required
                      onChange={(e) => setQuestionText(e.target.value)}
                      placeholder="Enter the question here…"
                    />
                  </div>

                  <div className="aq-divider" />

                  {/* Number of options */}
                  <div className="aq-field">
                    <label className="aq-label">Number of Options</label>
                    <div className="aq-radio-group">
                      {[2, 4].map((n) => (
                        <label
                          key={n}
                          className={`aq-radio-label ${numberOfOptions === n ? "checked" : ""}`}
                        >
                          <input
                            type="radio"
                            name="optionCount"
                            value={n}
                            onChange={() => handleNumOptionsChange(n)}
                            required
                          />
                          <span className="aq-radio-dot">
                            <span className="aq-radio-inner" />
                          </span>
                          {n} options
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Options */}
                  {options.length > 0 && options[0] !== undefined && (
                    <div className="aq-field">
                      <label className="aq-label">Answer Options</label>
                      <div className="aq-options-grid">
                        {options.map((option, index) => (
                          <div key={index} className="aq-option-row">
                            <div className="aq-option-key">
                              {OPTION_KEYS[index] ?? index + 1}
                            </div>
                            <textarea
                              className="aq-textarea"
                              value={option}
                              onChange={(e) => handleOptionChange(index, e)}
                              placeholder={`Option ${OPTION_KEYS[index] ?? index + 1}`}
                              required
                              rows={2}
                              style={{ flex: 1 }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="aq-divider" />

                  {/* Correct answer */}
                  <div className="aq-field">
                    <label className="aq-label">Correct Answer</label>
                    <textarea
                      className="aq-textarea"
                      rows={2}
                      value={correctAnswer}
                      onChange={(e) => setCorrectAnswer(e.target.value)}
                      required
                      placeholder="Must match one of the options exactly…"
                    />
                    <span className="aq-hint">
                      Must match one of the options above exactly.
                    </span>
                  </div>

                  {/* Submit */}
                  <button type="submit" className="aq-submit">
                    Add Question →
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddQuestion;
