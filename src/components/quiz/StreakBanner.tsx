import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakBannerProps {
  streak: number;
}

export function StreakBanner({ streak }: StreakBannerProps) {
  if (streak < 2) return null;
  const label =
    streak >= 5
      ? `${streak}x Streak LEGENDARIS! 🔥🔥🔥`
      : streak >= 3
      ? `${streak}x Streak! 🔥`
      : `${streak}x Combo! ⚡`;
  return (
    <motion.div
      key={streak}
      initial={{ opacity: 0, scale: 0.5, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="flex items-center justify-center gap-2 py-2 px-4 bg-brand-yellow border-2 border-brand-dark rounded-xl shadow-neo-sm mb-4 mx-auto w-fit"
    >
      <Flame className="w-4 h-4 text-orange-600" />
      <span className="text-xs font-black text-brand-dark uppercase tracking-wide">{label}</span>
    </motion.div>
  );
}
