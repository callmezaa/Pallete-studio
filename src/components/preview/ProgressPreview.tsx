"use client";

import { motion } from "framer-motion";
import { usePaletteStore } from "@/store/palette-store";
import { textColorForBg } from "@/lib/contrast";
import { cn } from "@/lib/utils";

const bars = [
  { label: "Branding", pct: 92 },
  { label: "Typography", pct: 74 },
  { label: "Spacing", pct: 58 },
  { label: "Colors", pct: 100 },
];

export function ProgressPreview() {
  const colors = usePaletteStore((s) => s.colors);
  const activeIndex = usePaletteStore((s) => s.activeColorIndex);
  const accent = activeIndex !== null ? colors[activeIndex]?.hex : colors[0]?.hex;
  const textOnAccent = textColorForBg(accent);

  if (colors.length === 0) return null;

  return (
    <div
      className={cn(
        "rounded-xl p-5",
        "bg-white/[0.03] shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]",
      )}
    >
      <h4 className="mb-4 text-xs font-semibold tracking-tight text-foreground/80 text-balance">
        Progress
      </h4>
      <div className="space-y-4">
        {bars.map((bar) => (
          <div key={bar.label}>
            <div className="mb-1.5 flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground/60">{bar.label}</span>
              <span className="font-mono tabular-nums text-foreground/60">{bar.pct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.04]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${bar.pct}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                className="h-full rounded-full"
                style={{
                  backgroundColor: bar.pct === 100 ? accent : accent + "80",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        className={cn(
          "mt-5 w-full rounded-lg py-2 text-center text-xs font-medium transition-all duration-150",
          "active:scale-[0.97]",
        )}
        style={{ backgroundColor: accent + "15", color: accent }}
      >
        <span className="tabular-nums">{bars.filter(b => b.pct < 100).length}</span> tasks remaining
      </button>
    </div>
  );
}
