"use client";

import { usePaletteStore } from "@/store/palette-store";

export function ThemeBackground() {
  const colors = usePaletteStore((s) => s.colors);
  if (colors.length < 2) return null;

  return (
    <div
      className="fixed inset-0 -z-10 transition-all duration-700 ease-in-out"
      style={{
        background: `linear-gradient(135deg, ${colors[0].hex}15, ${colors[1].hex}10)`,
      }}
    />
  );
}
