"use client";

import { usePaletteStore } from "@/store/palette-store";
import { ColorCard } from "./ColorCard";

export function PaletteGrid() {
  const colors = usePaletteStore((s) => s.colors);
  if (colors.length === 0) return null;

  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold tracking-tight">Palette</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {colors.map((color, i) => (
          <ColorCard key={`${color.hex}-${i}`} color={color} index={i} />
        ))}
      </div>
    </section>
  );
}
