"use client";
import { usePaletteStore } from "@/store/palette-store";
import { textColorForBg } from "@/lib/contrast";
import { cn } from "@/lib/utils";

export function HeroPreview() {
  const colors = usePaletteStore((s) => s.colors);
  const activeIndex = usePaletteStore((s) => s.activeColorIndex);
  const accent = activeIndex !== null ? colors[activeIndex]?.hex : colors[0]?.hex;
  if (!accent) return null;
  return (
    <div className={cn(
      "group flex h-64 items-center justify-center overflow-hidden rounded-xl",
      "shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]",
      "transition-[box-shadow,scale] duration-300 ease-out hover:scale-[1.01]",
      "hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset,0_8px_24px_rgba(0,0,0,0.3)]",
    )}>
      <div className="text-center">
        <h3 className="text-2xl font-bold transition-colors duration-300 text-balance" style={{ color: accent }}>
          Built with your palette
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">Hero section using extracted colors</p>
        <button
          className={cn(
            "mt-4 rounded-lg px-5 py-2 text-sm font-medium transition-[opacity,scale] duration-150 ease-out hover:opacity-90 active:scale-[0.96]",
            "shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]",
          )}
          style={{ backgroundColor: accent, color: textColorForBg(accent) }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
