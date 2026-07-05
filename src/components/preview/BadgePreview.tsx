"use client";
import { usePaletteStore } from "@/store/palette-store";

export function BadgePreview() {
  const colors = usePaletteStore((s) => s.colors);
  if (colors.length < 2) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {colors.slice(0, 4).map((c, i) => (
        <span key={`${c.hex}-${i}`} className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium" style={{ backgroundColor: c.hex + "20", color: c.hex, borderColor: c.hex + "40" }}>{c.hex}</span>
      ))}
    </div>
  );
}
