"use client";

import Link from "next/link";
import { Search, Mic, ArrowUpRight } from "lucide-react";

const demos = [
  {
    title: "Sentinel",
    description: "Multi-agent competitive intelligence. 8 hours of research in 12 minutes.",
    icon: Search,
    href: "/sentinel",
    tags: ["5-Agent Chain", "70% Token Savings"],
  },
  {
    title: "Voice Agent",
    description: "Real-time conversational AI with streaming speech recognition.",
    icon: Mic,
    href: "/voice-agent",
    tags: ["<500ms Latency", "Context Aware"],
  },
];

export default function DemoCards() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="badge" style={{ marginBottom: 32 }}>
          Working Demos
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {demos.map((demo) => (
            <Link key={demo.title} href={demo.href} className="card" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
                <div className="card-icon">
                  <demo.icon size={18} className="text-muted" />
                </div>
                <div>
                  <h3 className="card-title">{demo.title}</h3>
                  <p className="card-description" style={{ marginBottom: 12 }}>{demo.description}</p>
                  <div className="card-tags">
                    {demo.tags.map((tag) => (
                      <span key={tag} className="card-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <ArrowUpRight size={18} className="text-muted-foreground" style={{ marginTop: 4, flexShrink: 0 }} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
