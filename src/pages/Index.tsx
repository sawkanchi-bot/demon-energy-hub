import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Flame, Shield, Activity, Skull, Heart } from "lucide-react";
import { Header } from "@/components/Header";
import { Reactor } from "@/components/Reactor";
import { StatCard } from "@/components/StatCard";
import { EvolutionPanel } from "@/components/EvolutionPanel";
import { AnalyticsDrawer } from "@/components/AnalyticsDrawer";
import { ParticleBackground } from "@/components/ParticleBackground";

const DRAIN_RATES = { idle: 0.02, active: 0.08, combat: 0.2 };
const MOONLIGHT_MULTIPLIER = 0.4;

const Index = () => {
  const [energy, setEnergy] = useState(78);
  const [moonlightMode, setMoonlightMode] = useState(false);
  const [activityLevel, setActivityLevel] = useState<"idle" | "active" | "combat">("idle");
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [showWave, setShowWave] = useState(false);
  const [bloodConsumed, setBloodConsumed] = useState(3);
  const [rageActivations, setRageActivations] = useState(1);
  const [level, setLevel] = useState(4);
  const [xp, setXp] = useState(340);

  const isRageMode = energy < 30;
  const isLowEnergy = energy < 30;

  // Energy drain simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prev) => {
        const rate = DRAIN_RATES[activityLevel] * (moonlightMode ? MOONLIGHT_MULTIPLIER : 1);
        const next = prev - rate;
        return Math.max(0, next);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [activityLevel, moonlightMode]);

  // Track rage activations
  useEffect(() => {
    if (energy < 30 && energy > 29.5) {
      setRageActivations((p) => p + 1);
    }
  }, [energy]);

  const consumeBloodPack = useCallback(() => {
    setShowWave(true);
    setTimeout(() => setShowWave(false), 800);
    setEnergy((prev) => Math.min(100, prev + 34));
    setBloodConsumed((p) => p + 1);
    setXp((prev) => {
      const next = prev + 25;
      if (next >= 500) {
        setLevel((l) => l + 1);
        return next - 500;
      }
      return next;
    });
  }, []);

  const abilities = [
    { name: "Sunlight Resistance", level: 2, unlocked: level >= 2 },
    { name: "Rage Burst Duration", level: 3, unlocked: level >= 3 },
    { name: "Blood Synthesis", level: 5, unlocked: level >= 5 },
    { name: "Shadow Merge", level: 7, unlocked: level >= 7 },
    { name: "Oni Ascension", level: 10, unlocked: level >= 10 },
  ];

  const stabilityIndex = Math.max(0, Math.min(10, (energy / 10).toFixed(1) as any));

  return (
    <div
      className={`min-h-screen nebula-bg relative overflow-hidden transition-all duration-1000 ${
        isRageMode ? "rage-tint" : ""
      } ${isLowEnergy ? "animate-subtle-shake" : ""}`}
      style={{
        ...(moonlightMode && {
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, hsl(260 40% 14% / 0.7), transparent), radial-gradient(ellipse 60% 80% at 20% 80%, hsl(270 50% 18% / 0.4), transparent), hsl(250, 20%, 5%)",
        }),
      }}
    >
      <ParticleBackground moonlight={moonlightMode} />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header
          moonlightMode={moonlightMode}
          onToggleMoonlight={() => setMoonlightMode((m) => !m)}
          onOpenAnalytics={() => setAnalyticsOpen(true)}
        />

        {/* Main content */}
        <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 px-5 md:px-8 pb-8">
          {/* Left - Status */}
          <motion.div
            className="w-full lg:w-64 space-y-3 order-2 lg:order-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <StatCard
              label="Demon Level"
              value={`Lv.${level}`}
              icon={<Skull size={16} />}
              subtext="Oni Class — Ascendant"
              delay={0.1}
            />
            <StatCard
              label="Blood Consumed"
              value={bloodConsumed}
              icon={<Droplets size={16} />}
              subtext="Today's intake"
              delay={0.2}
            />
            <StatCard
              label="Stability Index"
              value={`${stabilityIndex}/10`}
              icon={<Activity size={16} />}
              subtext={Number(stabilityIndex) < 4 ? "⚠ Volatile" : "Stable"}
              delay={0.3}
            />
          </motion.div>

          {/* Center - Reactor */}
          <motion.div
            className="flex flex-col items-center gap-6 order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Reactor energy={energy} isRageMode={isRageMode} showWave={showWave} />

            {/* Warning */}
            <AnimatePresence>
              {isLowEnergy && (
                <motion.p
                  className="text-xs font-display uppercase tracking-[0.2em] text-destructive"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  exit={{ opacity: 0 }}
                  transition={{ opacity: { duration: 2, repeat: Infinity } }}
                  style={{ textShadow: "0 0 10px hsl(350, 80%, 50%)" }}
                >
                  ⚠ Critical Energy — Rage Mode Active
                </motion.p>
              )}
            </AnimatePresence>

            {/* Controls */}
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={consumeBloodPack}
                className="btn-demon text-xs px-6 py-2.5 rounded-lg"
              >
                <span className="flex items-center gap-2">
                  <Heart size={14} />
                  Consume Blood Pack
                </span>
              </button>

              {/* Activity toggle */}
              <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-secondary/30">
                {(["idle", "active", "combat"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setActivityLevel(mode)}
                    className={`text-[10px] uppercase tracking-[0.15em] font-display px-3 py-1.5 rounded-md transition-all ${
                      activityLevel === mode
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right - Evolution & Stats */}
          <motion.div
            className="w-full lg:w-64 space-y-3 order-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <EvolutionPanel level={level} xp={xp} xpToNext={500} abilities={abilities} />
            <StatCard
              label="Rage Activations"
              value={rageActivations}
              icon={<Flame size={16} />}
              subtext="Today's triggers"
              delay={0.4}
            />
            <StatCard
              label="XP Gained"
              value={xp}
              icon={<Shield size={16} />}
              subtext={`${500 - xp} to next level`}
              delay={0.5}
            />
          </motion.div>
        </main>
      </div>

      <AnalyticsDrawer open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} />
    </div>
  );
};

export default Index;
