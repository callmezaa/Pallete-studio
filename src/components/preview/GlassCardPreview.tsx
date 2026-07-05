"use client";
import { usePaletteStore } from "@/store/palette-store";

export function GlassCardPreview() {
  const colors = usePaletteStore((s) => s.colors);
  if (colors.length < 2) return null;
  return (
    <div className="rounded-xl border p-6 backdrop-blur-xl" style={{ backgroundColor: colors[0].hex + "10", borderColor: colors[0].hex + "20" }}>
      <h4 className="font-semibold" style={{ color: colors[0].hex }}>Glass Card</h4>
      <p className="mt-1 text-sm text-muted-foreground">Glassmorphism card styled with your palette.</p>
    </div>
  );
}
