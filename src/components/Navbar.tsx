"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Key } from "lucide-react";
import ApiKeyModal from "./ApiKeyModal";

export default function Navbar() {
  const pathname = usePathname();
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    setHasApiKey(!!localStorage.getItem("gemini_api_key"));
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="navbar-logo">
            Agentic Arena
          </Link>

          <div className="navbar-links">
            <Link
              href="/sentinel"
              className={`navbar-link ${pathname === "/sentinel" ? "active" : ""}`}
            >
              Sentinel
            </Link>
            <Link
              href="/voice-agent"
              className={`navbar-link ${pathname === "/voice-agent" ? "active" : ""}`}
            >
              Voice
            </Link>
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className="btn btn-secondary btn-sm"
              style={{ marginLeft: 8 }}
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
