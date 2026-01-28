"use client";

import Link from "next/link";
import { Github, Linkedin, Mail, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-semibold text-white">
                Agentic Arena
              </span>
            </div>
            <p className="text-zinc-400 text-sm max-w-sm">
              Built by Aditya Gaurav. 18 years old. 3 production AI systems in 4 months.
              Not demos. Production.
            </p>
          </div>

          {/* Demos */}
          <div>
            <h4 className="text-white font-medium mb-4">Demos</h4>
            <div className="space-y-2">
              <Link href="/sentinel" className="block text-zinc-400 hover:text-white text-sm transition-colors">
                Sentinel Lite
              </Link>
              <Link href="/voice-agent" className="block text-zinc-400 hover:text-white text-sm transition-colors">
                Voice Agent
              </Link>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-medium mb-4">Connect</h4>
            <div className="space-y-2">
              <a
                href="https://github.com/aditya-ai-architect"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm transition-colors"
              >
                <Github size={16} />
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/adityagaurav-2761b3318"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm transition-colors"
              >
                <Linkedin size={16} />
                LinkedIn
              </a>
              <a
                href="mailto:aiexpert@adityaai.dev"
                className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm transition-colors"
              >
                <Mail size={16} />
                Email
              </a>
              <a
                href="https://adityaai.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm transition-colors"
              >
                <Globe size={16} />
                Portfolio
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5">
          <p className="text-zinc-500 text-sm">
            © 2025 Aditya Gaurav. Built with Claude Code.
          </p>
          <p className="text-zinc-500 text-sm mt-2 md:mt-0">
            No flowcharts were harmed in the making of this site.
          </p>
        </div>
      </div>
    </footer>
  );
}
