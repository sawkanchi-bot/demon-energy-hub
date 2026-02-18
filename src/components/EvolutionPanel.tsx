import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Ability {
  name: string;
  level: number;
  unlocked: boolean;
}

interface EvolutionPanelProps {
  level: number;
  xp: number;
  xpToNext: number;
  abilities: Ability[];
}

export function EvolutionPanel({ level, xp, xpToNext, abilities }: EvolutionPanelProps) {
  const progress = (xp / xpToNext) * 100;
  const prevLevel = useRef(level);
  const [levelUpFlash, setLevelUpFlash] = useState(false);

  useEffect(() => {
    if (level > prevLevel.current) {
      setLevelUpFlash(true);
      const t = setTimeout(() => setLevelUpFlash(false), 900);
      prevLevel.current = level;
      return () => clearTimeout(t);
    }
    prevLevel.current = level;
  }, [level]);

  return (
    <div className="glow-card rounded-xl p-5 relative overflow-hidden">
      {/* Level-up holographic flash */}
      <AnimatePresence>
        {levelUpFlash && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-xl z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.55, 0.3, 0.55, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
            style={{
              background:
                "radial-gradient(circle at 50% 50%, hsl(330, 100%, 80% / 0.4), hsl(270, 60%, 80% / 0.2), transparent 70%)",
              border: "1px solid hsl(330, 100%, 72% / 0.6)",
            }}
          />
        )}
      </AnimatePresence>

      <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-display mb-4">
        Demon Evolution
      </h3>

      <div className="flex items-baseline gap-3 mb-3">
        <motion.span
          className="text-3xl font-display font-bold text-gradient-pink"
          key={level}
          initial={{ scale: 1.25, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          Lv.{level}
        </motion.span>
        <span className="text-xs text-muted-foreground">
          {xp}/{xpToNext} XP
        </span>
      </div>

      {/* XP Bar with glow trail */}
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-5 relative">
        {/* Glow trail */}
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent, hsl(330, 100%, 72% / 0.4))",
            filter: "blur(4px)",
          }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
        />
        {/* Main bar */}
        <motion.div
          className="h-full rounded-full relative"
          style={{
            background: "linear-gradient(90deg, hsl(330, 100%, 65%), hsl(330, 100%, 82%), hsl(270, 60%, 82%))",
            boxShadow: "0 0 10px hsl(330, 100%, 72% / 0.5)",
          }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>

      {/* Abilities */}
      <div className="space-y-2.5">
        {abilities.map((ability, i) => (
          <motion.div
            key={ability.name}
            className="flex items-center justify-between text-sm py-1.5"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{
              color: ability.unlocked ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground) / 0.4)",
              filter: ability.unlocked ? "none" : "blur(0.4px)",
            }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={
                  ability.unlocked
                    ? {
                        background: "hsl(var(--demon-pink))",
                        boxShadow: "0 0 8px hsl(330, 100%, 72% / 0.8), 0 0 16px hsl(330, 100%, 72% / 0.3)",
                      }
                    : { background: "hsl(var(--muted-foreground) / 0.2)" }
                }
                animate={ability.unlocked ? { opacity: [1, 0.6, 1] } : { opacity: 1 }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
              />
              <span className="font-display text-xs tracking-wide uppercase">
                {ability.name}
              </span>
            </div>
            <span className="text-xs font-display">
              {ability.unlocked ? (
                <span style={{ color: "hsl(var(--demon-pink))" }}>Lv.{ability.level}</span>
              ) : (
                <span>Locked</span>
              )}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
