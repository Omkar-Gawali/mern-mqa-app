import React from "react";
import { Github, Linkedin, EnvelopeFill } from "react-bootstrap-icons";

const Footer = () => {
  const year = new Date().getFullYear();

  const socialLinks = [
    {
      href: "https://github.com/Omkar-Gawali",
      icon: <Github />,
      label: "GitHub",
    },
    {
      href: "https://www.linkedin.com/in/omkar-ashruba-gawali-33855a22b/",
      icon: <Linkedin />,
      label: "LinkedIn",
    },
    {
      href: "mailto:omkargawali702@gmail.com",
      icon: <EnvelopeFill />,
      label: "Email",
    },
  ];

  return (
    <footer style={styles.footer}>
      {/* Top accent line */}
      <div style={styles.topAccent} />

      <div style={styles.inner}>
        {/* Brand block */}
        <div style={styles.brand}>
          <div style={styles.logoMark}>Q</div>
          <div>
            <div style={styles.logoText}>MQA</div>
            <div style={styles.logoSub}>Math Quiz Arena</div>
          </div>
        </div>

        {/* Center tagline */}
        <p style={styles.tagline}>
          Built with ❤️ for competitive exam aspirants
        </p>

        {/* Social icons */}
        <div style={styles.socials}>
          {socialLinks.map(({ href, icon, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              style={styles.socialLink}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#00d68f";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 0 18px rgba(0, 214, 143, 0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#a0a0a0";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {icon}
            </a>
          ))}
        </div>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Copyright */}
        <p style={styles.copyright}>
          © {year} &nbsp;
          <span style={styles.name}>Omkar Ashruba Gawali</span>
          &nbsp;· All rights reserved
        </p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#0d0d0d",
    color: "#a0a0a0",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  topAccent: {
    height: "2px",
    background: "linear-gradient(90deg, transparent, #00d68f 50%, transparent)",
  },
  inner: {
    maxWidth: "860px",
    margin: "0 auto",
    padding: "36px 24px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "18px",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoMark: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #00d68f, #00a36e)",
    color: "#0d0d0d",
    fontWeight: "800",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    letterSpacing: "-0.5px",
    flexShrink: 0,
  },
  logoText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: "15px",
    letterSpacing: "2px",
    lineHeight: 1,
  },
  logoSub: {
    color: "#555",
    fontSize: "10px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    marginTop: "2px",
  },
  tagline: {
    margin: 0,
    fontSize: "13px",
    color: "#555",
    letterSpacing: "0.3px",
  },
  socials: {
    display: "flex",
    gap: "12px",
  },
  socialLink: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    border: "1px solid #222",
    backgroundColor: "#161616",
    color: "#a0a0a0",
    fontSize: "17px",
    textDecoration: "none",
    transition: "color 0.2s, transform 0.2s, box-shadow 0.2s",
  },
  divider: {
    width: "100%",
    height: "1px",
    backgroundColor: "#1e1e1e",
  },
  copyright: {
    margin: 0,
    fontSize: "12px",
    color: "#444",
    letterSpacing: "0.3px",
  },
  name: {
    color: "#00d68f",
    fontWeight: "600",
  },
};

export default Footer;
