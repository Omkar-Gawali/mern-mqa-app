import AdminMenu from "./AdminMenu";
import Layout from "../components/layout/Layout.js";
import React, { useEffect, useState } from "react";
import QuizForm from "../Form/QuizForm";
import axios from "axios";
import toast from "react-hot-toast";
import QuizUpdateForm from "../Form/QuizUpdateForm.js";

const API_URL = process.env.REACT_APP_API_URL;

/* ─── Inline styles ────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');

  .cq-root * { box-sizing: border-box; }

  .cq-root {
    font-family: 'Syne', sans-serif;
    background: #0a0a0f;
    min-height: 100vh;
    color: #e8e8f0;
  }

  /* ── Page header ── */
  .cq-header {
    padding: 36px 0 28px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 32px;
  }
  .cq-breadcrumb {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.18em;
    color: #39ff7e;
    text-transform: uppercase;
    margin-bottom: 8px;
    opacity: 0.9;
  }
  .cq-title {
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 800;
    letter-spacing: -0.02em;
    margin: 0;
    line-height: 1;
  }
  .cq-title span { color: #39ff7e; }

  /* ── Layout grid ── */
  .cq-grid {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 24px;
    align-items: start;
  }
  @media (max-width: 768px) {
    .cq-grid { grid-template-columns: 1fr; }
  }

  /* ── Panel card ── */
  .cq-panel {
    background: #111118;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    overflow: hidden;
  }

  /* ── Create section ── */
  .cq-section {
    padding: 28px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .cq-section:last-child { border-bottom: none; }

  .cq-section-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #39ff7e;
    margin-bottom: 18px;
  }
  .cq-section-label::before {
    content: '';
    display: block;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #39ff7e;
    box-shadow: 0 0 8px #39ff7e;
  }

  .cq-section-title {
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 6px;
    letter-spacing: -0.01em;
  }
  .cq-section-sub {
    font-size: 13px;
    color: rgba(232,232,240,0.45);
    margin: 0 0 20px;
  }

  /* ── Badge ── */
  .cq-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    background: rgba(57,255,126,0.1);
    color: #39ff7e;
    border: 1px solid rgba(57,255,126,0.25);
    padding: 4px 12px;
    border-radius: 100px;
  }

  /* ── Create form ── */
  .cq-form-row {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .cq-input {
    flex: 1;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 12px 16px;
    color: #e8e8f0;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .cq-input::placeholder { color: rgba(232,232,240,0.3); }
  .cq-input:focus {
    border-color: rgba(57,255,126,0.5);
    background: rgba(57,255,126,0.04);
  }

  .cq-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: #39ff7e;
    color: #0a0a0f;
    border: none;
    border-radius: 10px;
    padding: 12px 20px;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    transition: filter 0.2s, transform 0.15s;
  }
  .cq-btn-primary:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }
  .cq-btn-primary:active { transform: translateY(0); }

  /* ── Table ── */
  .cq-table-wrap { overflow-x: auto; }
  .cq-table {
    width: 100%;
    border-collapse: collapse;
  }
  .cq-table th {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(232,232,240,0.4);
    padding: 0 16px 14px;
    text-align: left;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .cq-table th:last-child { text-align: right; }

  .cq-table td {
    padding: 14px 16px;
    font-size: 14px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    vertical-align: middle;
  }
  .cq-table tr:last-child td { border-bottom: none; }
  .cq-table tbody tr {
    transition: background 0.15s;
  }
  .cq-table tbody tr:hover { background: rgba(255,255,255,0.025); }

  .cq-num {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: rgba(232,232,240,0.3);
    width: 40px;
  }

  .cq-quiz-name {
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  .cq-actions {
    text-align: right;
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }

  .cq-btn-edit {
    background: rgba(255, 196, 0, 0.1);
    border: 1px solid rgba(255,196,0,0.25);
    color: #ffc400;
    border-radius: 8px;
    padding: 6px 14px;
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }
  .cq-btn-edit:hover {
    background: rgba(255,196,0,0.18);
    transform: translateY(-1px);
  }

  .cq-btn-delete {
    background: rgba(255, 65, 65, 0.08);
    border: 1px solid rgba(255,65,65,0.2);
    color: #ff4141;
    border-radius: 8px;
    padding: 6px 14px;
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }
  .cq-btn-delete:hover {
    background: rgba(255,65,65,0.16);
    transform: translateY(-1px);
  }

  /* ── Empty state ── */
  .cq-empty {
    padding: 48px 28px;
    text-align: center;
  }
  .cq-empty-icon {
    font-size: 36px;
    margin-bottom: 12px;
    opacity: 0.4;
  }
  .cq-empty-text {
    font-size: 14px;
    color: rgba(232,232,240,0.35);
  }

  /* ── Modal ── */
  .cq-modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(6px);
    z-index: 1050;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: cq-fade-in 0.2s ease;
  }
  @keyframes cq-fade-in { from { opacity: 0; } to { opacity: 1; } }

  .cq-modal {
    background: #15151e;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 18px;
    width: 100%;
    max-width: 440px;
    overflow: hidden;
    animation: cq-slide-up 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes cq-slide-up { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity:1; transform: none; } }

  .cq-modal-header {
    padding: 22px 26px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .cq-modal-title {
    font-size: 18px;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.01em;
  }
  .cq-modal-close {
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
  .cq-modal-close:hover { background: rgba(255,255,255,0.12); }

  .cq-modal-body { padding: 26px; }

  .cq-modal-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(232,232,240,0.5);
    margin-bottom: 10px;
    display: block;
  }
  .cq-modal-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }
  .cq-btn-cancel {
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
  .cq-btn-cancel:hover { background: rgba(255,255,255,0.09); }
  .cq-btn-save {
    flex: 1;
    background: #39ff7e;
    color: #0a0a0f;
    border: none;
    border-radius: 10px;
    padding: 12px;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: filter 0.2s;
  }
  .cq-btn-save:hover { filter: brightness(1.1); }
`;

/* ─── Component ─────────────────────────────────────────────────────────────── */
const CreateQuiz = () => {
  const [title, setTitle] = useState("");
  const [quiz, setQuizes] = useState([]);
  const [quizToUpdate, setQuizToUpdate] = useState("");
  const [id, setId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const { data } = await axios.post(`${API_URL}/api/quiz/create-quiz`, {
        title,
      });
      toast.success(data?.message);
      setTitle("");
      getAllQuizes();
    } catch (error) {
      console.log(error);
      toast.error("Failed to create quiz");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${API_URL}/api/quiz/update-quiz/${id}`,
        { title: quizToUpdate },
      );
      toast.success(data.message);
      setQuizToUpdate("");
      setId(null);
      setShowModal(false);
      getAllQuizes();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update quiz");
    }
  };

  const getAllQuizes = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/quiz/get-all-quizes`);
      setQuizes(data.quizes || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (quizId) => {
    try {
      const { data } = await axios.delete(
        `${API_URL}/api/quiz/delete-quiz/${quizId}`,
      );
      toast.success(data?.message || "Quiz deleted");
      getAllQuizes();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete quiz");
    }
  };

  useEffect(() => {
    getAllQuizes();
  }, []);

  return (
    <Layout>
      <style>{styles}</style>
      <div className="cq-root">
        <div className="container-fluid px-4">
          {/* Page Header */}
          <div className="cq-header">
            <div className="cq-breadcrumb">Admin · Quizzes</div>
            <h1 className="cq-title">
              Manage <span>Quizzes</span>
            </h1>
          </div>

          {/* Grid */}
          <div className="cq-grid">
            {/* Sidebar */}
            <div>
              <AdminMenu />
            </div>

            {/* Main panel */}
            <div className="cq-panel">
              {/* Create section */}
              <div className="cq-section">
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: 18,
                  }}
                >
                  <div>
                    <div className="cq-section-label">New quiz</div>
                    <h2 className="cq-section-title">Create Quiz</h2>
                    <p className="cq-section-sub">
                      Add a new quiz set to the platform.
                    </p>
                  </div>
                  <span className="cq-badge">{quiz.length} total</span>
                </div>

                <div className="cq-form-row">
                  <input
                    className="cq-input"
                    type="text"
                    placeholder="Enter quiz title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreate(e)}
                  />
                  <button className="cq-btn-primary" onClick={handleCreate}>
                    <span>+</span> Create
                  </button>
                </div>
              </div>

              {/* Table section */}
              <div className="cq-section">
                <div className="cq-section-label">All quizzes</div>

                {quiz.length === 0 ? (
                  <div className="cq-empty">
                    <div className="cq-empty-icon">📋</div>
                    <p className="cq-empty-text">
                      No quizzes yet. Create one above to get started.
                    </p>
                  </div>
                ) : (
                  <div className="cq-table-wrap">
                    <table className="cq-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Quiz Title</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quiz.map((q, index) => (
                          <tr key={q._id}>
                            <td className="cq-num">
                              {String(index + 1).padStart(2, "0")}
                            </td>
                            <td className="cq-quiz-name">{q.title}</td>
                            <td>
                              <div className="cq-actions">
                                <button
                                  className="cq-btn-edit"
                                  onClick={() => {
                                    setQuizToUpdate(q.title);
                                    setId(q._id);
                                    setShowModal(true);
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="cq-btn-delete"
                                  onClick={() => handleDelete(q._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Update Modal — custom, no Bootstrap dependency */}
        {showModal && (
          <div className="cq-modal-overlay" onClick={() => setShowModal(false)}>
            <div className="cq-modal" onClick={(e) => e.stopPropagation()}>
              <div className="cq-modal-header">
                <h2 className="cq-modal-title">Update Quiz</h2>
                <button
                  className="cq-modal-close"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="cq-modal-body">
                <label className="cq-modal-label">Quiz Title</label>
                <input
                  className="cq-input"
                  style={{ width: "100%" }}
                  type="text"
                  value={quizToUpdate}
                  onChange={(e) => setQuizToUpdate(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUpdate(e)}
                  autoFocus
                />
                <div className="cq-modal-actions">
                  <button
                    className="cq-btn-cancel"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="cq-btn-save" onClick={handleUpdate}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CreateQuiz;
