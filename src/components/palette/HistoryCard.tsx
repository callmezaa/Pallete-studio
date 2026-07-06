"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Share2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePaletteStore } from "@/store/palette-store";
import { useHistoryStore } from "@/store/history-store";
import { useToastStore } from "@/store/toast-store";
import { cn } from "@/lib/utils";
import type { SavedPalette } from "@/types";

function relativeTime(ts: number): string {
  const d = Date.now() - ts;
  if (d < 60000) return "just now";
  if (d < 3600000) return `${Math.floor(d / 60000)}m ago`;
  if (d < 86400000) return `${Math.floor(d / 3600000)}h ago`;
  return `${Math.floor(d / 86400000)}d ago`;
}

interface HistoryCardProps {
  palette: SavedPalette;
}

export const cardVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", duration: 0.5, bounce: 0 } as const,
  },
};

export function HistoryCard({ palette }: HistoryCardProps) {
  const router = useRouter();
  const setColors = usePaletteStore((s) => s.setColors);
  const setMood = usePaletteStore((s) => s.setMood);
  const removePalette = useHistoryStore((s) => s.removePalette);
  const addToast = useToastStore((s) => s.addToast);

  const handleRestore = useCallback(() => {
    setColors(palette.colors);
    setMood(palette.mood);
    addToast(`Restored palette from ${relativeTime(palette.timestamp)}`, "success");
    router.push("/");
  }, [palette, setColors, setMood, addToast, router]);

  const handleShare = useCallback(() => {
    const encoded = btoa(JSON.stringify(palette.colors));
    const url = `${window.location.origin}/palette/${encoded}`;
    navigator.clipboard.writeText(url);
    addToast("Share link copied", "success");
  }, [palette.colors, addToast]);

  const handleDelete = useCallback(() => {
    removePalette(palette.id);
    addToast("Removed from history", "info");
  }, [palette.id, removePalette, addToast]);

  return (
    <motion.div
      layout
      variants={cardVariants}
      drag="x"
      dragConstraints={{ left: -80, right: 0 }}
      dragElastic={0.1}
      whileDrag={{ scale: 1, transition: { duration: 0 } }}
      onDragEnd={(_, info) => {
        if (info.offset.x < -60) handleDelete();
      }}
      className={cn(
        "group relative overflow-hidden rounded-xl",
        "bg-white/[0.03] backdrop-blur-xl",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]",
        "hover:scale-[1.02] active:scale-[0.98] touch-manipulation",
        "hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset,0_8px_24px_rgba(0,0,0,0.3)]",
      )}
    >
      <div className="flex h-20 w-full overflow-hidden rounded-t-xl">
        {palette.colors.map((c, i) => (
          <div
            key={`${c.hex}-${i}`}
            className="flex-1 transition-transform duration-500 ease-out group-hover:scale-105"
            style={{ backgroundColor: c.hex }}
          />
        ))}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm tabular-nums">{palette.colors[0]?.hex}</span>
          <span className="text-xs text-muted-foreground/60">{relativeTime(palette.timestamp)}</span>
        </div>

        {palette.mood.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {palette.mood.map((m) => (
              <span
                key={m}
                className="rounded-full bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-muted-foreground"
              >
                {m}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex gap-1.5">
          <button
            onClick={handleRestore}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium",
              "transition-[background-color,color,transform] duration-150 ease-out",
              "bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08] hover:text-foreground active:scale-[0.96]",
            )}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restore
          </button>
          <button
            onClick={handleShare}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium",
              "transition-[background-color,color,transform] duration-150 ease-out",
              "bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08] hover:text-foreground active:scale-[0.96]",
            )}
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>
          <button
            onClick={handleDelete}
            className={cn(
              "flex items-center justify-center rounded-lg px-3 py-2",
              "transition-[background-color,color,transform] duration-150 ease-out",
              "bg-white/[0.04] text-muted-foreground hover:bg-red-400/10 hover:text-red-400 active:scale-[0.96]",
            )}
            aria-label="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
