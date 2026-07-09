"use client";
import { usePaletteStore } from "@/store/palette-store";
import { textColorForBg } from "@/lib/contrast";
import { cn } from "@/lib/utils";

export function ButtonPreview() {
  const colors = usePaletteStore((s) => s.colors);
  const activeIndex = usePaletteStore((s) => s.activeColorIndex);
  const accent = activeIndex !== null ? colors[activeIndex]?.hex : colors[0]?.hex;
  if (!accent) return null;
  return (
    <div className="flex flex-wrap gap-3">
      <button
        className={cn(
          "rounded-lg px-6 py-2.5 text-sm font-medium transition-[opacity,scale] duration-150 ease-out hover:opacity-90 active:scale-[0.96]",
          "shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]",
        )}
        style={{ backgroundColor: accent, color: textColorForBg(accent) }}
      >
        Primary
      </button>
      <button
        className="rounded-lg border px-6 py-2.5 text-sm font-medium transition-[opacity,scale] duration-150 ease-out hover:opacity-80 active:scale-[0.96]"
        style={{ borderColor: accent, color: accent }}
      >
        Outline
      </button>
      <button
        className="rounded-lg px-6 py-2.5 text-sm font-medium transition-[opacity,scale] duration-150 ease-out hover:opacity-80 active:scale-[0.96]"
        style={{ backgroundColor: accent + "15", color: accent }}
      >
        Ghost
      </button>
    </div>
  );
}
