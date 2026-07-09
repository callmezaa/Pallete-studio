"use client";

import { useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, ExternalLink, RotateCcw, Trash2 } from "lucide-react";
import { usePaletteStore } from "@/store/palette-store";
import { useHistoryStore } from "@/store/history-store";
import { useToastStore } from "@/store/toast-store";
import { cn } from "@/lib/utils";
import Link from "next/link";

function relativeTime(ts: number): string {
  const d = Date.now() - ts;
  if (d < 60000) return "just now";
  if (d < 3600000) return `${Math.floor(d / 60000)}m ago`;
  if (d < 86400000) return `${Math.floor(d / 3600000)}h ago`;
  return `${Math.floor(d / 86400000)}d ago`;
}

export function HistoryPanel() {
  const palettes = useHistoryStore((s) => s.palettes);
  const removePalette = useHistoryStore((s) => s.removePalette);
  const setColors = usePaletteStore((s) => s.setColors);
  const setMood = usePaletteStore((s) => s.setMood);
  const addToast = useToastStore((s) => s.addToast);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleRestore = useCallback(
    (p: (typeof palettes)[number]) => {
      setColors(p.colors);
      setMood(p.mood);
      addToast(`Restored palette from ${relativeTime(p.timestamp)}`, "success");
    },
    [setColors, setMood, addToast],
  );

  const handleDelete = useCallback(
    (id: string) => {
      removePalette(id);
      addToast("Removed from history", "info");
    },
    [removePalette, addToast],
  );

  if (palettes.length === 0) return null;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-balance">
          <Clock className="h-4 w-4 text-muted-foreground" />
          Previously Extracted
        </h2>
        <Link
          href="/history"
          className="flex items-center gap-1 text-xs text-muted-foreground/60 transition-colors duration-150 hover:text-foreground"
        >
          View all
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      <div className="relative">
        {/* Gradient fade at edges to hint scrollability */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background to-transparent" />

        <div
          ref={scrollRef}
          className="-mx-6 flex gap-3 overflow-x-auto px-6 pb-2 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {palettes.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                className="shrink-0"
              >
                <div
                  className={cn(
                    "group relative w-[180px] overflow-hidden rounded-xl",
                    "bg-white/[0.03] backdrop-blur-xl",
                    "shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]",
                    "transition-[box-shadow,scale] duration-300 ease-out",
                    "hover:scale-[1.02] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset,0_8px_24px_rgba(0,0,0,0.3)]",
                  )}
                >
                  {/* Color swatches */}
                  <div className="flex h-10 w-full overflow-hidden">
                    {p.colors.map((c, i) => (
                      <div
                        key={`${c.hex}-${i}`}
                        className="h-full flex-1 transition-transform duration-300 ease-out group-hover:scale-105"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs tabular-nums text-muted-foreground">
                        {p.colors[0]?.hex}
                      </span>
                      <span className="text-[10px] text-muted-foreground/60 tabular-nums">
                        {relativeTime(p.timestamp)}
                      </span>
                    </div>

                    {/* Color dots */}
                    <div className="mt-2 flex gap-1">
                      {p.colors.map((c, j) => (
                        <span
                          key={`${c.hex}-${j}`}
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex gap-1.5">
                      <button
                        onClick={() => handleRestore(p)}
                        className={cn(
                          "flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium",
                          "transition-[background-color,color,transform] duration-150 ease-out",
                          "bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08] hover:text-foreground active:scale-[0.96]",
                        )}
                      >
                        <RotateCcw className="h-3 w-3" />
                        Restore
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className={cn(
                          "flex items-center justify-center rounded-lg px-2 py-1.5",
                          "transition-[background-color,color,transform] duration-150 ease-out",
                          "bg-white/[0.04] text-muted-foreground hover:bg-red-400/10 hover:text-red-400 active:scale-[0.96]",
                        )}
                        aria-label="Remove from history"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
