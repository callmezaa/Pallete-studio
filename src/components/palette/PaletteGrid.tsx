"use client";

import { Reorder } from "framer-motion";
import { usePaletteStore } from "@/store/palette-store";
import { ColorCard } from "./ColorCard";

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", duration: 0.5, bounce: 0 } as const,
  },
};

export function PaletteGrid() {
  const colors = usePaletteStore((s) => s.colors);
  const setColors = usePaletteStore((s) => s.setColors);
  if (colors.length === 0) return null;

  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold tracking-tight">Palette</h2>
      <Reorder.Group
        axis="y"
        values={colors}
        onReorder={setColors}
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.08 } },
        }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      >
        {colors.map((color, i) => (
          <Reorder.Item key={`${color.hex}-${i}`} value={color} variants={itemVariants}>
            <ColorCard color={color} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </section>
  );
}
