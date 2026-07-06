"use client";

import { LayoutGroup, motion } from "framer-motion";
import { usePaletteStore } from "@/store/palette-store";
import { formatColor } from "@/lib/colors";
import { COLOR_FORMATS } from "@/constants";
import { cn } from "@/lib/utils";
import type { ExtractedColor } from "@/types";

const DISPLAY_FORMATS = COLOR_FORMATS.filter((f) => f !== "css-var");

interface FormatToggleProps {
  color: ExtractedColor;
}

export function FormatToggle({ color }: FormatToggleProps) {
  const activeFormat = usePaletteStore((s) => s.activeFormat);
  const setActiveFormat = usePaletteStore((s) => s.setActiveFormat);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <LayoutGroup>
          <div className="relative flex rounded-full bg-white/[0.06] p-0.5">
            {DISPLAY_FORMATS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFormat(f)}
                className={cn(
                  "relative z-10 rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase transition-[color,transform] duration-150 active:scale-[0.96]",
                  activeFormat === f ? "text-foreground" : "text-muted-foreground hover:text-foreground/80",
                )}
              >
                {activeFormat === f && (
                  <motion.div
                    layoutId="format-bg"
                    className="absolute inset-0 rounded-full bg-white/10"
                    transition={{ type: "spring", duration: 0.35, bounce: 0 }}
                  />
                )}
                <span className="relative z-10">{f}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
        <span className="text-xs tabular-nums text-muted-foreground">{color.percentage}%</span>
      </div>
      <p className="font-mono text-sm tabular-nums">{formatColor(color, activeFormat)}</p>
    </div>
  );
}
