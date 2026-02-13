import { motion } from "framer-motion";
import { ReactNode, useRef } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  subtext?: string;
  delay?: number;
}

export function StatCard({ label, value, icon, subtext, delay = 0 }: StatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-2px)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (card) {
      card.style.transform = "perspective(600px) rotateY(0deg) rotateX(0deg) translateY(0)";
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className="glow-card rounded-xl p-4 md:p-5 cursor-default select-none"
      style={{ transition: "transform 0.2s ease-out, box-shadow 0.4s ease, border-color 0.4s ease" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-display">
          {label}
        </span>
        <span className="text-primary/70">{icon}</span>
      </div>
      <div className="text-2xl md:text-3xl font-display font-bold text-foreground tracking-wide">
        {value}
      </div>
      {subtext && (
        <p className="text-xs text-muted-foreground mt-1.5">{subtext}</p>
      )}
    </motion.div>
  );
}
