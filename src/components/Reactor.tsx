import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ReactorProps {
  energy: number;
  isRageMode: boolean;
  showWave: boolean;
}

export function Reactor({ energy, isRageMode, showWave }: ReactorProps) {
  const [pulseScale, setPulseScale] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseScale((s) => (s === 1 ? 1.02 : 1));
    }, 1250);
    return () => clearInterval(interval);
  }, []);

  const circumference = 2 * Math.PI * 90;
  const energyOffset = circumference - (energy / 100) * circumference;

  const coreColor = isRageMode
    ? "radial-gradient(circle, hsl(350, 85%, 55%), hsl(330, 100%, 35%))"
    : "radial-gradient(circle, hsl(330, 100%, 78%), hsl(330, 100%, 55%), hsl(270, 60%, 40%))";

  return (
    <div className="relative flex items-center justify-center">
      {/* Energy wave on blood pack consume */}
      {showWave && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border-2 border-primary/60 animate-energy-wave" />
        </div>
      )}

      {/* Outer aura glow */}
      <motion.div
        className="absolute w-72 h-72 md:w-80 md:h-80 rounded-full"
        style={{
          background: isRageMode
            ? "radial-gradient(circle, hsl(350 80% 40% / 0.2), transparent 70%)"
            : "radial-gradient(circle, hsl(330 100% 72% / 0.15), transparent 70%)",
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <svg
        viewBox="0 0 220 220"
        className={`w-56 h-56 md:w-64 md:h-64 reactor-glow ${isRageMode ? "animate-flicker" : ""}`}
      >
        {/* Outer ring - aura shield */}
        <circle
          cx="110"
          cy="110"
          r="105"
          fill="none"
          stroke={isRageMode ? "hsl(350, 60%, 40%)" : "hsl(270, 40%, 30%)"}
          strokeWidth="2"
          opacity="0.5"
          className="animate-ring-rotate"
          style={{ transformOrigin: "110px 110px" }}
        />
        <circle
          cx="110"
          cy="110"
          r="102"
          fill="none"
          stroke={isRageMode ? "hsl(350, 80%, 50%)" : "hsl(330, 80%, 60%)"}
          strokeWidth="0.5"
          strokeDasharray="4 8"
          className="animate-ring-rotate-reverse"
          style={{ transformOrigin: "110px 110px" }}
        />

        {/* Middle ring - energy progress */}
        <circle
          cx="110"
          cy="110"
          r="90"
          fill="none"
          stroke="hsl(270, 20%, 15%)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <motion.circle
          cx="110"
          cy="110"
          r="90"
          fill="none"
          stroke={isRageMode ? "hsl(350, 90%, 55%)" : "url(#energyGradient)"}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: energyOffset }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          transform="rotate(-90 110 110)"
          style={{ filter: "drop-shadow(0 0 6px hsl(330, 100%, 72%))" }}
        />

        {/* Energy gradient */}
        <defs>
          <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(330, 100%, 72%)" />
            <stop offset="50%" stopColor="hsl(330, 100%, 85%)" />
            <stop offset="100%" stopColor="hsl(270, 60%, 82%)" />
          </linearGradient>
        </defs>

        {/* Tick marks */}
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i * 10 * Math.PI) / 180;
          const x1 = 110 + 80 * Math.cos(angle);
          const y1 = 110 + 80 * Math.sin(angle);
          const x2 = 110 + 83 * Math.cos(angle);
          const y2 = 110 + 83 * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="hsl(270, 20%, 30%)"
              strokeWidth="1"
              opacity={i % 9 === 0 ? 0.8 : 0.3}
            />
          );
        })}
      </svg>

      {/* Inner core - plasma */}
      <motion.div
        className="absolute w-28 h-28 md:w-32 md:h-32 rounded-full animate-plasma"
        style={{
          background: coreColor,
          boxShadow: isRageMode
            ? "0 0 40px 10px hsl(350, 80%, 40%), inset 0 0 30px hsl(350, 90%, 30%)"
            : "0 0 40px 10px hsl(330, 100%, 60% / 0.4), inset 0 0 30px hsl(330, 80%, 50% / 0.3)",
        }}
        animate={{ scale: [1, pulseScale, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Energy text */}
      <div className="absolute flex flex-col items-center">
        <motion.span
          className="text-3xl md:text-4xl font-display font-bold tracking-wider"
          style={{
            color: isRageMode ? "hsl(350, 90%, 65%)" : "hsl(330, 100%, 85%)",
            textShadow: isRageMode
              ? "0 0 20px hsl(350, 80%, 50%)"
              : "0 0 20px hsl(330, 100%, 72% / 0.5)",
          }}
          key={Math.round(energy)}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {Math.round(energy)}%
        </motion.span>
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-1">
          Oni Energy
        </span>
      </div>
    </div>
  );
}
