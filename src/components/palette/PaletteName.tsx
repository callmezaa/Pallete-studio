"use client";

import { usePaletteStore } from "@/store/palette-store";
import { generateColorName } from "@/lib/naming";
import { motion } from "framer-motion";

export function PaletteName() {
  const colors = usePaletteStore((s) => s.colors);
  if (colors.length === 0) return null;

  const name = generateColorName(colors[0].hex);

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-sm text-muted-foreground"
    >
      Palette · <span className="font-medium text-foreground">{name}</span>
    </motion.p>
  );
}
