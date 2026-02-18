import { motion } from "framer-motion";

interface SvgBackgroundProps {
  moonlight?: boolean;
  energy?: number;
}

export function SvgBackground({ moonlight = false, energy = 70 }: SvgBackgroundProps) {
  const pink = moonlight ? "hsl(270, 60%, 72%)" : "hsl(330, 100%, 68%)";
  const pinkDim = moonlight ? "hsl(270, 50%, 60%)" : "hsl(330, 100%, 60%)";
  const lavender = "hsl(270, 50%, 65%)";
  const energyOpacity = (energy / 100) * 0.3 + 0.05;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* === SVG LAYER === */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Radial gradient — deep plum nebula center */}
          <radialGradient id="nebulaCore" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor={moonlight ? "hsl(265, 40%, 14%)" : "hsl(280, 45%, 12%)"} stopOpacity="0.9" />
            <stop offset="60%" stopColor="hsl(240, 25%, 7%)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="hsl(240, 15%, 4%)" stopOpacity="0" />
          </radialGradient>

          {/* Bottom-left pink nebula bloom */}
          <radialGradient id="bloomLeft" cx="15%" cy="85%" r="45%">
            <stop offset="0%" stopColor={moonlight ? "hsl(270, 50%, 18%)" : "hsl(330, 60%, 14%)"} stopOpacity="0.7" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Top-right cool mist */}
          <radialGradient id="mistRight" cx="88%" cy="12%" r="40%">
            <stop offset="0%" stopColor="hsl(260, 50%, 12%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Texture noise filter */}
          <filter id="noiseTexture" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65 0.65"
              numOctaves="3"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
            <feBlend in="SourceGraphic" in2="grayNoise" mode="overlay" result="blended" />
            <feComposite in="blended" in2="SourceGraphic" operator="in" />
          </filter>

          {/* Glow filter for SVG lines */}
          <filter id="lineGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Soft glow filter */}
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Base fill - deepest midnight */}
        <rect width="1440" height="900" fill="hsl(240, 15%, 4%)" />

        {/* Nebula gradients stacked */}
        <rect width="1440" height="900" fill="url(#nebulaCore)" />
        <rect width="1440" height="900" fill="url(#bloomLeft)" />
        <rect width="1440" height="900" fill="url(#mistRight)" />

        {/* === TEXTURE OVERLAY — faint noise grain === */}
        <rect
          width="1440"
          height="900"
          fill="hsl(270, 20%, 50%)"
          opacity="0.025"
          filter="url(#noiseTexture)"
        />

        {/* === GEOMETRIC GRID — faint hexagonal undertone === */}
        {/* Horizontal scan lines — very subtle */}
        {Array.from({ length: 18 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={i * 52}
            x2="1440"
            y2={i * 52}
            stroke={moonlight ? "hsl(270, 30%, 50%)" : "hsl(300, 20%, 50%)"}
            strokeWidth="0.3"
            opacity="0.04"
          />
        ))}

        {/* === LARGE CONCENTRIC ARCS — celestial rings in background === */}
        {/* Centered slightly left of center to avoid competing with reactor */}
        <g opacity={energyOpacity} filter="url(#softGlow)">
          {[380, 460, 540, 620].map((r, i) => (
            <circle
              key={`arc-${i}`}
              cx="720"
              cy="450"
              r={r}
              fill="none"
              stroke={i % 2 === 0 ? pink : lavender}
              strokeWidth="0.6"
              strokeDasharray={i % 2 === 0 ? "none" : "4 24"}
              opacity={0.18 - i * 0.03}
            />
          ))}
        </g>

        {/* === DIAGONAL SLASH LINES — top left corner accent === */}
        <g opacity="0.06" stroke={pinkDim} strokeWidth="0.5" filter="url(#lineGlow)">
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={`slash-${i}`}
              x1={-60 + i * 28}
              y1="0"
              x2={120 + i * 28}
              y2="260"
              strokeDasharray="3 14"
            />
          ))}
        </g>

        {/* === BOTTOM RIGHT ACCENT LINES === */}
        <g opacity="0.06" stroke={lavender} strokeWidth="0.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={`slash-br-${i}`}
              x1={1300 + i * 22}
              y1="640"
              x2={1500 + i * 22}
              y2="900"
              strokeDasharray="2 10"
            />
          ))}
        </g>

        {/* === CORNER RUNE MARKS — top left === */}
        <g
          transform="translate(60, 60)"
          stroke={pink}
          strokeWidth="0.8"
          fill="none"
          opacity="0.18"
          filter="url(#lineGlow)"
        >
          <line x1="0" y1="0" x2="28" y2="0" />
          <line x1="0" y1="0" x2="0" y2="28" />
          <line x1="6" y1="6" x2="16" y2="6" />
          <line x1="6" y1="6" x2="6" y2="16" />
          <circle cx="22" cy="22" r="5" opacity="0.5" />
        </g>

        {/* === CORNER RUNE MARKS — top right === */}
        <g
          transform="translate(1380, 60) scale(-1, 1)"
          stroke={moonlight ? lavender : pink}
          strokeWidth="0.8"
          fill="none"
          opacity="0.18"
          filter="url(#lineGlow)"
        >
          <line x1="0" y1="0" x2="28" y2="0" />
          <line x1="0" y1="0" x2="0" y2="28" />
          <line x1="6" y1="6" x2="16" y2="6" />
          <line x1="6" y1="6" x2="6" y2="16" />
          <circle cx="22" cy="22" r="5" opacity="0.5" />
        </g>

        {/* === CORNER RUNE MARKS — bottom left === */}
        <g
          transform="translate(60, 840) scale(1, -1)"
          stroke={lavender}
          strokeWidth="0.8"
          fill="none"
          opacity="0.12"
        >
          <line x1="0" y1="0" x2="28" y2="0" />
          <line x1="0" y1="0" x2="0" y2="28" />
          <line x1="6" y1="6" x2="16" y2="6" />
          <line x1="6" y1="6" x2="6" y2="16" />
        </g>

        {/* === CORNER RUNE MARKS — bottom right === */}
        <g
          transform="translate(1380, 840) scale(-1, -1)"
          stroke={lavender}
          strokeWidth="0.8"
          fill="none"
          opacity="0.12"
        >
          <line x1="0" y1="0" x2="28" y2="0" />
          <line x1="0" y1="0" x2="0" y2="28" />
          <line x1="6" y1="6" x2="16" y2="6" />
          <line x1="6" y1="6" x2="6" y2="16" />
        </g>

        {/* === FLOATING DIAMOND SPARKS === */}
        {[
          { x: 180, y: 200, s: 5 },
          { x: 1260, y: 160, s: 4 },
          { x: 90, y: 680, s: 3.5 },
          { x: 1340, y: 720, s: 4.5 },
          { x: 340, y: 820, s: 3 },
          { x: 1100, y: 80, s: 3 },
        ].map((d, i) => (
          <polygon
            key={`diamond-${i}`}
            points={`${d.x},${d.y - d.s} ${d.x + d.s},${d.y} ${d.x},${d.y + d.s} ${d.x - d.s},${d.y}`}
            fill={i % 2 === 0 ? pink : lavender}
            opacity="0.2"
            filter="url(#lineGlow)"
          />
        ))}

        {/* === HORIZONTAL SEPARATOR LINES — subtle thirds === */}
        <line
          x1="40" y1="1" x2="300" y2="1"
          stroke={pink} strokeWidth="0.5" opacity="0.12"
        />
        <line
          x1="1140" y1="898" x2="1400" y2="898"
          stroke={lavender} strokeWidth="0.5" opacity="0.12"
        />

        {/* === CENTRAL GLOW BLOOM (energy-reactive radius) — subtle === */}
        <radialGradient id="energyBloom" cx="50%" cy="50%" r="30%">
          <stop offset="0%" stopColor={moonlight ? "hsl(270, 60%, 65%)" : "hsl(330, 100%, 68%)"} stopOpacity={energyOpacity * 0.5} />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <rect width="1440" height="900" fill="url(#energyBloom)" />
      </svg>

      {/* === ANIMATED SVG LAYER — very slow drifting arcs === */}
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.35 }}
      >
        <defs>
          <filter id="arcGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Slowly rotating outer arc — top half */}
        <motion.path
          d="M 200 450 A 520 520 0 0 1 1240 450"
          fill="none"
          stroke={moonlight ? lavender : pink}
          strokeWidth="0.8"
          strokeDasharray="8 32"
          opacity="0.15"
          filter="url(#arcGlow)"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "720px 450px" }}
        />

        {/* Counter-rotating inner arc */}
        <motion.path
          d="M 360 450 A 360 360 0 0 0 1080 450"
          fill="none"
          stroke={lavender}
          strokeWidth="0.6"
          strokeDasharray="3 18"
          opacity="0.12"
          animate={{ rotate: -360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "720px 450px" }}
        />

        {/* Slow breathing dot — far left ambient */}
        <motion.circle
          cx="140"
          cy="450"
          r="80"
          fill="none"
          stroke={moonlight ? "hsl(270, 60%, 65%)" : "hsl(330, 100%, 60%)"}
          strokeWidth="0.5"
          opacity="0.08"
          animate={{ scale: [1, 1.08, 1], opacity: [0.08, 0.14, 0.08] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "140px 450px" }}
        />

        {/* Slow breathing dot — far right ambient */}
        <motion.circle
          cx="1300"
          cy="450"
          r="80"
          fill="none"
          stroke={moonlight ? "hsl(270, 60%, 65%)" : "hsl(330, 100%, 60%)"}
          strokeWidth="0.5"
          opacity="0.08"
          animate={{ scale: [1, 1.08, 1], opacity: [0.08, 0.14, 0.08] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          style={{ transformOrigin: "1300px 450px" }}
        />
      </motion.svg>
    </div>
  );
}
