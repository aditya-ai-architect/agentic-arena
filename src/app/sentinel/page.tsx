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
  Sparkles,
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

    // Reset agents
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
    <main className="min-h-screen pb-20">
      <Navbar />

      {/* Ambient background */}
      <div className="ambient-bg">
        <div className="ambient-orb orb-1" />
        <div className="ambient-orb orb-2" />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-28 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="glass-sm inline-flex items-center gap-2 px-4 py-2 mb-6">
            <Sparkles className="text-white/60" size={16} />
            <span className="text-xs text-white/50 tracking-wide uppercase">
              Multi-Agent Intelligence
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-medium text-white mb-4 tracking-tight">
            Sentinel Lite
          </h1>
          <p className="text-lg text-white/40 max-w-2xl mx-auto">
            Competitive intelligence in 12 minutes instead of 8 hours.
            Enter a company and focus area to begin.
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-strong p-8 mb-8"
        >
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm text-white/40 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., OpenAI, Stripe, Anthropic"
                className="w-full"
                disabled={isRunning}
              />
            </div>
            <div>
              <label className="block text-sm text-white/40 mb-2">
                Research Focus
              </label>
              <input
                type="text"
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                placeholder="e.g., enterprise strategy, pricing, product roadmap"
                className="w-full"
                disabled={isRunning}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-white/40">
              {isRunning && (
                <>
                  <Clock size={16} className="text-white/60" />
                  <span>Elapsed: {formatTime(elapsedTime)}</span>
                </>
              )}
            </div>
            <button
              onClick={runSentinel}
              disabled={isRunning || !company.trim() || !focus.trim()}
              className="btn-primary flex items-center gap-2 px-6 py-3 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
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
          className="grid grid-cols-5 gap-4 mb-8"
        >
          {agents.map((agent) => (
            <div
              key={agent.name}
              className={`glass p-4 text-center transition-all duration-300 ${
                agent.status === "running" ? "border-white/20" : ""
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center transition-colors ${
                  agent.status === "complete"
                    ? "bg-green-500/20"
                    : agent.status === "running"
                    ? "bg-white/10"
                    : agent.status === "error"
                    ? "bg-red-500/20"
                    : "bg-white/5"
                }`}
              >
                {agent.status === "running" ? (
                  <Loader2 className="text-white/80 animate-spin" size={20} />
                ) : agent.status === "complete" ? (
                  <CheckCircle2 className="text-green-400" size={20} />
                ) : agent.status === "error" ? (
                  <AlertCircle className="text-red-400" size={20} />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                )}
              </div>
              <div className="text-xs text-white/40">{agent.name}</div>
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
              className="glass p-4 mb-8 border border-red-500/20 bg-red-500/5"
            >
              <div className="flex items-center gap-3 text-red-400">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Report */}
        <AnimatePresence>
          {report && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-strong p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <FileText className="text-white/60" size={24} />
                  <h2 className="text-xl font-medium text-white">
                    Intelligence Report
                  </h2>
                </div>
                <div className="text-sm text-white/40">
                  Generated in {formatTime(elapsedTime)}
                </div>
              </div>
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-white/70 font-mono glass p-6 overflow-auto">
                  {report}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!report && !isRunning && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass p-12 text-center"
          >
            <Search className="text-white/20 mx-auto mb-4" size={48} />
            <h3 className="text-xl text-white/40 mb-2">Ready to Research</h3>
            <p className="text-white/30">
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
