import { motion, AnimatePresence } from "framer-motion";

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

  return (
    <div className="glow-card rounded-xl p-5">
      <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-display mb-4">
        Demon Evolution
      </h3>

      <div className="flex items-baseline gap-3 mb-3">
        <span className="text-3xl font-display font-bold text-gradient-pink">
          Lv.{level}
        </span>
        <span className="text-xs text-muted-foreground">
          {xp}/{xpToNext} XP
        </span>
      </div>

      {/* XP Bar */}
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-5">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, hsl(330, 100%, 72%), hsl(270, 60%, 82%))",
            boxShadow: "0 0 10px hsl(330, 100%, 72% / 0.5)",
          }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>

      {/* Abilities */}
      <div className="space-y-2.5">
        {abilities.map((ability) => (
          <div
            key={ability.name}
            className={`flex items-center justify-between text-sm py-1.5 ${
              ability.unlocked ? "text-foreground" : "text-muted-foreground/40"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  ability.unlocked
                    ? "bg-primary shadow-[0_0_6px_hsl(330,100%,72%)]"
                    : "bg-muted-foreground/20"
                }`}
              />
              <span className="font-display text-xs tracking-wide uppercase">
                {ability.name}
              </span>
            </div>
            <span className="text-xs font-display">
              {ability.unlocked ? (
                <span className="text-primary">Lv.{ability.level}</span>
              ) : (
                <span>Locked</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
