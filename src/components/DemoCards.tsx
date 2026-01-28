"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Mic, ArrowRight, Sparkles } from "lucide-react";
import GlassCard from "./GlassCard";

const demos = [
  {
    id: "sentinel",
    title: "Sentinel Lite",
    description: "Multi-agent competitive intelligence. Research any company in 12 minutes instead of 8 hours.",
    icon: Search,
    gradient: "from-cyan-500 to-blue-500",
    features: ["5-Agent Chain", "70% Token Savings", "Source Validation"],
    href: "/sentinel",
    badge: "Featured",
  },
  {
    id: "voice",
    title: "Voice Agent",
    description: "Real-time conversational AI with sub-500ms latency. Actually talk to an AI agent.",
    icon: Mic,
    gradient: "from-purple-500 to-pink-500",
    features: ["<500ms Latency", "Streaming STT/TTS", "Context Aware"],
    href: "/voice-agent",
    badge: "Live",
  },
];

export default function DemoCards() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Working Demos
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Not tutorials. Not documentation. Actual working systems you can try right now.
            Bring your own API key.
          </p>
        </motion.div>

        {/* Demo Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {demos.map((demo, index) => (
            <motion.div
              key={demo.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={demo.href}>
                <div className="glass-strong p-8 h-full group cursor-pointer transition-all duration-300 hover:glow-accent">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${demo.gradient} bg-opacity-10`}>
                      <demo.icon className="text-white" size={28} />
                    </div>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                      {demo.badge}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-semibold text-white mb-3">
                    {demo.title}
                  </h3>
                  <p className="text-zinc-400 mb-6">
                    {demo.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {demo.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1 text-xs rounded-lg bg-white/5 text-zinc-300 border border-white/5"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-cyan-400 group-hover:text-cyan-300 transition-colors">
                    <span className="font-medium">Try Demo</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
