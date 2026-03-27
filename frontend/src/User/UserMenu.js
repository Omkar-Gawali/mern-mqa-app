import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  PersonCircle,
  ClipboardCheck,
  BarChartLine,
} from "react-bootstrap-icons";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  .um-wrap {
    background: #0b0e14;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    overflow: hidden;
    font-family: 'Syne', sans-serif;
  }

  .um-header {
    padding: 14px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; gap: 8px;
  }
  .um-header-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #00ff88; box-shadow: 0 0 8px #00ff88;
    flex-shrink: 0;
  }
  .um-header-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem; font-weight: 500;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(255,255,255,0.22);
  }

  .um-nav {
    display: flex; flex-direction: column;
    padding: 10px;
    gap: 4px;
  }

  .um-link {
    display: flex; align-items: center; gap: 11px;
    padding: 11px 14px; border-radius: 10px;
    text-decoration: none;
    color: rgba(255,255,255,0.38);
    font-size: 0.86rem; font-weight: 600;
    letter-spacing: 0.01em;
    transition: background 0.18s, color 0.18s, border-color 0.18s;
    border: 1px solid transparent;
    position: relative;
  }
  .um-link:hover {
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.75);
    text-decoration: none;
  }
  .um-link.active {
    background: rgba(0,255,136,0.07);
    border-color: rgba(0,255,136,0.18);
    color: #00ff88;
  }

  .um-icon {
    width: 30px; height: 30px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.95rem; flex-shrink: 0;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    transition: background 0.18s, border-color 0.18s, color 0.18s;
    color: rgba(255,255,255,0.3);
  }
  .um-link:hover .um-icon {
    background: rgba(255,255,255,0.07);
    color: rgba(255,255,255,0.65);
  }
  .um-link.active .um-icon {
    background: rgba(0,255,136,0.1);
    border-color: rgba(0,255,136,0.25);
    color: #00ff88;
  }

  .um-active-bar {
    position: absolute; left: 0; top: 50%;
    transform: translateY(-50%);
    width: 3px; height: 60%; border-radius: 0 3px 3px 0;
    background: #00ff88;
    box-shadow: 0 0 8px #00ff88;
    opacity: 0;
    transition: opacity 0.18s;
  }
  .um-link.active .um-active-bar { opacity: 1; }
`;

const menuItems = [
  {
    name: "Profile",
    icon: <PersonCircle />,
    path: "/dashboard/user",
  },
  {
    name: "Results",
    icon: <ClipboardCheck />,
    path: "/dashboard/user/results",
  },
  {
    name: "Leaderboard",
    icon: <BarChartLine />,
    path: "/dashboard/user/leaderboard",
  },
];

const UserMenu = () => {
  const location = useLocation();

  return (
    <>
      <style>{CSS}</style>
      <div className="um-wrap">
        <div className="um-header">
          <span className="um-header-dot" />
          <span className="um-header-label">Navigation</span>
        </div>
        <nav className="um-nav">
          {menuItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={idx}
                to={item.path}
                className={`um-link ${isActive ? "active" : ""}`}
              >
                <span className="um-active-bar" />
                <span className="um-icon">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default UserMenu;
