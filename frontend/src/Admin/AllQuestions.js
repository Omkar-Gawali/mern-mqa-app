import React, { useEffect, useState, useRef } from "react";
import Layout from "../components/layout/Layout";
import axios from "axios";
import AdminMenu from "./AdminMenu";
import toast from "react-hot-toast";

const API_URL = process.env.REACT_APP_API_URL;

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');

  .aq-root * { box-sizing: border-box; }

  .aq-root {
    font-family: 'Syne', sans-serif;
    background: #0a0a0f;
    min-height: 100vh;
    color: #e8e8f0;
  }

  /* ── Header ── */
  .aq-header {
    padding: 36px 0 28px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 32px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }
  .aq-breadcrumb {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.18em;
    color: #39ff7e;
    text-transform: uppercase;
    margin-bottom: 8px;
    opacity: 0.9;
  }
  .aq-title {
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 800;
    letter-spacing: -0.02em;
    margin: 0;
    line-height: 1;
  }
  .aq-title span { color: #39ff7e; }

  .aq-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    background: rgba(57,255,126,0.1);
    color: #39ff7e;
    border: 1px solid rgba(57,255,126,0.25);
    padding: 5px 14px;
    border-radius: 100px;
    white-space: nowrap;
  }

  /* ── Grid ── */
  .aq-grid {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 24px;
    align-items: start;
  }
  @media (max-width: 768px) {
    .aq-grid { grid-template-columns: 1fr; }
  }

  /* ── Section label ── */
  .aq-section-label {
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
  .aq-section-label::before {
    content: '';
    display: block;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #39ff7e;
    box-shadow: 0 0 8px #39ff7e;
    flex-shrink: 0;
  }

  /* ── Question card ── */
  .aq-card {
    background: #111118;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 16px;
    transition: border-color 0.2s;
  }
  .aq-card:hover { border-color: rgba(255,255,255,0.13); }

  .aq-card-top {
    padding: 20px 24px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .aq-q-num {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: #39ff7e;
    opacity: 0.8;
    white-space: nowrap;
    margin-top: 3px;
    flex-shrink: 0;
  }

  .aq-q-text {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.01em;
    line-height: 1.45;
    flex: 1;
  }

  .aq-opt-count {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: rgba(232,232,240,0.4);
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    padding: 3px 10px;
    border-radius: 6px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* ── Options grid ── */
  .aq-card-body {
    padding: 18px 24px 20px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 20px;
    align-items: center;
  }
  @media (max-width: 600px) {
    .aq-card-body { grid-template-columns: 1fr; }
  }

  .aq-options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  @media (max-width: 500px) {
    .aq-options { grid-template-columns: 1fr; }
  }

  .aq-option {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px;
    padding: 10px 14px;
    transition: border-color 0.15s;
  }
  .aq-option.correct {
    background: rgba(57,255,126,0.07);
    border-color: rgba(57,255,126,0.35);
  }
  .aq-opt-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(232,232,240,0.35);
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .aq-opt-label.correct { color: #39ff7e; }
  .aq-correct-pill {
    background: rgba(57,255,126,0.15);
    color: #39ff7e;
    font-size: 9px;
    padding: 1px 7px;
    border-radius: 100px;
    border: 1px solid rgba(57,255,126,0.3);
  }
  .aq-opt-text {
    font-size: 13px;
    color: #e8e8f0;
    line-height: 1.4;
  }

  /* ── Card actions ── */
  .aq-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-shrink: 0;
  }
  .aq-btn-edit {
    background: rgba(255,196,0,0.1);
    border: 1px solid rgba(255,196,0,0.25);
    color: #ffc400;
    border-radius: 8px;
    padding: 8px 18px;
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    white-space: nowrap;
  }
  .aq-btn-edit:hover { background: rgba(255,196,0,0.18); transform: translateY(-1px); }

  .aq-btn-delete {
    background: rgba(255,65,65,0.08);
    border: 1px solid rgba(255,65,65,0.2);
    color: #ff4141;
    border-radius: 8px;
    padding: 8px 18px;
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    white-space: nowrap;
  }
  .aq-btn-delete:hover { background: rgba(255,65,65,0.16); transform: translateY(-1px); }

  /* ── Pagination ── */
  .aq-pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 24px;
    padding-bottom: 32px;
  }
  .aq-page-btn {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: #e8e8f0;
    border-radius: 9px;
    padding: 9px 20px;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }
  .aq-page-btn:hover:not(:disabled) {
    background: rgba(57,255,126,0.08);
    border-color: rgba(57,255,126,0.3);
    color: #39ff7e;
  }
  .aq-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .aq-page-info {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: rgba(232,232,240,0.45);
  }
  .aq-page-info strong { color: #e8e8f0; }

  /* ── Empty state ── */
  .aq-empty {
    background: #111118;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 64px 28px;
    text-align: center;
  }
  .aq-empty-icon { font-size: 40px; opacity: 0.35; margin-bottom: 14px; }
  .aq-empty-title { font-size: 18px; font-weight: 700; margin-bottom: 6px; }
  .aq-empty-sub { font-size: 13px; color: rgba(232,232,240,0.4); }

  /* ── Modal ── */
  .aq-modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.78);
    backdrop-filter: blur(7px);
    z-index: 1050;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: aq-fade-in 0.2s ease;
  }
  @keyframes aq-fade-in { from { opacity: 0; } to { opacity: 1; } }

  .aq-modal {
    background: #13131c;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px;
    width: 100%;
    max-width: 580px;
    max-height: 90vh;
    overflow-y: auto;
    animation: aq-slide-up 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes aq-slide-up {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to { opacity: 1; transform: none; }
  }
  .aq-modal::-webkit-scrollbar { width: 4px; }
  .aq-modal::-webkit-scrollbar-track { background: transparent; }
  .aq-modal::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

  .aq-modal-header {
    padding: 22px 26px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    background: #13131c;
    z-index: 1;
  }
  .aq-modal-title { font-size: 18px; font-weight: 700; margin: 0; letter-spacing: -0.01em; }
  .aq-modal-close {
    background: rgba(255,255,255,0.07);
    border: none;
    color: #e8e8f0;
    width: 32px; height: 32px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }
  .aq-modal-close:hover { background: rgba(255,255,255,0.13); }

  .aq-modal-body { padding: 24px 26px; }

  /* ── Modal form fields ── */
  .aq-field { margin-bottom: 20px; }
  .aq-label {
    display: block;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(232,232,240,0.5);
    margin-bottom: 8px;
  }
  .aq-input, .aq-textarea {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 11px 14px;
    color: #e8e8f0;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    resize: vertical;
  }

  .aq-textarea { min-height: 80px; }
  .aq-input:focus, .aq-textarea:focus {
    border-color: rgba(57,255,126,0.45);
    background: rgba(57,255,126,0.03);
  }

  .aq-input::placeholder, .aq-textarea::placeholder { color: rgba(232,232,240,0.25); }

  /* radio group */
  .aq-radio-group { display: flex; gap: 10px; flex-wrap: wrap; }
  .aq-radio-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 9px;
    padding: 9px 18px;
    cursor: pointer;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: rgba(232,232,240,0.6);
    transition: all 0.2s;
    user-select: none;
  }
  .aq-radio-btn input { display: none; }
  .aq-radio-btn.active {
    background: rgba(57,255,126,0.1);
    border-color: rgba(57,255,126,0.4);
    color: #39ff7e;
  }

  /* option sub-inputs */
  .aq-option-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  @media (max-width: 500px) { .aq-option-inputs { grid-template-columns: 1fr; } }

  .aq-option-sublabel {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(232,232,240,0.35);
    margin-bottom: 5px;
    display: block;
  }

  /* modal footer */
  .aq-modal-footer {
    padding: 20px 26px;
    border-top: 1px solid rgba(255,255,255,0.06);
    display: flex;
    gap: 10px;
  }
  .aq-btn-cancel {
    flex: 1;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: #e8e8f0;
    border-radius: 10px;
    padding: 12px;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }
  .aq-btn-cancel:hover { background: rgba(255,255,255,0.09); }
  .aq-btn-save {
    flex: 2;
    background: #39ff7e;
    color: #0a0a0f;
    border: none;
    border-radius: 10px;
    padding: 12px;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: filter 0.2s, transform 0.15s;
  }
  .aq-btn-save:hover { filter: brightness(1.1); transform: translateY(-1px); }

  /* ── Custom Dropdown ── */
  .aq-dropdown {
    position: relative;
    width: 100%;
    user-select: none;
  }

  .aq-dropdown-trigger {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 11px 40px 11px 14px;
    color: #e8e8f0;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: border-color 0.2s, background 0.2s;
    outline: none;
  }
  .aq-dropdown-trigger:hover,
  .aq-dropdown-trigger.open {
    border-color: rgba(57,255,126,0.45);
    background: rgba(57,255,126,0.03);
  }
  .aq-dropdown-trigger.placeholder {
    color: rgba(232,232,240,0.25);
  }

  .aq-dropdown-arrow {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: rgba(232,232,240,0.4);
    font-size: 12px;
    transition: transform 0.2s;
  }
  .aq-dropdown-trigger.open ~ .aq-dropdown-arrow,
  .aq-dropdown.open .aq-dropdown-arrow {
    transform: translateY(-50%) rotate(180deg);
    color: #39ff7e;
  }

  .aq-dropdown-menu {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    background: #1a1a26;
    border: 1px solid rgba(57,255,126,0.25);
    border-radius: 12px;
    overflow: hidden;
    z-index: 9999;
    box-shadow: 0 16px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(57,255,126,0.08);
    animation: aq-dropdown-in 0.15s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes aq-dropdown-in {
    from { opacity: 0; transform: translateY(-6px) scale(0.98); }
    to   { opacity: 1; transform: none; }
  }

  .aq-dropdown-item {
    padding: 11px 16px;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    color: rgba(232,232,240,0.7);
    cursor: pointer;
    transition: background 0.12s, color 0.12s;
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .aq-dropdown-item:last-child { border-bottom: none; }

  .aq-dropdown-item:hover {
    background: rgba(57,255,126,0.08);
    color: #e8e8f0;
  }
  .aq-dropdown-item.selected {
    background: rgba(57,255,126,0.12);
    color: #39ff7e;
  }
  .aq-dropdown-item.disabled {
    opacity: 0.35;
    cursor: default;
    pointer-events: none;
  }

  .aq-dropdown-item-badge {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    background: rgba(57,255,126,0.15);
    color: #39ff7e;
    border: 1px solid rgba(57,255,126,0.3);
    padding: 1px 7px;
    border-radius: 100px;
    flex-shrink: 0;
  }

  .aq-dropdown-item-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: rgba(57,255,126,0.5);
    flex-shrink: 0;
  }
  .aq-dropdown-item.selected .aq-dropdown-item-dot {
    background: #39ff7e;
    box-shadow: 0 0 6px #39ff7e;
  }
`;

/* ─── Custom Dropdown Component ─────────────────────────────────────────── */
const OPTION_LABELS = ["A", "B", "C", "D"];

const CustomDropdown = ({ options, value, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedLabel = value
    ? (() => {
        const idx = options.indexOf(value);
        return idx >= 0
          ? `Option ${OPTION_LABELS[idx] || idx + 1}: ${value}`
          : value;
      })()
    : null;

  return (
    <div className={`aq-dropdown${open ? " open" : ""}`} ref={ref}>
      <div
        className={`aq-dropdown-trigger${open ? " open" : ""}${!value ? " placeholder" : ""}`}
        onClick={() => setOpen((o) => !o)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setOpen((o) => !o)}
      >
        <span>{selectedLabel || placeholder}</span>
      </div>

      {/* Arrow icon */}
      <span className="aq-dropdown-arrow">▼</span>

      {open && (
        <div className="aq-dropdown-menu">
          {/* Placeholder / reset row */}
          <div
            className={`aq-dropdown-item disabled`}
            style={{
              opacity: 0.3,
              fontSize: 11,
              letterSpacing: "0.1em",
              fontFamily: "'DM Mono',monospace",
              textTransform: "uppercase",
            }}
          >
            Select the correct option…
          </div>

          {options.map((opt, idx) => {
            const isSelected = opt === value;
            const label = `Option ${OPTION_LABELS[idx] || idx + 1}`;
            return (
              <div
                key={idx}
                className={`aq-dropdown-item${isSelected ? " selected" : ""}`}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
              >
                <span className="aq-dropdown-item-dot" />
                <span style={{ flex: 1 }}>
                  <span
                    style={{
                      fontFamily: "'DM Mono',monospace",
                      fontSize: 10,
                      opacity: 0.5,
                      marginRight: 6,
                    }}
                  >
                    {label}
                  </span>
                  {opt || <em style={{ opacity: 0.3 }}>—</em>}
                </span>
                {isSelected && (
                  <span className="aq-dropdown-item-badge">✓ Correct</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ─── Component ──────────────────────────────────────────────────────────── */
const AllQuestions = () => {
  const [questionText, setQuestionText] = useState("");
  const [numberOfOptions, setNumberOfOptions] = useState(4);
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(5);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleNumOptionsChange = (num) => {
    setNumberOfOptions(num);
    setOptions(new Array(num).fill(""));
    setCorrectAnswer("");
  };

  const handleOptionChange = (index, value) => {
    const next = [...options];
    next[index] = value;
    setOptions(next);
  };

  const getAllQuestions = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/question/get-all-questions`,
      );
      setQuestions(data?.questions || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllQuestions();
  }, []);

  const handleUpdateQuestion = async () => {
    try {
      await axios.put(
        `${API_URL}/api/question/update-question/${editingQuestionId}`,
        { questionText, options, correctAnswer },
      );
      toast.success("Question updated successfully");
      getAllQuestions();
      setShowModal(false);
      setEditingQuestionId(null);
      setQuestionText("");
      setOptions(new Array(numberOfOptions).fill(""));
      setCorrectAnswer("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update question");
    }
  };

  const openEditModal = (q) => {
    setEditingQuestionId(q._id);
    setQuestionText(q.questionText);
    setOptions(q.options);
    setNumberOfOptions(q.options.length);
    setCorrectAnswer(q.correctAnswer);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/question/delete-question/${id}`);
      toast.success("Question deleted successfully");
      getAllQuestions();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete question");
    }
  };

  const indexOfLast = currentPage * questionsPerPage;
  const indexOfFirst = indexOfLast - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(questions.length / questionsPerPage) || 1;

  return (
    <Layout>
      <style>{styles}</style>
      <div className="aq-root">
        <div className="container-fluid px-4">
          {/* Header */}
          <div className="aq-header">
            <div>
              <div className="aq-breadcrumb">Admin · Questions</div>
              <h1 className="aq-title">
                All <span>Questions</span>
              </h1>
            </div>
            <span className="aq-badge">{questions.length} total</span>
          </div>

          {/* Grid */}
          <div className="aq-grid">
            <div>
              <AdminMenu />
            </div>

            <div>
              <div className="aq-section-label">Question bank</div>

              {currentQuestions.length === 0 ? (
                <div className="aq-empty">
                  <div className="aq-empty-icon">🧠</div>
                  <div className="aq-empty-title">No questions yet</div>
                  <p className="aq-empty-sub">
                    Add questions from the <strong>Create Question</strong>{" "}
                    section.
                  </p>
                </div>
              ) : (
                currentQuestions.map((q, i) => {
                  const globalIndex = i + 1 + indexOfFirst;
                  return (
                    <div key={q._id} className="aq-card">
                      <div className="aq-card-top">
                        <span className="aq-q-num">
                          Q{String(globalIndex).padStart(2, "0")}
                        </span>
                        <span className="aq-q-text">{q.questionText}</span>
                        <span className="aq-opt-count">
                          {q.options.length} opts
                        </span>
                      </div>

                      <div className="aq-card-body">
                        <div className="aq-options">
                          {q.options.map((o, idx) => {
                            const isCorrect = o === q.correctAnswer;
                            return (
                              <div
                                key={idx}
                                className={`aq-option${isCorrect ? " correct" : ""}`}
                              >
                                <div
                                  className={`aq-opt-label${isCorrect ? " correct" : ""}`}
                                >
                                  <span>
                                    Option {OPTION_LABELS[idx] || idx + 1}
                                  </span>
                                  {isCorrect && (
                                    <span className="aq-correct-pill">
                                      ✓ Correct
                                    </span>
                                  )}
                                </div>
                                <div className="aq-opt-text">
                                  {o || <em style={{ opacity: 0.3 }}>—</em>}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="aq-actions">
                          <button
                            className="aq-btn-edit"
                            onClick={() => openEditModal(q)}
                          >
                            Edit
                          </button>
                          <button
                            className="aq-btn-delete"
                            onClick={() => handleDelete(q._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {questions.length > questionsPerPage && (
                <div className="aq-pagination">
                  <button
                    className="aq-page-btn"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    ← Prev
                  </button>
                  <span className="aq-page-info">
                    Page <strong>{currentPage}</strong> of{" "}
                    <strong>{totalPages}</strong>
                  </span>
                  <button
                    className="aq-page-btn"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {showModal && (
          <div className="aq-modal-overlay" onClick={() => setShowModal(false)}>
            <div className="aq-modal" onClick={(e) => e.stopPropagation()}>
              <div className="aq-modal-header">
                <h2 className="aq-modal-title">Update Question</h2>
                <button
                  className="aq-modal-close"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="aq-modal-body">
                {/* Question text */}
                <div className="aq-field">
                  <label className="aq-label">Question Text</label>
                  <textarea
                    className="aq-textarea"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Enter the question..."
                  />
                </div>

                {/* Number of options */}
                <div className="aq-field">
                  <label className="aq-label">Number of Options</label>
                  <div className="aq-radio-group">
                    {[2, 4].map((n) => (
                      <label
                        key={n}
                        className={`aq-radio-btn${numberOfOptions === n ? " active" : ""}`}
                      >
                        <input
                          type="radio"
                          value={n}
                          checked={numberOfOptions === n}
                          onChange={() => handleNumOptionsChange(n)}
                        />
                        {n} options
                      </label>
                    ))}
                  </div>
                </div>

                {/* Options */}
                <div className="aq-field">
                  <label className="aq-label">Answer Options</label>
                  <div className="aq-option-inputs">
                    {options.map((opt, idx) => (
                      <div key={idx}>
                        <span className="aq-option-sublabel">
                          Option {OPTION_LABELS[idx] || idx + 1}
                        </span>
                        <textarea
                          className="aq-textarea"
                          style={{ minHeight: 60 }}
                          value={opt}
                          onChange={(e) =>
                            handleOptionChange(idx, e.target.value)
                          }
                          placeholder={`Enter option ${OPTION_LABELS[idx] || idx + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Correct Answer — Custom Dropdown ── */}
                <div className="aq-field">
                  <label className="aq-label">Correct Answer</label>
                  <CustomDropdown
                    options={options}
                    value={correctAnswer}
                    onChange={setCorrectAnswer}
                    placeholder="Select the correct option…"
                  />
                </div>
              </div>

              <div className="aq-modal-footer">
                <button
                  className="aq-btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="aq-btn-save" onClick={handleUpdateQuestion}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AllQuestions;
