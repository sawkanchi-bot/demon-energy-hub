import { useState, useEffect, useCallback, useRef } from "react";
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
  const [shimmerActive, setShimmerActive] = useState(false);
  const shimmerRef = useRef<NodeJS.Timeout | null>(null);

  const isRageMode = energy < 25;
  const isLowEnergy = energy < 25;
  const isHighEnergy = energy > 70;

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
    if (energy < 25 && energy > 24.5) {
      setRageActivations((p) => p + 1);
    }
  }, [energy]);

  // Moonlight shimmer every 8 seconds
  useEffect(() => {
    if (!moonlightMode) {
      if (shimmerRef.current) clearInterval(shimmerRef.current);
      return;
    }
    shimmerRef.current = setInterval(() => {
      setShimmerActive(true);
      setTimeout(() => setShimmerActive(false), 1200);
    }, 8000);
    return () => {
      if (shimmerRef.current) clearInterval(shimmerRef.current);
    };
  }, [moonlightMode]);

  const consumeBloodPack = useCallback(() => {
    setShowWave(true);
    setTimeout(() => setShowWave(false), 850);
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

  const stabilityIndex = Math.max(0, Math.min(10, parseFloat((energy / 10).toFixed(1))));

  // Dynamic ambient light color based on energy level
  const ambientSpillOpacity = isHighEnergy ? 0.06 : isLowEnergy ? 0.02 : 0.04;
  const ambientSpillHue = moonlightMode ? "270, 60%, 75%" : isRageMode ? "350, 80%, 45%" : "330, 100%, 72%";

  return (
    <div
      className={`min-h-screen nebula-bg relative overflow-hidden transition-all duration-1000 ${
        isRageMode ? "rage-tint" : ""
      }`}
      style={{
        ...(moonlightMode && {
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, hsl(260 40% 14% / 0.7), transparent), radial-gradient(ellipse 60% 80% at 20% 80%, hsl(270 50% 18% / 0.4), transparent), hsl(250, 20%, 5%)",
        }),
      }}
    >
      <ParticleBackground moonlight={moonlightMode} />

      {/* Vignette overlay — intensifies on critical energy */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, hsl(240, 15%, 3%) 100%)",
        }}
        animate={{ opacity: isLowEnergy ? 0.85 : 0.4 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      {/* Critical desaturation overlay */}
      <AnimatePresence>
        {isLowEnergy && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.07 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{ background: "hsl(350, 80%, 20%)", mixBlendMode: "multiply" }}
          />
        )}
      </AnimatePresence>

      {/* Ambient light spill from reactor energy level */}
      <motion.div
        className="fixed pointer-events-none z-0"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "70vw",
          height: "70vh",
          borderRadius: "50%",
          background: `radial-gradient(circle, hsl(${ambientSpillHue} / ${ambientSpillOpacity}), transparent 65%)`,
        }}
        animate={{ opacity: isHighEnergy ? 1 : 0.5 }}
        transition={{ duration: 2 }}
      />

      {/* Moonlight shimmer sweep */}
      <AnimatePresence>
        {shimmerActive && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-20"
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: [0, 0.05, 0.08, 0.05, 0], x: "150%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{
              background:
                "linear-gradient(105deg, transparent 30%, hsl(270, 60%, 85% / 0.3) 50%, transparent 70%)",
              transform: "skewX(-15deg)",
            }}
          />
        )}
      </AnimatePresence>

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
            style={{
              filter: isLowEnergy ? "saturate(0.7)" : "saturate(1)",
              transition: "filter 2s ease",
            }}
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
              subtext={stabilityIndex < 4 ? "⚠ Volatile" : "Stable"}
              delay={0.3}
              pulse={isLowEnergy}
            />
          </motion.div>

          {/* Center - Reactor */}
          <motion.div
            className="flex flex-col items-center gap-6 order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Reactor
              energy={energy}
              isRageMode={isRageMode}
              showWave={showWave}
              moonlightMode={moonlightMode}
            />

            {/* Warning */}
            <AnimatePresence>
              {isLowEnergy && (
                <motion.p
                  className="text-xs font-display uppercase tracking-[0.2em]"
                  style={{ color: "hsl(var(--destructive))", textShadow: "0 0 12px hsl(350, 80%, 50%)" }}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  exit={{ opacity: 0 }}
                  transition={{ opacity: { duration: 2, repeat: Infinity } }}
                >
                  ⚠ Critical Energy — Rage Mode Active
                </motion.p>
              )}
            </AnimatePresence>

            {/* Controls */}
            <div className="flex flex-col items-center gap-3">
              <motion.button
                onClick={consumeBloodPack}
                className="btn-demon text-xs px-6 py-2.5 rounded-lg"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
              >
                <span className="flex items-center gap-2">
                  <Heart size={14} />
                  Consume Blood Pack
                </span>
              </motion.button>

              {/* Activity toggle */}
              <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-secondary/30">
                {(["idle", "active", "combat"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setActivityLevel(mode)}
                    className={`text-[10px] uppercase tracking-[0.15em] font-display px-3 py-1.5 rounded-md transition-all duration-300 ${
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
            style={{
              filter: isLowEnergy ? "saturate(0.7)" : "saturate(1)",
              transition: "filter 2s ease",
            }}
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
