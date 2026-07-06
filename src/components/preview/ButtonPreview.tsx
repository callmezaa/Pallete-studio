"use client";
import { usePaletteStore } from "@/store/palette-store";

export function ButtonPreview() {
  const colors = usePaletteStore((s) => s.colors);
  if (colors.length < 2) return null;
  return (
    <div className="flex flex-wrap gap-3">
      <button
        className="rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-[opacity,scale] duration-150 ease-out hover:opacity-90 active:scale-[0.96]"
        style={{ backgroundColor: colors[0].hex }}
      >
        Primary
      </button>
      <button
        className="rounded-lg border px-6 py-2.5 text-sm font-medium transition-[opacity,scale] duration-150 ease-out hover:opacity-80 active:scale-[0.96]"
        style={{ borderColor: colors[0].hex, color: colors[0].hex }}
      >
        Outline
      </button>
      <button
        className="rounded-lg px-6 py-2.5 text-sm font-medium transition-[opacity,scale] duration-150 ease-out hover:opacity-80 active:scale-[0.96]"
        style={{ backgroundColor: colors[0].hex + "20", color: colors[0].hex }}
      >
        Ghost
      </button>
    </div>
  );
}
