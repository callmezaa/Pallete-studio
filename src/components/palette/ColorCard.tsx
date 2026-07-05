"use client";

import { motion } from "framer-motion";
import { Check, Pin, PinOff } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { usePaletteStore } from "@/store/palette-store";
import { ColorFormat } from "./ColorFormat";
import { cn } from "@/lib/utils";
import type { ExtractedColor } from "@/types";

interface ColorCardProps {
  color: ExtractedColor;
  index: number;
}

export function ColorCard({ color, index }: ColorCardProps) {
  const { copied, copy } = useCopyToClipboard();
  const togglePin = usePaletteStore((s) => s.togglePin);
  const pinnedColors = usePaletteStore((s) => s.pinnedColors);
  const isPinned = pinnedColors.includes(color.hex);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onDoubleClick={() => togglePin(color.hex)}
      className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20"
    >
      <div
        className="h-32 w-full transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundColor: color.hex }}
      />
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-sm tabular-nums">{color.hex}</span>
          <span className="text-xs text-muted-foreground">{color.percentage}%</span>
        </div>
        <ColorFormat color={color} />
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => copy(color.hex, color.hex)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-colors",
              copied === color.hex
                ? "bg-green-500/20 text-green-500"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
            aria-label={`Copy ${color.hex}`}
          >
            {copied === color.hex ? (
              <><Check className="h-3.5 w-3.5" /> Copied</>
            ) : (
              "Copy"
            )}
          </button>
          <button
            onClick={() => togglePin(color.hex)}
            className={cn(
              "flex items-center justify-center rounded-lg px-3 py-2 transition-colors",
              isPinned
                ? "bg-foreground/10 text-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            )}
            aria-label={isPinned ? "Unpin color" : "Pin color"}
          >
            {isPinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
