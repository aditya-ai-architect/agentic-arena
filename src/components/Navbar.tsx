"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Key } from "lucide-react";
import ApiKeyModal from "./ApiKeyModal";

export default function Navbar() {
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    setHasApiKey(!!localStorage.getItem("gemini_api_key"));
  }, []);

  return (
    <>
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="glass max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm font-medium tracking-tight">
            Agentic Arena
          </Link>

          <div className="flex items-center gap-1">
            <Link
              href="/sentinel"
              className="px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              Sentinel
            </Link>
            <Link
              href="/voice-agent"
              className="px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              Voice
            </Link>
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all ${
                hasApiKey
                  ? "text-white/50 hover:text-white hover:bg-white/5"
                  : "glass-button text-white"
              }`}
            >
              <Key size={14} />
              {hasApiKey ? "Key Set" : "API Key"}
            </button>
          </div>
        </div>
      </nav>

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSave={() => setHasApiKey(true)}
      />
    </>
  );
}
