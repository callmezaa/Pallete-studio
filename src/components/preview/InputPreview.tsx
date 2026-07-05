"use client";
import { usePaletteStore } from "@/store/palette-store";

export function InputPreview() {
  const dominantColor = usePaletteStore((s) => s.dominantColor);
  if (!dominantColor) return null;
  return (
    <div className="space-y-3">
      <input type="text" placeholder="Default input" className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none transition-all focus:ring-2" style={{ borderColor: dominantColor + "40" }} />
      <input type="text" placeholder="Focused state" className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none transition-all" style={{ borderColor: dominantColor, boxShadow: `0 0 0 2px ${dominantColor}30` }} />
    </div>
  );
}
