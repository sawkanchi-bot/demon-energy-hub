import { Zap, Moon } from "lucide-react";
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
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, hsl(330, 100%, 72%), hsl(270, 60%, 60%))",
            boxShadow: "0 0 15px hsl(330, 100%, 72% / 0.3)",
          }}
        >
          <Zap size={16} className="text-primary-foreground" />
        </div>
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
        <button
          onClick={onToggleMoonlight}
          className={`p-2.5 rounded-lg border transition-all duration-300 group relative ${
            moonlightMode
              ? "border-accent/40 bg-accent/10"
              : "border-border hover:border-primary/30"
          }`}
          title="Moonlight Mode"
        >
          <Moon
            size={15}
            className={`transition-colors ${
              moonlightMode ? "text-accent" : "text-muted-foreground group-hover:text-primary/70"
            }`}
          />
          {/* Tooltip */}
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-display tracking-wider">
            {moonlightMode ? "Moonlight On" : "Moonlight Off"}
          </span>
        </button>

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
