"use client";

export default function Philosophy() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="glass-sm inline-block px-4 py-1.5 mb-8">
          <span className="text-xs text-white/50 tracking-wide uppercase">
            The Difference
          </span>
        </div>

        <div className="glass p-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-white/30 mb-6 text-sm font-medium uppercase tracking-wide">
                Workflows
              </h3>
              <ul className="space-y-3 text-sm text-white/50">
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  Trigger fires
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  Predefined path executes
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  If X then Y, else Z
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  You anticipate every edge case
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  One unexpected input = broken
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white/80 mb-6 text-sm font-medium uppercase tracking-wide">
                Agents
              </h3>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-white/60" />
                  Context provided
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-white/60" />
                  Model reasons about task
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-white/60" />
                  Decides what to do next
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-white/60" />
                  Adapts to edge cases
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-white/60" />
                  Handles ambiguity
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-white/30 text-sm">
              Workflows = you think for the machine
            </p>
            <p className="text-white/60 text-sm mt-2">
              Agents = the machine thinks with you
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
