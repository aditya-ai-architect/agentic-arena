"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import ApiKeyModal from "@/components/ApiKeyModal";
import {
  Search,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
} from "lucide-react";

interface AgentStatus {
  name: string;
  status: "pending" | "running" | "complete" | "error";
  output?: string;
}

export default function SentinelPage() {
  const [company, setCompany] = useState("");
  const [focus, setFocus] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showApiModal, setShowApiModal] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const [agents, setAgents] = useState<AgentStatus[]>([
    { name: "Orchestrator", status: "pending" },
    { name: "Searcher", status: "pending" },
    { name: "Scraper", status: "pending" },
    { name: "Analyst", status: "pending" },
    { name: "Writer", status: "pending" },
  ]);

  useEffect(() => {
    setHasApiKey(!!localStorage.getItem("gemini_api_key"));
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const runSentinel = async () => {
    const apiKey = localStorage.getItem("gemini_api_key");
    if (!apiKey) {
      setShowApiModal(true);
      return;
    }

    if (!company.trim() || !focus.trim()) {
      setError("Please enter both company name and research focus");
      return;
    }

    setIsRunning(true);
    setError(null);
    setReport(null);
    setStartTime(Date.now());
    setElapsedTime(0);

    setAgents((prev) => prev.map((a) => ({ ...a, status: "pending" })));

    try {
      const response = await fetch("/api/sentinel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, focus, apiKey }),
      });

      if (!response.ok) {
        throw new Error("Failed to run Sentinel");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter((l) => l.startsWith("data:"));

          for (const line of lines) {
            try {
              const data = JSON.parse(line.slice(5));

              if (data.agent) {
                setAgents((prev) =>
                  prev.map((a) =>
                    a.name === data.agent
                      ? { ...a, status: data.status, output: data.output }
                      : a
                  )
                );
              }

              if (data.report) {
                setReport(data.report);
              }

              if (data.error) {
                setError(data.error);
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsRunning(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <main className="page">
      <Navbar />

      <div className="container" style={{ paddingTop: 80, paddingBottom: 80 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <div className="badge" style={{ marginBottom: 24 }}>
            Multi-Agent Intelligence
          </div>
          <h1 style={{ fontSize: 48, marginBottom: 16 }}>Sentinel Lite</h1>
          <p className="text-muted" style={{ fontSize: 18, maxWidth: 600, margin: "0 auto" }}>
            Competitive intelligence in 12 minutes instead of 8 hours.
            Enter a company and focus area to begin.
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-strong"
          style={{ padding: 32, marginBottom: 24 }}
        >
          <div className="grid-2" style={{ marginBottom: 24 }}>
            <div>
              <label className="text-muted-foreground" style={{ display: "block", fontSize: 13, marginBottom: 8 }}>
                Company Name
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., OpenAI, Stripe, Anthropic"
                disabled={isRunning}
              />
            </div>
            <div>
              <label className="text-muted-foreground" style={{ display: "block", fontSize: 13, marginBottom: 8 }}>
                Research Focus
              </label>
              <input
                type="text"
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                placeholder="e.g., enterprise strategy, pricing, product roadmap"
                disabled={isRunning}
              />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div className="text-muted-foreground" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
              {isRunning && (
                <>
                  <Clock size={16} />
                  <span>Elapsed: {formatTime(elapsedTime)}</span>
                </>
              )}
            </div>
            <button
              onClick={runSentinel}
              disabled={isRunning || !company.trim() || !focus.trim()}
              className="btn btn-primary btn-lg"
            >
              {isRunning ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Run Sentinel
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Agent Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid-5"
          style={{ marginBottom: 24 }}
        >
          {agents.map((agent) => (
            <div
              key={agent.name}
              className="agent-card"
            >
              <div className={`agent-icon ${agent.status}`}>
                {agent.status === "running" ? (
                  <Loader2 className="text-muted animate-spin" size={18} />
                ) : agent.status === "complete" ? (
                  <CheckCircle2 style={{ color: "#22c55e" }} size={18} />
                ) : agent.status === "error" ? (
                  <AlertCircle style={{ color: "#ef4444" }} size={18} />
                ) : (
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--border)" }} />
                )}
              </div>
              <div className="agent-name">{agent.name}</div>
            </div>
          ))}
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="alert alert-error"
              style={{ marginBottom: 24 }}
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Report */}
        <AnimatePresence>
          {report && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-strong"
              style={{ padding: 32 }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <FileText className="text-muted" size={24} />
                  <h2 style={{ fontSize: 20, fontWeight: 600 }}>Intelligence Report</h2>
                </div>
                <span className="text-muted-foreground" style={{ fontSize: 14 }}>
                  Generated in {formatTime(elapsedTime)}
                </span>
              </div>
              <pre className="report">{report}</pre>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!report && !isRunning && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="empty-state glass-static"
          >
            <Search className="empty-state-icon" size={48} />
            <h3 className="empty-state-title">Ready to Research</h3>
            <p className="empty-state-description">
              Enter a company and focus area above to generate competitive intelligence.
            </p>
          </motion.div>
        )}
      </div>

      <ApiKeyModal
        isOpen={showApiModal}
        onClose={() => setShowApiModal(false)}
        onSave={() => {
          setHasApiKey(true);
          setShowApiModal(false);
        }}
      />
    </main>
  );
}
