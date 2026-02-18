import { motion } from "framer-motion";
import { ReactNode, useRef } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  subtext?: string;
  delay?: number;
  pulse?: boolean;
}

export function StatCard({ label, value, icon, subtext, delay = 0, pulse = false }: StatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(700px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-2px)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (card) {
      card.style.transform = "perspective(700px) rotateY(0deg) rotateX(0deg) translateY(0)";
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`glow-card rounded-xl p-4 md:p-5 cursor-default select-none relative overflow-hidden ${
        pulse ? "animate-pulse-border" : ""
      }`}
      style={{ transition: "transform 0.2s ease-out, box-shadow 0.4s ease, border-color 0.4s ease" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {/* Hover shimmer sheen */}
      <div
        className="absolute inset-0 opacity-0 hover:opacity-100 pointer-events-none rounded-xl transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(135deg, hsl(330, 100%, 72% / 0.04) 0%, transparent 50%, hsl(270, 60%, 82% / 0.04) 100%)",
        }}
      />

      <div className="flex items-start justify-between mb-3">
        <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-display">
          {label}
        </span>
        <span style={{ color: "hsl(var(--demon-pink) / 0.7)" }}>{icon}</span>
      </div>
      <div
        className="text-2xl md:text-3xl font-display font-bold tracking-wide"
        style={{ color: "hsl(var(--foreground))" }}
      >
        {value}
      </div>
      {subtext && (
        <p className="text-xs text-muted-foreground mt-1.5">{subtext}</p>
      )}
    </motion.div>
  );
}
