"use client";

import { Github, Linkedin, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="glass p-6 flex items-center justify-between">
          <div className="text-sm text-white/40">
            Built by{" "}
            <a
              href="https://adityaai.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors"
            >
              Aditya Gaurav
            </a>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://adityaai.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-sm p-2.5 text-white/40 hover:text-white transition-colors"
            >
              <Globe size={16} />
            </a>
            <a
              href="https://github.com/aditya-ai-architect"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-sm p-2.5 text-white/40 hover:text-white transition-colors"
            >
              <Github size={16} />
            </a>
            <a
              href="https://linkedin.com/in/adityagaurav-2761b3318"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-sm p-2.5 text-white/40 hover:text-white transition-colors"
            >
              <Linkedin size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
