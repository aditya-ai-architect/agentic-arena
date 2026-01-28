"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="page-header" style={{ paddingTop: 160, paddingBottom: 80 }}>
      <div className="container">
        <div className="badge" style={{ marginBottom: 24 }}>
          Multi-Agent AI Demos
        </div>

        <h1 style={{ marginBottom: 24 }}>
          Build Agents,
          <br />
          <span className="text-muted-foreground">Not Workflows</span>
        </h1>

        <p style={{ marginBottom: 40 }}>
          Experience the difference between flowcharts and actual intelligence.
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 64 }}>
          <Link href="/sentinel" className="btn btn-primary btn-lg">
            Try Sentinel
            <ArrowRight size={16} />
          </Link>
          <Link href="/voice-agent" className="btn btn-secondary btn-lg">
            Voice Agent
          </Link>
        </div>

        <div className="stats">
          <div className="stat">
            <div className="stat-value">12min</div>
            <div className="stat-label">vs 8 hours</div>
          </div>
          <div className="stat">
            <div className="stat-value">&lt;500ms</div>
            <div className="stat-label">voice latency</div>
          </div>
          <div className="stat">
            <div className="stat-value">5</div>
            <div className="stat-label">agents</div>
          </div>
        </div>
      </div>
    </section>
  );
}
