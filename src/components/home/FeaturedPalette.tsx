"use client";

import { usePaletteStore } from "@/store/palette-store";

export function FeaturedPalette() {
  const colors = usePaletteStore((s) => s.colors);

  if (colors.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl px-6">
      <div className="overflow-hidden rounded-2xl bg-white/[0.03] shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset] backdrop-blur-xl">
        <div className="flex">
          {colors.map((c, i) => (
            <div
              key={`${c.hex}-${i}`}
              className="flex flex-1 flex-col items-center gap-2 py-10 transition-all duration-300 hover:flex-[1.15] hover:scale-[1.02]"
              style={{ backgroundColor: c.hex }}
            >
              <span
                className="rounded bg-black/20 px-2 py-0.5 font-mono text-[11px] tabular-nums backdrop-blur-sm"
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                {c.hex}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
