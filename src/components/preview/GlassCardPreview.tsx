"use client";
import { usePaletteStore } from "@/store/palette-store";

export function GlassCardPreview() {
  const colors = usePaletteStore((s) => s.colors);
  if (colors.length < 2) return null;
  return (
    <div
      className="group rounded-xl p-6 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset] transition-[box-shadow,scale,background-color] duration-300 ease-out hover:scale-[1.02] hover:bg-white/[0.06] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset,0_8px_24px_rgba(0,0,0,0.3)]"
      style={{ backgroundColor: colors[0].hex + "10" }}
    >
      <h4 className="font-semibold" style={{ color: colors[0].hex }}>Glass Card</h4>
      <p className="mt-1 text-sm text-muted-foreground">Glassmorphism card styled with your palette.</p>
    </div>
  );
}
