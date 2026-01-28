"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = "",
  hover = true,
  glow = false,
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { scale: 1.02, y: -5 } : undefined}
      onClick={onClick}
      className={`
        glass p-6 cursor-pointer
        ${glow ? "glow-accent" : ""}
        ${hover ? "transition-all duration-300" : ""}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
