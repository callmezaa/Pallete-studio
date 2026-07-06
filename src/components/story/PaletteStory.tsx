"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, SkipForward } from "lucide-react";
import { usePaletteStore } from "@/store/palette-store";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { formatColor } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { StoryBackground } from "./StoryBackground";

type Phase = "idle" | "ambient" | "cascade" | "composition" | "metadata" | "complete";

const TIMING = {
  ambient: 800,
  cascadeStep: 400,
  cascadeSettle: 600,
  composition: 1500,
  metadata: 1000,
};

const spring = { type: "spring" as const, bounce: 0.35, duration: 0.6 };
const springGentle = { type: "spring" as const, bounce: 0.2, duration: 0.8 };

export function PaletteStory() {
  const colors = usePaletteStore((s) => s.colors);
  const mood = usePaletteStore((s) => s.mood);
  const { copied, copy } = useCopyToClipboard();

  const [phase, setPhase] = useState<Phase>("idle");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timeouts = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  }, []);

  const go = useCallback(
    (next: Phase, delay: number) => {
      const id = window.setTimeout(() => setPhase(next), delay);
      timeouts.current.push(id);
    },
    [],
  );

  const startStory = useCallback(() => {
    clearTimers();
    setIsPlaying(true);
    setCurrentIdx(0);
    setPhase("ambient");

    go("cascade", TIMING.ambient);

    colors.forEach((_, i) => {
      const t = TIMING.ambient + TIMING.cascadeStep * (i + 1);
      const id = window.setTimeout(() => setCurrentIdx(i + 1), t);
      timeouts.current.push(id);
    });

    const cascadeEnd =
      TIMING.ambient + TIMING.cascadeStep * colors.length + TIMING.cascadeSettle;
    go("composition", cascadeEnd);
    go("metadata", cascadeEnd + TIMING.composition);
    go("complete", cascadeEnd + TIMING.composition + TIMING.metadata);
  }, [colors, clearTimers, go]);

  const skip = useCallback(() => {
    clearTimers();
    setPhase("complete");
    setCurrentIdx(colors.length);
    setIsPlaying(false);
  }, [colors.length, clearTimers]);

  useEffect(() => {
    if (phase === "complete") setIsPlaying(false);
  }, [phase]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const activeColor = useMemo(
    () =>
      phase === "cascade" && currentIdx > 0
        ? colors[currentIdx - 1]?.hex
        : phase === "ambient"
          ? colors[0]?.hex
          : undefined,
    [phase, currentIdx, colors],
  );

  if (colors.length === 0) return null;

  const paletteName = useMemo(() => {
    const names = colors.map((c) => c.name);
    return names.length <= 3 ? names.join(" & ") : `${names[0]} + ${names.length - 1}`;
  }, [colors]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl",
        "bg-black/20 backdrop-blur-xl",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]",
      )}
    >
      <div className="relative min-h-[280px]">
        <StoryBackground colors={colors} phase={phase} activeColor={activeColor} />

        {isPlaying && (
          <button
            onClick={skip}
            className="absolute right-4 top-4 z-20 flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-muted-foreground transition-[background-color,color] duration-150 hover:bg-white/[0.12] hover:text-foreground"
          >
            <SkipForward className="h-3 w-3" />
            Skip
          </button>
        )}

        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 flex min-h-[280px] flex-col items-center justify-center gap-4"
            >
              <button
                onClick={startStory}
                className={cn(
                  "group flex items-center gap-2.5 rounded-full px-6 py-3",
                  "bg-white/[0.06] text-sm font-medium text-foreground",
                  "transition-[background-color,transform] duration-200",
                  "hover:bg-white/[0.12] hover:scale-105 active:scale-95",
                  "shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset]",
                )}
              >
                <Play className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                Play Story
              </button>
              <p className="text-xs text-muted-foreground">
                Watch your palette come alive
              </p>
            </motion.div>
          )}

          {phase === "ambient" && (
            <motion.div
              key="ambient"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 flex min-h-[280px] items-center justify-center"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="h-16 w-16 rounded-full"
                style={{ backgroundColor: colors[0]?.hex ?? "#666" }}
              />
            </motion.div>
          )}

          {phase === "cascade" && (
            <motion.div
              key="cascade"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 flex min-h-[280px] items-center justify-center"
            >
              <div className="flex items-end gap-6">
                {colors.slice(0, currentIdx).map((color, i) => (
                  <motion.div
                    key={color.hex}
                    initial={{ scale: 0, opacity: 0, filter: "blur(12px)" }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      filter: "blur(0px)",
                      rotate: i === currentIdx - 1 ? [-4, 0] : 0,
                    }}
                    transition={{
                      ...spring,
                      rotate: { ...spring, delay: 0.1 },
                    }}
                    className="flex flex-col items-center gap-2"
                  >
                    <motion.div
                      className="h-24 w-24 rounded-xl shadow-2xl"
                      style={{ backgroundColor: color.hex }}
                      animate={
                        i === currentIdx - 1
                          ? {
                              boxShadow: [
                                `0 0 40px ${color.hex}60`,
                                `0 0 20px ${color.hex}30`,
                                `0 0 0px transparent`,
                              ],
                            }
                          : {}
                      }
                      transition={{ duration: 0.8 }}
                    />
                    <motion.span
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.3 }}
                      className="font-mono text-[11px] text-foreground/70"
                    >
                      {color.hex}
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {phase === "composition" && (
            <motion.div
              key="composition"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 flex min-h-[280px] flex-col items-center justify-center gap-5"
            >
              <motion.div
                layout
                className="flex gap-1"
                transition={springGentle}
              >
                {colors.map((color) => (
                  <motion.div
                    key={color.hex}
                    layoutId={`story-swatch-${color.hex}`}
                    transition={springGentle}
                    className="flex flex-col items-center gap-2"
                  >
                    <motion.div
                      className="h-20 w-20 rounded-xl shadow-lg"
                      style={{ backgroundColor: color.hex }}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={springGentle}
                    />
                    <span className="font-mono text-[10px] text-foreground/60">
                      {color.hex}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex gap-0"
              >
                {colors.map((color) => (
                  <div
                    key={color.hex}
                    className="h-2 first:rounded-l-full last:rounded-r-full"
                    style={{
                      backgroundColor: color.hex,
                      width: `${Math.max(color.percentage, 10)}px`,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}

          {phase === "metadata" && (
            <motion.div
              key="metadata"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 flex min-h-[280px] flex-col items-center justify-center gap-4"
            >
              <motion.div
                layout
                className="flex gap-1"
                transition={springGentle}
              >
                {colors.map((color) => (
                  <motion.div
                    key={color.hex}
                    layoutId={`story-swatch-${color.hex}`}
                    transition={springGentle}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <div
                      className="h-16 w-16 rounded-xl shadow-lg cursor-pointer"
                      style={{ backgroundColor: color.hex }}
                      onClick={() =>
                        copy(formatColor(color, "hex"), `story-${color.hex}`)
                      }
                    />
                    <span className="font-mono text-[9px] text-foreground/50">
                      {copied === `story-${color.hex}` ? "Copied!" : color.hex}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-center"
              >
                <p className="text-sm font-medium text-foreground/80">
                  {paletteName}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap justify-center gap-1.5"
              >
                {mood.map((m, i) => (
                  <motion.span
                    key={m}
                    initial={{ opacity: 0, scale: 0.7, filter: "blur(4px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ delay: 0.5 + i * 0.1, ...spring }}
                    className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[10px] font-medium capitalize text-foreground/60"
                  >
                    {m}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          )}

          {phase === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 flex min-h-[280px] flex-col items-center justify-center gap-4"
            >
              <div className="flex gap-1">
                {colors.map((color) => (
                  <div
                    key={color.hex}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <div
                      className="h-16 w-16 cursor-pointer rounded-xl shadow-lg transition-transform duration-150 hover:scale-105"
                      style={{ backgroundColor: color.hex }}
                      onClick={() =>
                        copy(formatColor(color, "hex"), `story-${color.hex}`)
                      }
                    />
                    <span className="font-mono text-[9px] text-foreground/50">
                      {copied === `story-${color.hex}` ? "Copied!" : color.hex}
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <p className="text-sm font-medium text-foreground/80">
                  {paletteName}
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-1.5">
                {mood.map((m) => (
                  <span
                    key={m}
                    className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[10px] font-medium capitalize text-foreground/60"
                  >
                    {m}
                  </span>
                ))}
              </div>

              <button
                onClick={startStory}
                className="mt-1 flex items-center gap-1.5 rounded-full bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-muted-foreground transition-[background-color,color] duration-150 hover:bg-white/[0.08] hover:text-foreground"
              >
                <Play className="h-3 w-3" />
                Replay
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
