import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import toast from "react-hot-toast";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');

  .mqa-nav {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: rgba(10, 10, 15, 0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(99, 255, 180, 0.1);
    font-family: 'Syne', sans-serif;
    padding: 0 1.5rem;
  }

  .mqa-nav-inner {
    max-width: 1140px;
    margin: 0 auto;
    height: 62px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  /* Brand */
  .mqa-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    flex-shrink: 0;
  }
  .mqa-brand-icon {
    width: 36px;
    height: 36px;
    background: #63ffb4;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Space Mono', monospace;
    font-weight: 700;
    font-size: 1rem;
    color: #0a0a0f;
    flex-shrink: 0;
    box-shadow: 0 0 16px rgba(99,255,180,0.3);
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .mqa-brand:hover .mqa-brand-icon {
    box-shadow: 0 0 28px rgba(99,255,180,0.55);
    transform: rotate(-6deg) scale(1.05);
  }
  .mqa-brand-text {
    display: flex;
    flex-direction: column;
    line-height: 1.1;
  }
  .mqa-brand-name {
    font-weight: 800;
    font-size: 1rem;
    color: #f0f0f8;
    letter-spacing: -0.01em;
  }
  .mqa-brand-sub {
    font-size: 0.62rem;
    color: rgba(245, 244, 244, 1);
    font-family: 'Space Mono', monospace;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  /* Nav links */
  .mqa-links {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .mqa-link {
    font-size: 0.85rem;
    font-weight: 600;
    color: rgba(255,255,255,0.45);
    text-decoration: none;
    padding: 6px 12px;
    border-radius: 8px;
    transition: color 0.2s, background 0.2s;
    position: relative;
  }
  .mqa-link:hover {
    color: #f0f0f8;
    background: rgba(255,255,255,0.06);
  }
  .mqa-link.active {
    color: #63ffb4;
    background: rgba(99,255,180,0.08);
  }
  .mqa-link.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 50%;
    transform: translateX(-50%);
    width: 16px;
    height: 2px;
    background: #63ffb4;
    border-radius: 100px;
  }

  /* CTA buttons */
  .mqa-btn-ghost {
    font-size: 0.85rem;
    font-weight: 600;
    font-family: 'Syne', sans-serif;
    color: rgba(255,255,255,0.5);
    background: transparent;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 8px;
    padding: 6px 14px;
    text-decoration: none;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
    cursor: pointer;
  }
  .mqa-btn-ghost:hover {
    color: #f0f0f8;
    border-color: rgba(255,255,255,0.28);
    background: rgba(255,255,255,0.05);
  }
  .mqa-btn-primary {
    font-size: 0.85rem;
    font-weight: 700;
    font-family: 'Syne', sans-serif;
    color: #0a0a0f;
    background: #63ffb4;
    border: none;
    border-radius: 8px;
    padding: 7px 16px;
    text-decoration: none;
    transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }
  .mqa-btn-primary:hover {
    background: #7fffca;
    box-shadow: 0 0 20px rgba(99,255,180,0.35);
    transform: translateY(-1px);
  }

  /* User dropdown */
  .mqa-user-wrap {
    position: relative;
  }
  .mqa-user-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 5px 10px 5px 6px;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
    font-family: 'Syne', sans-serif;
  }
  .mqa-user-btn:hover {
    background: rgba(99,255,180,0.07);
    border-color: rgba(99,255,180,0.2);
  }
  .mqa-avatar {
    width: 28px;
    height: 28px;
    background: #63ffb4;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Space Mono', monospace;
    font-weight: 700;
    font-size: 0.75rem;
    color: #0a0a0f;
    flex-shrink: 0;
  }
  .mqa-user-name {
    font-size: 0.83rem;
    font-weight: 600;
    color: #f0f0f8;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .mqa-chevron {
    font-size: 0.6rem;
    color: rgba(255,255,255,0.35);
    transition: transform 0.2s;
  }
  .mqa-chevron.open { transform: rotate(180deg); }

  /* Dropdown menu */
  .mqa-dropdown {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    background: #131320;
    border: 1px solid rgba(99,255,180,0.12);
    border-radius: 12px;
    min-width: 200px;
    box-shadow: 0 20px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,255,180,0.05);
    overflow: hidden;
    animation: dropIn 0.18s cubic-bezier(0.22,1,0.36,1) both;
    z-index: 100;
  }
  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .mqa-dropdown-header {
    padding: 12px 14px 10px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .mqa-dropdown-signed {
    font-size: 0.7rem;
    color: rgba(255,255,255,0.3);
    font-family: 'Space Mono', monospace;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 2px;
  }
  .mqa-dropdown-email {
    font-size: 0.82rem;
    font-weight: 600;
    color: #f0f0f8;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .mqa-dropdown-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    font-size: 0.85rem;
    font-weight: 600;
    color: rgba(255,255,255,0.6);
    text-decoration: none;
    background: none;
    border: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
    font-family: 'Syne', sans-serif;
    transition: background 0.15s, color 0.15s;
  }
  .mqa-dropdown-item:hover {
    background: rgba(255,255,255,0.05);
    color: #f0f0f8;
  }
  .mqa-dropdown-item.danger {
    color: rgba(255,100,100,0.7);
  }
  .mqa-dropdown-item.danger:hover {
    background: rgba(255,80,80,0.08);
    color: #ff7070;
  }
  .mqa-dropdown-divider {
    height: 1px;
    background: rgba(255,255,255,0.06);
    margin: 2px 0;
  }

  /* Hamburger */
  .mqa-hamburger {
    display: none;
    flex-direction: column;
    gap: 4px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    border-radius: 8px;
    transition: background 0.2s;
  }
  .mqa-hamburger:hover { background: rgba(255,255,255,0.07); }
  .mqa-hamburger-line {
    width: 20px;
    height: 2px;
    background: rgba(255,255,255,0.6);
    border-radius: 100px;
    transition: transform 0.25s, opacity 0.2s, width 0.2s;
  }
  .mqa-hamburger.open .mqa-hamburger-line:nth-child(1) { transform: translateY(6px) rotate(45deg); }
  .mqa-hamburger.open .mqa-hamburger-line:nth-child(2) { opacity: 0; width: 0; }
  .mqa-hamburger.open .mqa-hamburger-line:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

  /* Mobile drawer */
  .mqa-mobile-menu {
    display: none;
    background: rgba(10,10,15,0.97);
    border-top: 1px solid rgba(99,255,180,0.08);
    padding: 1rem 1.5rem 1.5rem;
    animation: slideDown 0.22s ease both;
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .mqa-mobile-menu.open { display: block; }
  .mqa-mobile-link {
    display: block;
    font-size: 0.9rem;
    font-weight: 600;
    color: rgba(255,255,255,0.5);
    text-decoration: none;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    transition: color 0.2s;
    font-family: 'Syne', sans-serif;
  }
  .mqa-mobile-link:hover, .mqa-mobile-link.active { color: #63ffb4; }
  .mqa-mobile-actions {
    display: flex;
    gap: 8px;
    margin-top: 1rem;
  }
  .mqa-mobile-actions .mqa-btn-ghost,
  .mqa-mobile-actions .mqa-btn-primary {
    flex: 1;
    text-align: center;
    justify-content: center;
  }

  @media (max-width: 768px) {
    .mqa-links { display: none !important; }
    .mqa-desktop-auth { display: none !important; }
    .mqa-hamburger { display: flex; }
    .mqa-user-name { display: none; }
  }
`;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth } = useAuth();
  const [dropOpen, setDropOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropRef = useRef(null);

  const isActive = (path) => (location.pathname === path ? "active" : "");

  const userInitial = auth?.user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  const handleLogout = () => {
    setAuth({ user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Logged out successfully 👋");
    navigate("/login");
    setDropOpen(false);
    setMenuOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const dashPath = `/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`;

  return (
    <>
      <style>{styles}</style>
      <nav className="mqa-nav">
        <div className="mqa-nav-inner">
          {/* Brand */}
          <Link className="mqa-brand" to="/">
            <div className="mqa-brand-icon">Q</div>
            <div className="mqa-brand-text">
              <span className="mqa-brand-name">MQA</span>
              <span className="mqa-brand-sub">Math Quiz Arena</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <ul className="mqa-links">
            <li>
              <Link className={`mqa-link ${isActive("/")}`} to="/">
                Home
              </Link>
            </li>
          </ul>

          {/* Desktop auth */}
          <div
            className="mqa-desktop-auth"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            {!auth?.user ? (
              <>
                <Link className="mqa-btn-ghost" to="/register">
                  Register
                </Link>
                <Link className="mqa-btn-primary" to="/login">
                  Login →
                </Link>
              </>
            ) : (
              <div className="mqa-user-wrap" ref={dropRef}>
                <button
                  className="mqa-user-btn"
                  onClick={() => setDropOpen((o) => !o)}
                >
                  <div className="mqa-avatar">{userInitial}</div>
                  <span className="mqa-user-name">{auth?.user?.name}</span>
                  <span className={`mqa-chevron ${dropOpen ? "open" : ""}`}>
                    ▼
                  </span>
                </button>

                {dropOpen && (
                  <div className="mqa-dropdown">
                    <div className="mqa-dropdown-header">
                      <div className="mqa-dropdown-signed">Signed in as</div>
                      <div className="mqa-dropdown-email">
                        {auth?.user?.email}
                      </div>
                    </div>
                    <Link
                      className="mqa-dropdown-item"
                      to={dashPath}
                      onClick={() => setDropOpen(false)}
                    >
                      ⊞ &nbsp;Dashboard
                    </Link>
                    <div className="mqa-dropdown-divider" />
                    <button
                      className="mqa-dropdown-item danger"
                      onClick={handleLogout}
                    >
                      ⊗ &nbsp;Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className={`mqa-hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span className="mqa-hamburger-line" />
            <span className="mqa-hamburger-line" />
            <span className="mqa-hamburger-line" />
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`mqa-mobile-menu ${menuOpen ? "open" : ""}`}>
          <Link
            className={`mqa-mobile-link ${isActive("/")}`}
            to="/"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          {auth?.user ? (
            <>
              <Link
                className="mqa-mobile-link"
                to={dashPath}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <div style={{ marginTop: "1rem" }}>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "rgba(255,255,255,0.3)",
                    fontFamily: "'Space Mono',monospace",
                    marginBottom: "4px",
                  }}
                >
                  Signed in as
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "#f0f0f8",
                    fontWeight: 600,
                    marginBottom: "12px",
                  }}
                >
                  {auth?.user?.email}
                </div>
                <button
                  className="mqa-btn-ghost"
                  style={{ width: "100%", textAlign: "center" }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="mqa-mobile-actions">
              <Link
                className="mqa-btn-ghost"
                to="/register"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
              <Link
                className="mqa-btn-primary"
                to="/login"
                onClick={() => setMenuOpen(false)}
              >
                Login →
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
