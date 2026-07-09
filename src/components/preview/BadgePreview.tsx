"use client";
import { usePaletteStore } from "@/store/palette-store";
import { textColorForBg } from "@/lib/contrast";
import { cn } from "@/lib/utils";

export function BadgePreview() {
  const colors = usePaletteStore((s) => s.colors);
  const activeIndex = usePaletteStore((s) => s.activeColorIndex);
  const accent = activeIndex !== null ? colors[activeIndex]?.hex : colors[0]?.hex;
  if (!accent) return null;
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {["solid", "outline", "ghost"].map((variant) => (
          <span
            key={variant}
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-[scale] duration-200 ease-out hover:scale-105 active:scale-[0.96]",
              variant === "solid" && "shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]",
            )}
            style={
              variant === "solid"
                ? { backgroundColor: accent, color: textColorForBg(accent) }
                : variant === "outline"
                  ? { border: `1px solid ${accent}50`, color: accent, backgroundColor: "transparent" }
                  : { backgroundColor: accent + "15", color: accent }
            }
          >
            {variant}
          </span>
        ))}
      </div>
    </div>
  );
}
