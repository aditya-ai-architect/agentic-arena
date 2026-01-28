"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, Key, Github, Linkedin } from "lucide-react";
import ApiKeyModal from "./ApiKeyModal";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const checkApiKey = () => {
      setHasApiKey(!!localStorage.getItem("gemini_api_key"));
    };

    window.addEventListener("scroll", handleScroll);
    checkApiKey();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/sentinel", label: "Sentinel" },
    { href: "/voice-agent", label: "Voice Agent" },
    { href: "https://github.com/aditya-ai-architect/agentic-vs-workflows", label: "GitHub", external: true },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? "glass py-3" : "py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-semibold text-white hidden sm:block">
              Agentic Arena
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
              >
                {link.label}
                {link.external && <Github size={14} />}
              </Link>
            ))}
          </div>

          {/* API Key Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                hasApiKey
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 animate-pulse"
              }`}
            >
              <Key size={16} />
              <span className="hidden sm:inline">
                {hasApiKey ? "Key Set" : "Set API Key"}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-zinc-400 hover:text-white"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden glass mt-4 mx-4 p-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 text-zinc-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </motion.nav>

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSave={() => setHasApiKey(true)}
      />
    </>
  );
}
