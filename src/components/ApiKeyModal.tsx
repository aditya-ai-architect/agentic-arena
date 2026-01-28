"use client";

import { useState, useEffect } from "react";
import { X, ExternalLink, Key } from "lucide-react";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
}

export default function ApiKeyModal({ isOpen, onClose, onSave }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("gemini_api_key");
    if (stored) setApiKey(stored);
  }, [isOpen]);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem("gemini_api_key", apiKey.trim());
      onSave(apiKey.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="glass-strong relative p-8 w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/30 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="glass-sm p-3">
            <Key size={20} className="text-white/60" />
          </div>
          <div>
            <h2 className="font-medium">API Key</h2>
            <p className="text-xs text-white/40">Required for demos</p>
          </div>
        </div>

        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Gemini API key..."
          className="mb-4"
        />

        <div className="glass-sm flex items-center gap-2 px-4 py-3 mb-6">
          <ExternalLink size={14} className="text-white/30" />
          <span className="text-xs text-white/40">
            Get a free key from{" "}
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white underline"
            >
              Google AI Studio
            </a>
          </span>
        </div>

        <button
          onClick={handleSave}
          disabled={!apiKey.trim()}
          className="btn-primary w-full py-3 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Save Key
        </button>
      </div>
    </div>
  );
}
