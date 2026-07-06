"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { usePaletteStore } from "@/store/palette-store";
import { detectRelationships, RELATIONSHIP_COLORS } from "@/lib/harmony";
import { ColorWheelView } from "./ColorWheelView";
import { ForceGraph } from "./ForceGraph";
import { cn } from "@/lib/utils";

type ViewMode = "wheel" | "graph";

export function RelationshipMap() {
  const colors = usePaletteStore((s) => s.colors);
  const [mode, setMode] = useState<ViewMode>("wheel");
  const [activeTypes, setActiveTypes] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [hoveredPair, setHoveredPair] = useState<{ a: string; b: string } | null>(null);

  const harmony = useMemo(() => detectRelationships(colors), [colors]);

  const allTypes = harmony.types;
  const resolvedTypes = activeTypes.length === 0 ? allTypes : activeTypes;

  if (colors.length < 2) return null;

  return (
    <div
      className={cn(
        "rounded-xl p-6",
        "bg-white/[0.03] backdrop-blur-xl",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]",
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">
          Color Relationship Map
        </h3>
        <div className="relative flex rounded-full bg-white/[0.04] p-0.5">
          {(["wheel", "graph"] as ViewMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "relative z-10 px-3 py-1 text-xs font-medium capitalize active:scale-[0.96] transition-transform duration-150",
              )}
            >
              {mode === m && (
                <motion.div
                  layoutId="rel-mode-bg"
                  className="absolute inset-0 rounded-full bg-foreground"
                  transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                />
              )}
              <span
                className={cn(
                  "relative z-10 transition-colors duration-150",
                  mode === m ? "text-background" : "text-muted-foreground",
                )}
              >
                {m}
              </span>
            </button>
          ))}
        </div>
      </div>

      {allTypes.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {allTypes.map((type) => {
            const active = resolvedTypes.includes(type);
            return (
              <button
                key={type}
                onClick={() => {
                  setActiveTypes((prev) =>
                    prev.includes(type)
                      ? prev.filter((t) => t !== type)
                      : [...prev, type],
                  );
                }}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-medium capitalize transition-[background-color,box-shadow,color,transform] duration-150 active:scale-[0.96]",
                  active
                    ? "text-white"
                    : "bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08]",
                )}
                style={
                  active
                    ? {
                        backgroundColor: RELATIONSHIP_COLORS[type] + "25",
                        boxShadow: `0 0 0 1px ${RELATIONSHIP_COLORS[type]}50`,
                      }
                    : undefined
                }
              >
                <span
                  className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle"
                  style={{ backgroundColor: RELATIONSHIP_COLORS[type] }}
                />
                {type.replace("-", " ")}
              </button>
            );
          })}
        </div>
      )}

      {mode === "wheel" ? (
        <ColorWheelView
          colors={colors}
          relationships={harmony.pairs}
          activeTypes={resolvedTypes}
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
          onHoverPair={setHoveredPair}
        />
      ) : (
        <ForceGraph
          colors={colors}
          relationships={harmony.pairs}
          activeTypes={resolvedTypes}
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
          onHoverPair={setHoveredPair}
        />
      )}

      {allTypes.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
          {allTypes.map((type) => {
            const count = harmony.pairs.filter((r) => r.type === type).length;
            return (
              <span key={type} className="flex items-center gap-1.5 capitalize">
                <span
                  className="inline-block h-2 w-4 rounded-sm"
                  style={{ backgroundColor: RELATIONSHIP_COLORS[type] }}
                />
                {type.replace("-", " ")} · {count}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
