"use client";

import { Github, Linkedin, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-text">
          Built by{" "}
          <a
            href="https://adityaai.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            Aditya Gaurav
          </a>
        </div>

        <div className="footer-links">
          <a
            href="https://adityaai.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn"
            style={{ border: "none" }}
          >
            <Globe size={16} />
          </a>
          <a
            href="https://github.com/aditya-ai-architect"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn"
            style={{ border: "none" }}
          >
            <Github size={16} />
          </a>
          <a
            href="https://www.linkedin.com/in/adityaai"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn"
            style={{ border: "none" }}
          >
            <Linkedin size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
