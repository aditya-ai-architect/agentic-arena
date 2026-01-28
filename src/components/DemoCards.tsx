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
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="glass-sm inline-block px-4 py-1.5 mb-8">
          <span className="text-xs text-white/50 tracking-wide uppercase">
            Working Demos
          </span>
        </div>

        <div className="space-y-4">
          {demos.map((demo) => (
            <Link key={demo.title} href={demo.href}>
              <div className="glass group p-6 hover:bg-white/[0.04] transition-all cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-5">
                    <div className="glass-sm p-3">
                      <demo.icon size={20} className="text-white/60" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-1">{demo.title}</h3>
                      <p className="text-sm text-white/40 mb-3">{demo.description}</p>
                      <div className="flex gap-2">
                        {demo.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 rounded-md bg-white/5 text-white/40"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight
                    size={20}
                    className="text-white/10 group-hover:text-white/40 transition-colors mt-1"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
