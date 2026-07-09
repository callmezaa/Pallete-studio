"use client";
import { usePaletteStore } from "@/store/palette-store";
import { textColorForBg } from "@/lib/contrast";
import { cn } from "@/lib/utils";

export function GlassCardPreview() {
  const colors = usePaletteStore((s) => s.colors);
  const activeIndex = usePaletteStore((s) => s.activeColorIndex);
  const accent = activeIndex !== null ? colors[activeIndex]?.hex : colors[0]?.hex;
  if (!accent) return null;
  return (
    <div className={cn(
      "group rounded-xl p-6 backdrop-blur-xl",
      "shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]",
      "transition-[box-shadow,scale,background-color] duration-300 ease-out hover:scale-[1.02] hover:bg-white/[0.06]",
      "hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset,0_8px_24px_rgba(0,0,0,0.3)]",
    )}>
      <h4
        className="mb-1 font-semibold"
        style={{ color: textColorForBg(accent) === "#ffffff" ? accent + "cc" : accent }}
      >
        Glass Card
      </h4>
      <p className="text-sm text-muted-foreground">Glassmorphism card styled with your palette.</p>
    </div>
  );
}
