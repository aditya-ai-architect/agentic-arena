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
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 200,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24
    }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(8px)"
        }}
        onClick={onClose}
      />

      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: 420,
        padding: 32,
        background: "#0a0a0a",
        border: "1px solid var(--border)",
        borderRadius: 16
      }}>
        <button
          onClick={onClose}
          className="icon-btn"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            border: "none"
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div className="card-icon">
            <Key size={18} className="text-muted" />
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>API Key</h2>
            <p className="text-muted-foreground" style={{ fontSize: 13 }}>Required for demos</p>
          </div>
        </div>

        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Gemini API key..."
          style={{ marginBottom: 16 }}
        />

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: 12,
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          marginBottom: 24
        }}>
          <ExternalLink size={14} className="text-muted-foreground" />
          <span className="text-muted-foreground" style={{ fontSize: 13 }}>
            Get a free key from{" "}
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted"
              style={{ textDecoration: "underline" }}
            >
              Google AI Studio
            </a>
          </span>
        </div>

        <button
          onClick={handleSave}
          disabled={!apiKey.trim()}
          className="btn btn-primary"
          style={{ width: "100%", height: 44 }}
        >
          Save Key
        </button>
      </div>
    </div>
  );
}
