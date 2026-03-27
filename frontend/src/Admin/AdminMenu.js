import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  PersonCircle,
  PatchPlus,
  ListTask,
  ClipboardCheck,
  BarChartLine,
  Trophy,
} from "react-bootstrap-icons";

const menuItems = [
  {
    name: "Admin Profile",
    icon: PersonCircle,
    path: "/dashboard/admin",
    desc: "Account settings",
  },
  {
    name: "Create Question",
    icon: PatchPlus,
    path: "/dashboard/admin/add-question",
    desc: "Add new questions",
  },
  {
    name: "Create Quiz",
    icon: ClipboardCheck,
    path: "/dashboard/admin/create-quiz",
    desc: "Build a quiz set",
  },
  {
    name: "Questions",
    icon: ListTask,
    path: "/dashboard/admin/all-questions",
    desc: "Browse & manage",
  },
  {
    name: "Quiz Results",
    icon: BarChartLine,
    path: "/dashboard/admin/get-all-results",
    desc: "View submissions",
  },
  {
    name: "Leaderboard",
    icon: Trophy,
    path: "/dashboard/admin/leaderboard",
    desc: "Top performers",
  },
];

const AdminMenu = () => {
  const location = useLocation();

  return (
    <>
      <style>{CSS}</style>
      <nav className="am-root">
        {/* Header */}
        <div className="am-header">
          <div className="am-header-badge">
            <span className="am-header-dot" />
            ADMIN
          </div>
          <p className="am-header-sub">Control Panel</p>
        </div>

        {/* Divider */}
        <div className="am-divider" />

        {/* Menu items */}
        <div className="am-list">
          {menuItems.map((item, idx) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                to={item.path}
                className={`am-item ${active ? "am-item--active" : ""}`}
                style={{ animationDelay: `${idx * 45}ms` }}
              >
                {/* Active indicator bar */}
                <span className="am-bar" />

                {/* Icon box */}
                <div className="am-icon-wrap">
                  <Icon size={15} />
                </div>

                {/* Text */}
                <div className="am-text">
                  <span className="am-name">{item.name}</span>
                  <span className="am-desc">{item.desc}</span>
                </div>

                {/* Active chevron */}
                {active && <span className="am-chevron">›</span>}
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="am-footer">
          <span className="am-footer-text">MQA v1.0</span>
        </div>
      </nav>
    </>
  );
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

  .am-root {
    width: 100%;
    background: #0d0f18;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    overflow: hidden;
    font-family: 'Outfit', sans-serif;
    display: flex;
    flex-direction: column;
  }

  /* ── Header ── */
  .am-header {
    padding: 20px 20px 14px;
  }
  .am-header-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.14em;
    color: #7c6fff;
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  .am-header-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #7c6fff;
    animation: am-pulse 2s infinite;
  }
  @keyframes am-pulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50%      { opacity: 0.4; transform: scale(0.65); }
  }
  .am-header-sub {
    font-size: 0.72rem;
    color: rgba(255,255,255,0.22);
    font-weight: 400;
    margin: 0;
    letter-spacing: 0.02em;
  }

  /* ── Divider ── */
  .am-divider {
    height: 1px;
    background: rgba(255,255,255,0.05);
    margin: 0 14px 8px;
  }

  /* ── List ── */
  .am-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 4px 10px;
  }

  /* ── Item ── */
  .am-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 10px 12px;
    border-radius: 10px;
    text-decoration: none;
    transition: background 0.18s, transform 0.15s;
    animation: am-slidein 0.35s ease both;
    overflow: hidden;
  }
  @keyframes am-slidein {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .am-item:hover {
    background: rgba(124,111,255,0.07);
    transform: translateX(2px);
  }
  .am-item--active {
    background: rgba(124,111,255,0.12);
  }
  .am-item--active:hover {
    background: rgba(124,111,255,0.16);
  }

  /* Active left bar */
  .am-bar {
    position: absolute;
    left: 0; top: 20%; bottom: 20%;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: #7c6fff;
    opacity: 0;
    transition: opacity 0.2s;
  }
  .am-item--active .am-bar { opacity: 1; }

  /* Icon */
  .am-icon-wrap {
    width: 32px; height: 32px;
    flex-shrink: 0;
    border-radius: 8px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    display: flex; align-items: center; justify-content: center;
    color: rgba(255,255,255,0.35);
    transition: background 0.18s, border-color 0.18s, color 0.18s;
  }
  .am-item:hover .am-icon-wrap {
    background: rgba(124,111,255,0.1);
    border-color: rgba(124,111,255,0.25);
    color: #a5b4fc;
  }
  .am-item--active .am-icon-wrap {
    background: rgba(124,111,255,0.18);
    border-color: rgba(124,111,255,0.4);
    color: #a5b4fc;
  }

  /* Text */
  .am-text {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
  }
  .am-name {
    font-size: 0.85rem;
    font-weight: 500;
    color: rgba(255,255,255,0.55);
    white-space: nowrap;
    transition: color 0.18s;
    letter-spacing: 0.01em;
  }
  .am-desc {
    font-size: 0.68rem;
    color: rgba(255,255,255,0.2);
    font-weight: 400;
    white-space: nowrap;
    transition: color 0.18s;
  }
  .am-item:hover .am-name,
  .am-item--active .am-name {
    color: rgba(255,255,255,0.9);
  }
  .am-item:hover .am-desc,
  .am-item--active .am-desc {
    color: rgba(255,255,255,0.38);
  }

  /* Chevron */
  .am-chevron {
    margin-left: auto;
    font-size: 1.1rem;
    color: #7c6fff;
    line-height: 1;
    flex-shrink: 0;
  }

  /* ── Footer ── */
  .am-footer {
    margin-top: auto;
    padding: 12px 20px 16px;
    border-top: 1px solid rgba(255,255,255,0.04);
  }
  .am-footer-text {
    font-size: 0.68rem;
    color: rgba(255,255,255,0.15);
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
`;

export default AdminMenu;
