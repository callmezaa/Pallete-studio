"use client";
import { motion } from "framer-motion";
import { usePaletteStore } from "@/store/palette-store";
import { HeroPreview } from "./HeroPreview";
import { CardPreview } from "./CardPreview";
import { ButtonPreview } from "./ButtonPreview";
import { NavbarPreview } from "./NavbarPreview";
import { BadgePreview } from "./BadgePreview";
import { InputPreview } from "./InputPreview";
import { GlassCardPreview } from "./GlassCardPreview";

const itemVariants = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export function UIPreview() {
  const colors = usePaletteStore((s) => s.colors);
  if (colors.length === 0) return null;
  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold tracking-tight">UI Preview</h2>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="space-y-6"
      >
        <motion.div variants={itemVariants}>
          <HeroPreview />
        </motion.div>
        <motion.div variants={itemVariants} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <CardPreview />
          <GlassCardPreview />
          <NavbarPreview />
        </motion.div>
        <motion.div variants={itemVariants}>
          <ButtonPreview />
        </motion.div>
        <motion.div variants={itemVariants}>
          <BadgePreview />
        </motion.div>
        <motion.div variants={itemVariants}>
          <InputPreview />
        </motion.div>
      </motion.div>
    </section>
  );
}
