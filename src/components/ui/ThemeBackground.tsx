"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePaletteStore } from "@/store/palette-store";

export function ThemeBackground() {
  const colors = usePaletteStore((s) => s.colors);
  const dominantColor = usePaletteStore((s) => s.dominantColor);
  const hasColors = colors.length >= 2;

  useEffect(() => {
    if (dominantColor) {
      document.documentElement.style.setProperty("--focus-ring", dominantColor);
    } else {
      document.documentElement.style.removeProperty("--focus-ring");
    }
  }, [dominantColor]);

  const gradient = hasColors
    ? `linear-gradient(135deg, ${colors[0].hex}15, ${colors[1].hex}10)`
    : "transparent";

  return (
    <AnimatePresence initial={false}>
      {hasColors && (
        <motion.div
          key={gradient}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 -z-10"
          style={{ background: gradient }}
        />
      )}
    </AnimatePresence>
  );
}
