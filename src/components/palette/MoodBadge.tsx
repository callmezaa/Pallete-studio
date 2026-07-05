"use client";

import { motion } from "framer-motion";
import { usePaletteStore } from "@/store/palette-store";
import { cn } from "@/lib/utils";

const moodColors: Record<string, string> = {
  luxury: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  modern: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  elegant: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  minimal: "bg-slate-500/10 text-slate-300 border-slate-500/20",
  cyber: "bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-500/20",
  corporate: "bg-sky-500/10 text-sky-500 border-sky-500/20",
  nature: "bg-green-500/10 text-green-500 border-green-500/20",
  vintage: "bg-amber-700/10 text-amber-600 border-amber-700/20",
  playful: "bg-pink-500/10 text-pink-500 border-pink-500/20",
  warm: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  cold: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
};

export function MoodBadge() {
  const mood = usePaletteStore((s) => s.mood);
  if (mood.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {mood.map((m, i) => (
        <motion.span
          key={m}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className={cn(
            "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium capitalize",
            moodColors[m] ?? "bg-muted text-muted-foreground border-border"
          )}
        >
          {m}
        </motion.span>
      ))}
    </div>
  );
}
