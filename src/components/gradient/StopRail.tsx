"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { hexToRgb } from "@/lib/colors";
import { Plus, X } from "lucide-react";
import { useState, useRef } from "react";

export interface Stop {
  id: string;
  hex: string;
  position: number;
}

interface Props {
  stops: Stop[];
  paletteHexes: string[];
  onChange: (stops: Stop[]) => void;
}

function lerpRgb(a: string, b: string, t: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const r = Math.round(ca.r + (cb.r - ca.r) * t);
  const g = Math.round(ca.g + (cb.g - ca.g) * t);
  const bb = Math.round(ca.b + (cb.b - ca.b) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bb.toString(16).padStart(2, "0")}`;
}

export function StopRail({ stops, paletteHexes, onChange }: Props) {
  const railRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleDrag = (id: string, clientX: number, railRect: DOMRect) => {
    const pos = Math.max(0, Math.min(1, (clientX - railRect.left) / railRect.width));
    const idx = stops.findIndex((s) => s.id === id);
    if (idx === -1) return;

    const minPos = idx > 0 ? stops[idx - 1].position + 0.01 : 0;
    const maxPos = idx < stops.length - 1 ? stops[idx + 1].position - 0.01 : 1;
    const clampedPos = Math.max(minPos, Math.min(maxPos, pos));

    const next = [...stops];
    next[idx] = { ...next[idx], position: clampedPos };
    onChange(next);
  };

  const handleTap = (id: string) => {
    const idx = stops.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const colorIdx = paletteHexes.indexOf(stops[idx].hex);
    const nextHex = paletteHexes[(colorIdx + 1) % paletteHexes.length];
    const next = [...stops];
    next[idx] = { ...next[idx], hex: nextHex };
    onChange(next);
  };

  const handleAdd = () => {
    let maxGap = 0;
    let gapIdx = 0;
    for (let i = 1; i < stops.length; i++) {
      const gap = stops[i].position - stops[i - 1].position;
      if (gap > maxGap) {
        maxGap = gap;
        gapIdx = i;
      }
    }
    const pos = (stops[gapIdx - 1].position + stops[gapIdx].position) / 2;
    const hex = lerpRgb(stops[gapIdx - 1].hex, stops[gapIdx].hex, 0.5);
    const id = `stop-${Date.now()}`;
    const next = [...stops];
    next.splice(gapIdx, 0, { id, hex, position: pos });
    onChange(next);
  };

  const handleRemove = (id: string) => {
    if (stops.length <= 2) return;
    onChange(stops.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-2">
      <div ref={railRef} className="relative h-8 w-full">
        <div
          className="absolute inset-x-2 top-1/2 h-2 -translate-y-1/2 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${stops
              .map((s) => `${s.hex} ${(s.position * 100).toFixed(0)}%`)
              .join(", ")})`,
          }}
        />

        {stops.map((stop, i) => (
          <motion.div
            key={stop.id}
            className={cn(
              "absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2",
              "h-5 w-5 cursor-grab rounded-full active:cursor-grabbing",
              "shadow-[0_0_0_2px_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.3)]",
              "transition-shadow duration-150 hover:shadow-[0_0_0_3px_rgba(255,255,255,0.9),0_2px_12px_rgba(0,0,0,0.4)]",
            )}
            style={{
              left: `${stop.position * 100}%`,
              backgroundColor: stop.hex,
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0}
            onDrag={(_, info) => {
              if (!railRef.current) return;
              handleDrag(stop.id, info.point.x, railRef.current.getBoundingClientRect());
            }}
            dragMomentum={false}
            onTap={() => handleTap(stop.id)}
            onHoverStart={() => setHoveredId(stop.id)}
            onHoverEnd={() => setHoveredId(null)}
            layout
            transition={{ type: "spring", bounce: 0.3, duration: 0.3 }}
          >
            {hoveredId === stop.id && stops.length > 2 && (
              <button
                onPointerDown={(e) => {
                  e.stopPropagation();
                  handleRemove(stop.id);
                }}
                className={cn(
                  "absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full",
                  "bg-red-500 text-white",
                  "shadow-[0_1px_4px_rgba(0,0,0,0.3)]",
                )}
              >
                <X className="h-2.5 w-2.5" />
              </button>
            )}
          </motion.div>
        ))}
      </div>

      <button
        onClick={handleAdd}
        className={cn(
          "flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
          "bg-white/[0.04] text-muted-foreground",
          "transition-[background-color,color,transform] duration-150 active:scale-[0.96]",
          "hover:bg-white/[0.08] hover:text-foreground",
        )}
      >
        <Plus className="h-3 w-3" />
        Add Stop
      </button>
    </div>
  );
}
