"use client";

import { useMemo } from "react";
import { usePaletteStore } from "@/store/palette-store";
import { contrastRatio } from "@/lib/contrast";
import { cn } from "@/lib/utils";

interface PairData {
  a: { hex: string; rgb: { r: number; g: number; b: number } };
  b: { hex: string; rgb: { r: number; g: number; b: number } };
  ratio: number;
}

function ratingColor(ratio: number) {
  if (ratio >= 7) return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
  if (ratio >= 4.5) return "border-sky-500/30 bg-sky-500/10 text-sky-400";
  if (ratio >= 3) return "border-amber-500/30 bg-amber-500/10 text-amber-400";
  return "border-red-500/30 bg-red-500/10 text-red-400";
}

function ratingLabel(ratio: number) {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA Lg";
  return "Fail";
}

export function ContrastPanel() {
  const colors = usePaletteStore((s) => s.colors);

  const pairs = useMemo(() => {
    if (colors.length < 2) return [];
    const result: PairData[] = [];
    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const a = colors[i];
        const b = colors[j];
        result.push({
          a: { hex: a.hex, rgb: a.rgb },
          b: { hex: b.hex, rgb: b.rgb },
          ratio: contrastRatio(a.rgb.r, a.rgb.g, a.rgb.b, b.rgb.r, b.rgb.g, b.rgb.b),
        });
      }
    }
    return result.sort((x, y) => x.ratio - y.ratio);
  }, [colors]);

  if (colors.length === 0) return null;

  const total = pairs.length;
  const pass = pairs.filter((p) => p.ratio >= 3).length;
  const aa = pairs.filter((p) => p.ratio >= 4.5).length;
  const aaa = pairs.filter((p) => p.ratio >= 7).length;
  const fail = total - pass;

  return (
    <div className="rounded-xl bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset] backdrop-blur-xl">
      <h3 className="text-sm font-medium text-foreground">Contrast Checker</h3>

      {colors.length < 2 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Extract at least 2 colors to check contrast ratios.
        </p>
      ) : (
        <>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm tabular-nums">
            <span>
              Pass:{" "}
              <span className={cn(pass === total ? "text-emerald-400" : "text-foreground")}>
                {pass}/{total}
              </span>
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <span>
              AA: <span className="text-sky-400">{aa}</span>
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <span>
              AAA: <span className="text-emerald-400">{aaa}</span>
            </span>
            {fail > 0 && (
              <>
                <span className="text-xs text-muted-foreground">·</span>
                <span>
                  Fail: <span className="text-red-400">{fail}</span>
                </span>
              </>
            )}
          </div>

          <div className="mt-4 space-y-0.5">
            {pairs.map((pair, i) => (
              <div
                key={`${pair.a.hex}-${pair.b.hex}-${i}`}
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition-[background-color] duration-150 hover:bg-white/[0.03]"
              >
                <div className="flex shrink-0">
                  <div
                    className="h-5 w-5 rounded-full border border-white/10"
                    style={{ backgroundColor: pair.a.hex }}
                  />
                  <div
                    className="-ml-2 h-5 w-5 rounded-full border border-white/10"
                    style={{ backgroundColor: pair.b.hex }}
                  />
                </div>

                <div className="flex min-w-0 items-baseline gap-1.5 font-mono text-[11px]">
                  <span className="text-foreground/80">{pair.a.hex}</span>
                  <span className="text-muted-foreground">vs</span>
                  <span className="text-foreground/80">{pair.b.hex}</span>
                </div>

                <span className="ml-auto mr-3 font-mono text-sm tabular-nums text-foreground/90">
                  {pair.ratio.toFixed(1)}:1
                </span>

                <span
                  className={cn(
                    "inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium uppercase leading-none",
                    ratingColor(pair.ratio),
                  )}
                >
                  {ratingLabel(pair.ratio)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
