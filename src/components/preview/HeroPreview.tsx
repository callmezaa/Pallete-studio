"use client";
import { usePaletteStore } from "@/store/palette-store";

export function HeroPreview() {
  const dominantColor = usePaletteStore((s) => s.dominantColor);
  if (!dominantColor) return null;
  return (
    <div className="flex h-64 items-center justify-center rounded-xl" style={{ backgroundColor: dominantColor + "20" }}>
      <div className="text-center">
        <h3 className="text-2xl font-bold" style={{ color: dominantColor }}>Built with your palette</h3>
        <p className="mt-2 text-sm text-muted-foreground">A hero section using extracted colors</p>
      </div>
    </div>
  );
}
