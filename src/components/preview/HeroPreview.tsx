"use client";
import { usePaletteStore } from "@/store/palette-store";

export function HeroPreview() {
  const dominantColor = usePaletteStore((s) => s.dominantColor);
  if (!dominantColor) return null;
  return (
    <div
      className="group flex h-64 items-center justify-center overflow-hidden rounded-xl shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset] transition-[box-shadow,scale] duration-300 ease-out hover:scale-[1.01] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset,0_8px_24px_rgba(0,0,0,0.3)]"
      style={{ backgroundColor: dominantColor + "20" }}
    >
      <div className="text-center">
        <h3 className="text-2xl font-bold transition-colors duration-300 group-hover:text-balance" style={{ color: dominantColor }}>Built with your palette</h3>
        <p className="mt-2 text-sm text-muted-foreground">A hero section using extracted colors</p>
      </div>
    </div>
  );
}
