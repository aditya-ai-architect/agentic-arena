"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-20">
      {/* Ambient background */}
      <div className="ambient-bg">
        <div className="ambient-orb orb-1" />
        <div className="ambient-orb orb-2" />
      </div>

      <div className="max-w-2xl text-center relative z-10">
        <div className="glass-sm inline-block px-4 py-1.5 mb-8">
          <span className="text-xs text-white/50 tracking-wide uppercase">
            Multi-Agent AI Demos
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-medium tracking-tight mb-6 leading-[1.1]">
          Build Agents,
          <br />
          <span className="text-white/40">Not Workflows</span>
        </h1>

        <p className="text-white/40 text-lg mb-12 max-w-md mx-auto leading-relaxed">
          Experience the difference between flowcharts and actual intelligence.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/sentinel"
            className="btn-primary flex items-center gap-2 px-6 py-3 text-sm"
          >
            Try Sentinel
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/voice-agent"
            className="glass-button flex items-center gap-2 px-6 py-3 text-sm text-white/80"
          >
            Voice Agent
          </Link>
        </div>

        <div className="mt-24 glass inline-flex items-center gap-12 px-10 py-6">
          <div className="text-center">
            <div className="text-2xl font-medium">12min</div>
            <div className="text-xs text-white/30 mt-1">vs 8 hours</div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-medium">&lt;500ms</div>
            <div className="text-xs text-white/30 mt-1">voice latency</div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-medium">5</div>
            <div className="text-xs text-white/30 mt-1">agents</div>
          </div>
        </div>
      </div>
    </section>
  );
}
