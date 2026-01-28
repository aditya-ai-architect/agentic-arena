"use client";

import { motion } from "framer-motion";

export default function Philosophy() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-strong p-10"
        >
          {/* Header */}
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            The Philosophy
          </h2>

          {/* Comparison Table */}
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {/* Workflows */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-red-400 mb-4">
                Workflows (n8n, Make, Zapier)
              </h3>
              <div className="space-y-3 text-sm">
                {[
                  "Trigger fires",
                  "Predefined path executes",
                  "If X then Y, else Z",
                  "You anticipate every edge case",
                  "One unexpected input = broken",
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-zinc-400"
                  >
                    <span className="text-red-400">→</span>
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Agents */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">
                Agents (Claude + MCP)
              </h3>
              <div className="space-y-3 text-sm">
                {[
                  "Context provided",
                  "Model reasons about task",
                  "Decides what to do next",
                  "Adapts to edge cases",
                  "Handles ambiguity like human",
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-zinc-300"
                  >
                    <span className="text-cyan-400">→</span>
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Key Insight */}
          <div className="text-center space-y-4 pt-8 border-t border-white/5">
            <p className="text-lg text-zinc-300">
              <span className="text-white font-medium">Workflows</span> = you think for the machine
            </p>
            <p className="text-lg text-zinc-300">
              <span className="text-cyan-400 font-medium">Agents</span> = the machine thinks with you
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
