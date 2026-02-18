import { Moon } from "lucide-react";
import { motion } from "framer-motion";

interface HeaderProps {
  moonlightMode: boolean;
  onToggleMoonlight: () => void;
  onOpenAnalytics: () => void;
}

export function Header({ moonlightMode, onToggleMoonlight, onOpenAnalytics }: HeaderProps) {
  return (
    <motion.header
      className="relative z-10 flex items-center justify-between px-5 md:px-8 py-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3">
        {/* Brand icon — pulsing reactor mark */}
        <motion.div
          className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, hsl(var(--demon-pink)), hsl(270, 60%, 60%))",
            boxShadow: moonlightMode
              ? "0 0 16px hsl(270, 60%, 75% / 0.4)"
              : "0 0 16px hsl(var(--demon-pink) / 0.35)",
          }}
          animate={{ boxShadow: moonlightMode
            ? ["0 0 12px hsl(270, 60%, 75% / 0.3)", "0 0 22px hsl(270, 60%, 75% / 0.55)", "0 0 12px hsl(270, 60%, 75% / 0.3)"]
            : ["0 0 12px hsl(var(--demon-pink) / 0.3)", "0 0 22px hsl(var(--demon-pink) / 0.55)", "0 0 12px hsl(var(--demon-pink) / 0.3)"],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Inner plasma dot */}
          <div
            className="w-3 h-3 rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(330, 100%, 92%), hsl(330, 100%, 72%))",
              boxShadow: "0 0 8px hsl(330, 100%, 80%)",
            }}
          />
        </motion.div>

        <div>
          <h1 className="text-sm font-display font-bold uppercase tracking-[0.2em] text-gradient-pink">
            Demon Fuel
          </h1>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Oni Energy System
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Moonlight Mode toggle — tactile */}
        <motion.button
          onClick={onToggleMoonlight}
          className="relative group"
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          title="Moonlight Mode"
        >
          <motion.div
            className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-400"
            animate={{
              borderColor: moonlightMode ? "hsl(270, 40%, 50% / 0.5)" : "hsl(var(--border))",
              background: moonlightMode ? "hsl(270, 30%, 14%)" : "transparent",
              boxShadow: moonlightMode
                ? "0 0 16px -4px hsl(270, 60%, 70% / 0.3), inset 0 0 12px -4px hsl(270, 60%, 70% / 0.1)"
                : "none",
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{ rotate: moonlightMode ? 0 : -30, scale: moonlightMode ? 1 : 0.85 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Moon
                size={13}
                style={{
                  color: moonlightMode ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))",
                  transition: "color 0.3s",
                }}
              />
            </motion.div>
            <span
              className="text-[10px] font-display uppercase tracking-[0.15em] transition-colors duration-300"
              style={{ color: moonlightMode ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))" }}
            >
              {moonlightMode ? "Moonlight" : "Normal"}
            </span>

            {/* Toggle pill indicator */}
            <div
              className="w-7 h-3.5 rounded-full relative transition-all duration-300"
              style={{
                background: moonlightMode ? "hsl(270, 50%, 45%)" : "hsl(var(--secondary))",
              }}
            >
              <motion.div
                className="absolute top-0.5 w-2.5 h-2.5 rounded-full"
                style={{
                  background: moonlightMode ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))",
                  boxShadow: moonlightMode ? "0 0 6px hsl(270, 60%, 75%)" : "none",
                }}
                animate={{ x: moonlightMode ? 15 : 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </div>
          </motion.div>
        </motion.button>

        <button
          onClick={onOpenAnalytics}
          className="btn-demon-outline text-[11px] px-4 py-2 rounded-lg"
        >
          Analytics
        </button>
      </div>
    </motion.header>
  );
}
