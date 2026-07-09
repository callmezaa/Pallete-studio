"use client";

import { motion } from "framer-motion";
import { usePaletteStore } from "@/store/palette-store";
import { cn } from "@/lib/utils";

export function ColorPaletteBar() {
  const colors = usePaletteStore((s) => s.colors);
  const activeIndex = usePaletteStore((s) => s.activeColorIndex);
  const setActiveColorIndex = usePaletteStore((s) => s.setActiveColorIndex);

  if (colors.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5">
      <span className="mr-1 text-[10px] font-medium tracking-wider uppercase text-muted-foreground/40">
        Active
      </span>
      {colors.map((c, i) => (
        <button
          key={`${c.hex}-${i}`}
          onClick={() => setActiveColorIndex(activeIndex === i ? null : i)}
          className={cn(
            "relative h-5 w-5 rounded-full transition-transform duration-200",
            "before:absolute before:inset-[-10px] before:rounded-full before:content-['']",
            "active:scale-[0.96]",
          )}
          style={{ backgroundColor: c.hex }}
        >
          {activeIndex === i && (
            <motion.span
              layoutId="active-swatch-ring"
              className="absolute inset-[-3px] rounded-full border-2 border-white/60"
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
