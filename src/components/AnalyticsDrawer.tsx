import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { day: "Mon", energy: 85 },
  { day: "Tue", energy: 72 },
  { day: "Wed", energy: 90 },
  { day: "Thu", energy: 45 },
  { day: "Fri", energy: 68 },
  { day: "Sat", energy: 92 },
  { day: "Sun", energy: 78 },
];

interface AnalyticsDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function AnalyticsDrawer({ open, onClose }: AnalyticsDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 nebula-bg border-l border-border overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-display uppercase tracking-[0.15em] text-gradient-pink">
                  Energy Analytics
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg border border-border hover:border-primary/30 transition-colors"
                >
                  <X size={16} className="text-muted-foreground" />
                </button>
              </div>

              <div className="glow-card rounded-xl p-5 mb-6">
                <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-display mb-4">
                  7-Day Energy Flow
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <defs>
                        <linearGradient id="pinkGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(330, 100%, 72%)" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="hsl(330, 100%, 72%)" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "hsl(270, 10%, 55%)", fontSize: 11, fontFamily: "Space Grotesk" }}
                      />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(260, 25%, 8%)",
                          border: "1px solid hsl(270, 20%, 16%)",
                          borderRadius: "8px",
                          color: "hsl(330, 100%, 85%)",
                          fontFamily: "Space Grotesk",
                          fontSize: 12,
                        }}
                        formatter={(value: number) => [`${value}%`, "Energy"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="energy"
                        stroke="hsl(330, 100%, 72%)"
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{
                          r: 4,
                          fill: "hsl(330, 100%, 85%)",
                          stroke: "hsl(330, 100%, 72%)",
                          strokeWidth: 2,
                        }}
                        style={{ filter: "drop-shadow(0 0 8px hsl(330, 100%, 72%))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Avg Daily Drain", value: "12.4%/hr", desc: "Based on current activity patterns" },
                  { label: "Peak Consumption", value: "Thu 03:00", desc: "Rage mode triggered 3 times" },
                  { label: "Recovery Rate", value: "+34%/pack", desc: "Blood Type A — Optimal grade" },
                  { label: "Stability Score", value: "7.2/10", desc: "Moderate volatility detected" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    className="glow-card rounded-lg p-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-display">
                        {item.label}
                      </span>
                      <span className="text-sm font-display font-semibold text-primary">
                        {item.value}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground/70">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
