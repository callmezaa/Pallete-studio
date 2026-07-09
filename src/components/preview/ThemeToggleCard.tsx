"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePaletteStore } from "@/store/palette-store";
import { textColorForBg } from "@/lib/contrast";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";

export function ThemeToggleCard() {
  const colors = usePaletteStore((s) => s.colors);
  const activeIndex = usePaletteStore((s) => s.activeColorIndex);
  const accent = activeIndex !== null ? colors[activeIndex]?.hex : colors[0]?.hex;
  const textOnAccent = textColorForBg(accent);
  const [dark, setDark] = useState(true);

  if (colors.length === 0) return null;

  const bg = dark ? "#0a0a0f" : "#f5f5f0";
  const surface = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const text = dark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)";
  const muted = dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl p-5 transition-colors duration-500",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]",
      )}
      style={{ backgroundColor: surface }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-xs font-semibold tracking-tight text-balance" style={{ color: text }}>
          Theme Preview
        </h4>
        <button
          onClick={() => setDark(!dark)}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-200",
            "active:scale-[0.96]",
          )}
          style={{ backgroundColor: accent + "20", color: accent }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {dark ? (
              <motion.span key="sun" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Sun className="h-3.5 w-3.5" />
              </motion.span>
            ) : (
              <motion.span key="moon" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Moon className="h-3.5 w-3.5" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mock UI */}
      <div
        className="overflow-hidden rounded-lg transition-colors duration-500"
        style={{ backgroundColor: bg, color: text }}
      >
        {/* Mock navbar */}
        <div
          className="flex items-center justify-between px-4 py-2.5 text-xs"
          style={{ borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}
        >
          <span className="font-semibold" style={{ color: accent }}>App</span>
          <div className="flex gap-4" style={{ color: muted }}>
            <span>Home</span>
            <span>Settings</span>
          </div>
        </div>

        {/* Mock content */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: accent, color: textOnAccent }}
            >
              A
            </div>
            <div>
              <div className="text-xs font-medium" style={{ color: text }}>Dashboard</div>
              <div className="text-[10px]" style={{ color: muted }}>Welcome back</div>
            </div>
          </div>
          <div
            className="h-2 rounded-full"
            style={{ backgroundColor: accent + "20", width: "60%" }}
          />
          <div
            className="h-2 rounded-full"
            style={{ backgroundColor: accent + "15", width: "40%" }}
          />
        </div>
      </div>
    </div>
  );
}
