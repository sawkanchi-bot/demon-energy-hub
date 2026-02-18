import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface ReactorProps {
  energy: number;
  isRageMode: boolean;
  showWave: boolean;
  moonlightMode?: boolean;
}

// Rune-like abstract arc markings for the rotating ring
const RUNE_ARCS = [
  { startAngle: 10, endAngle: 40, opacity: 0.7 },
  { startAngle: 55, endAngle: 62, opacity: 0.5 },
  { startAngle: 80, endAngle: 120, opacity: 0.6 },
  { startAngle: 135, endAngle: 140, opacity: 0.4 },
  { startAngle: 155, endAngle: 200, opacity: 0.7 },
  { startAngle: 215, endAngle: 222, opacity: 0.5 },
  { startAngle: 240, endAngle: 260, opacity: 0.6 },
  { startAngle: 285, endAngle: 340, opacity: 0.7 },
  { startAngle: 355, endAngle: 360, opacity: 0.4 },
];

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toRad(startDeg - 90));
  const y1 = cy + r * Math.sin(toRad(startDeg - 90));
  const x2 = cx + r * Math.cos(toRad(endDeg - 90));
  const y2 = cy + r * Math.sin(toRad(endDeg - 90));
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

export function Reactor({ energy, isRageMode, showWave, moonlightMode = false }: ReactorProps) {
  const [floatingXp, setFloatingXp] = useState(false);
  const prevShowWave = useRef(false);

  useEffect(() => {
    if (showWave && !prevShowWave.current) {
      setFloatingXp(true);
      const t = setTimeout(() => setFloatingXp(false), 1200);
      return () => clearTimeout(t);
    }
    prevShowWave.current = showWave;
  }, [showWave]);

  const circumference = 2 * Math.PI * 90;
  const energyOffset = circumference - (energy / 100) * circumference;

  // Colors driven by mode
  const pinkHsl = moonlightMode ? "270, 60%, 75%" : "330, 100%, 72%";
  const pinkSoftHsl = moonlightMode ? "270, 50%, 85%" : "330, 100%, 85%";
  const coreGrad = isRageMode
    ? "radial-gradient(circle at 40% 40%, hsl(350, 85%, 65%), hsl(350, 100%, 40%), hsl(330, 100%, 25%))"
    : moonlightMode
    ? "radial-gradient(circle at 40% 40%, hsl(275, 70%, 85%), hsl(270, 60%, 65%), hsl(260, 50%, 35%))"
    : "radial-gradient(circle at 40% 40%, hsl(330, 100%, 88%), hsl(330, 100%, 68%), hsl(270, 60%, 42%))";

  const outerGlowColor = isRageMode
    ? "hsl(350 80% 40% / 0.25)"
    : moonlightMode
    ? "hsl(270 60% 75% / 0.2)"
    : "hsl(330 100% 72% / 0.18)";

  const ringStroke = isRageMode
    ? "hsl(350, 90%, 55%)"
    : moonlightMode
    ? "hsl(270, 60%, 78%)"
    : "url(#energyGradient)";

  return (
    <div className="relative flex items-center justify-center">
      {/* XP Float on blood pack consume */}
      <AnimatePresence>
        {floatingXp && (
          <motion.div
            className="absolute z-30 pointer-events-none"
            style={{ top: "25%", left: "50%", transform: "translateX(-50%)" }}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -55, scale: 1.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
          >
            <span
              className="text-sm font-display font-bold tracking-widest"
              style={{
                color: `hsl(${pinkSoftHsl})`,
                textShadow: `0 0 16px hsl(${pinkHsl})`,
              }}
            >
              +25 XP
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Particle burst on blood pack */}
      <AnimatePresence>
        {showWave && (
          <>
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * 360;
              const rad = (angle * Math.PI) / 180;
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: 4,
                    height: 4,
                    background: `hsl(${pinkHsl})`,
                    boxShadow: `0 0 6px hsl(${pinkHsl})`,
                  }}
                  initial={{ x: 0, y: 0, opacity: 0.9, scale: 1 }}
                  animate={{
                    x: Math.cos(rad) * 80,
                    y: Math.sin(rad) * 80,
                    opacity: 0,
                    scale: 0.3,
                  }}
                  transition={{ duration: 0.75, ease: "easeOut" }}
                />
              );
            })}
          </>
        )}
      </AnimatePresence>

      {/* Energy shockwave */}
      <AnimatePresence>
        {showWave && (
          <motion.div
            className="absolute rounded-full pointer-events-none border"
            style={{
              borderColor: `hsl(${pinkHsl} / 0.7)`,
              boxShadow: `0 0 20px hsl(${pinkHsl} / 0.4)`,
            }}
            initial={{ width: 48, height: 48, opacity: 0.9 }}
            animate={{ width: 320, height: 320, opacity: 0 }}
            exit={{}}
            transition={{ duration: 0.85, ease: [0.2, 0, 0.2, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Outer aura - volumetric breathing glow */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 320,
          height: 320,
          background: `radial-gradient(circle, ${outerGlowColor}, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.1, 1.05, 1],
          opacity: [0.6, 1, 0.75, 0.6],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.7, 1] }}
      />

      {/* Secondary bloom spill (larger, softer) */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 420,
          height: 420,
          background: `radial-gradient(circle, ${
            isRageMode ? "hsl(350 80% 40% / 0.08)" : moonlightMode ? "hsl(270 60% 75% / 0.07)" : "hsl(330 100% 72% / 0.07)"
          }, transparent 65%)`,
        }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* SVG reactor rings */}
      <svg
        viewBox="0 0 220 220"
        className={`w-56 h-56 md:w-64 md:h-64 ${isRageMode ? "animate-flicker" : ""}`}
        style={{
          filter: isRageMode
            ? `drop-shadow(0 0 18px hsl(350, 90%, 55% / 0.7)) drop-shadow(0 0 50px hsl(350, 80%, 40% / 0.3))`
            : `drop-shadow(0 0 18px hsl(${pinkHsl} / 0.6)) drop-shadow(0 0 50px hsl(${pinkHsl} / 0.2))`,
        }}
      >
        <defs>
          <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(330, 100%, 72%)" />
            <stop offset="50%" stopColor="hsl(330, 100%, 85%)" />
            <stop offset="100%" stopColor="hsl(270, 60%, 82%)" />
          </linearGradient>
          <linearGradient id="energyGradientMoon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(270, 60%, 78%)" />
            <stop offset="100%" stopColor="hsl(260, 50%, 85%)" />
          </linearGradient>
          <filter id="glowFilter">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="trailGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* LAYER 1: Outermost decorative ring — very thin */}
        <circle
          cx="110" cy="110" r="107"
          fill="none"
          stroke={isRageMode ? "hsl(350, 50%, 35%)" : moonlightMode ? "hsl(270, 30%, 35%)" : "hsl(270, 30%, 28%)"}
          strokeWidth="0.75"
          opacity="0.4"
        />

        {/* LAYER 2: Rune ring — thin, slowly rotating, abstract glyphs */}
        <g
          style={{
            transformOrigin: "110px 110px",
            animation: "ring-rotate 60s linear infinite",
          }}
          opacity="0.13"
          stroke={moonlightMode ? "hsl(270, 60%, 80%)" : "hsl(330, 80%, 75%)"}
          fill="none"
          strokeWidth="1.5"
        >
          {RUNE_ARCS.map((arc, i) => (
            <path
              key={i}
              d={arcPath(110, 110, 104, arc.startAngle, arc.endAngle)}
              opacity={arc.opacity}
              strokeLinecap="round"
            />
          ))}
          {/* Small tick accents on rune ring */}
          {[30, 90, 150, 210, 270, 330].map((angle) => {
            const rad = ((angle - 90) * Math.PI) / 180;
            return (
              <line
                key={angle}
                x1={110 + 101 * Math.cos(rad)}
                y1={110 + 101 * Math.sin(rad)}
                x2={110 + 107 * Math.cos(rad)}
                y2={110 + 107 * Math.sin(rad)}
                opacity={0.6}
                strokeLinecap="round"
              />
            );
          })}
        </g>

        {/* LAYER 3: Aura shield ring — slow reverse rotate */}
        <circle
          cx="110" cy="110" r="100"
          fill="none"
          stroke={isRageMode ? "hsl(350, 60%, 40%)" : moonlightMode ? "hsl(270, 40%, 40%)" : "hsl(270, 40%, 30%)"}
          strokeWidth="1.5"
          strokeDasharray="3 12"
          opacity="0.35"
          style={{ transformOrigin: "110px 110px", animation: "ring-rotate-reverse 20s linear infinite" }}
        />

        {/* LAYER 4: Energy depletion ring — track */}
        <circle
          cx="110" cy="110" r="90"
          fill="none"
          stroke="hsl(270, 20%, 12%)"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Glow trail behind energy arc (slightly wider, offset) */}
        <motion.circle
          cx="110" cy="110" r="90"
          fill="none"
          stroke={isRageMode ? "hsl(350, 90%, 55%)" : moonlightMode ? "hsl(270, 60%, 78%)" : "hsl(330, 100%, 80%)"}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: energyOffset }}
          transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
          transform="rotate(-90 110 110)"
          opacity="0.12"
          filter="url(#trailGlow)"
        />

        {/* Main energy arc */}
        <motion.circle
          cx="110" cy="110" r="90"
          fill="none"
          stroke={ringStroke}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: energyOffset }}
          transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
          transform="rotate(-90 110 110)"
          style={{ filter: `drop-shadow(0 0 8px hsl(${pinkHsl} / 0.8))` }}
        />

        {/* Tick marks */}
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i * 10 * Math.PI) / 180;
          const r1 = i % 9 === 0 ? 79 : 81;
          const r2 = 84;
          return (
            <line
              key={i}
              x1={110 + r1 * Math.cos(angle)}
              y1={110 + r1 * Math.sin(angle)}
              x2={110 + r2 * Math.cos(angle)}
              y2={110 + r2 * Math.sin(angle)}
              stroke={moonlightMode ? "hsl(270, 20%, 40%)" : "hsl(270, 20%, 30%)"}
              strokeWidth={i % 9 === 0 ? 1.5 : 0.8}
              opacity={i % 9 === 0 ? 0.7 : 0.25}
            />
          );
        })}
      </svg>

      {/* Inner plasma core */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 120,
          height: 120,
          background: coreGrad,
          boxShadow: isRageMode
            ? "0 0 50px 12px hsl(350, 80%, 45% / 0.5), inset 0 0 35px hsl(350, 90%, 30% / 0.4)"
            : moonlightMode
            ? "0 0 40px 10px hsl(270, 60%, 70% / 0.35), inset 0 0 28px hsl(270, 50%, 50% / 0.25)"
            : "0 0 45px 12px hsl(330, 100%, 65% / 0.35), inset 0 0 32px hsl(330, 80%, 50% / 0.3)",
        }}
        animate={{
          scale: [1, 1.025, 1.01, 1.025, 1],
          opacity: isRageMode ? [1, 0.88, 1, 0.92, 1] : [1, 0.97, 1, 0.97, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] }}
      />

      {/* Plasma swirl overlay */}
      <motion.div
        className="absolute rounded-full pointer-events-none overflow-hidden"
        style={{ width: 118, height: 118 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: moonlightMode
              ? "conic-gradient(from 0deg, transparent 0%, hsl(270, 60%, 75% / 0.15) 25%, transparent 50%, hsl(260, 50%, 80% / 0.1) 75%, transparent 100%)"
              : "conic-gradient(from 0deg, transparent 0%, hsl(330, 100%, 72% / 0.15) 25%, transparent 50%, hsl(270, 60%, 82% / 0.12) 75%, transparent 100%)",
          }}
        />
      </motion.div>

      {/* Energy text */}
      <div className="absolute flex flex-col items-center z-10">
        <motion.span
          className="text-3xl md:text-4xl font-display font-bold tracking-wider"
          style={{
            color: isRageMode ? "hsl(350, 90%, 68%)" : `hsl(${pinkSoftHsl})`,
            textShadow: isRageMode
              ? "0 0 24px hsl(350, 80%, 55%)"
              : `0 0 20px hsl(${pinkHsl} / 0.6)`,
          }}
          key={Math.round(energy)}
          initial={{ scale: 1.12, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        >
          {Math.round(energy)}%
        </motion.span>
        <span
          className="text-[10px] uppercase tracking-[0.3em] mt-1"
          style={{ color: `hsl(${moonlightMode ? "270, 10%, 55%" : "270, 10%, 55%"})` }}
        >
          Oni Energy
        </span>
      </div>
    </div>
  );
}
