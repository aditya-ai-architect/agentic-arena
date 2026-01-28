"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, Clock, Brain } from "lucide-react";
import NeuButton from "./NeuButton";

export default function Hero() {
  const stats = [
    { icon: Clock, label: "8hr → 12min", desc: "Research Time" },
    { icon: Zap, label: "<500ms", desc: "Voice Latency" },
    { icon: Brain, label: "5 Agents", desc: "Orchestrated" },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center pt-20 pb-10 px-6">
      <div className="max-w-6xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm text-zinc-400">Live Demos Available</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
        >
          <span className="text-white">Stop Building Workflows.</span>
          <br />
          <span className="gradient-text">Build Agents.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12"
        >
          Experience the difference between flowcharts pretending to be intelligent
          and actual agentic systems that reason, decide, and act.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/sentinel">
            <NeuButton variant="primary" size="lg">
              Try Sentinel Demo
              <ArrowRight size={20} />
            </NeuButton>
          </Link>
          <Link href="/voice-agent">
            <NeuButton variant="secondary" size="lg">
              Voice Agent Demo
            </NeuButton>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-8"
        >
          {stats.map((stat, index) => (
            <div key={index} className="glass px-8 py-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-cyan-500/10">
                <stat.icon className="text-cyan-400" size={24} />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-white">{stat.label}</div>
                <div className="text-sm text-zinc-400">{stat.desc}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Visual Element */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
          <div className="relative glass-strong p-8 overflow-hidden">
            <div className="grid grid-cols-5 gap-4 opacity-50">
              {["Orchestrator", "Searcher", "Scraper", "Analyst", "Writer"].map((agent, i) => (
                <motion.div
                  key={agent}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  className="glass p-4 text-center"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 mx-auto mb-2" />
                  <div className="text-xs text-zinc-400">{agent}</div>
                </motion.div>
              ))}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
