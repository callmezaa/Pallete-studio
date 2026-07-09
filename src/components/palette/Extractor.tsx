"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Palette } from "lucide-react";
import { useColorExtraction } from "@/hooks/useColorExtraction";
import { usePaletteStore } from "@/store/palette-store";
import { useUploadStore } from "@/store/upload-store";
import { PaletteGrid } from "./PaletteGrid";
import { PaletteSkeleton } from "@/components/ui/PaletteSkeleton";
import { ScrollHint } from "@/components/ui/ScrollHint";
import { cn } from "@/lib/utils";

function EmptyState() {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
      transition={{ type: "spring", duration: 0.4, bounce: 0 }}
      className={cn(
        "flex flex-col items-center justify-center rounded-xl",
        "bg-white/[0.03] p-16 text-center",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]",
      )}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.04]">
        <Palette className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">Discover your colors</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Drop an image above to extract its palette
      </p>
    </motion.div>
  );
}

function SkeletonView() {
  return (
    <motion.div
      key="skeleton"
      initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
      transition={{ type: "spring", duration: 0.4, bounce: 0 }}
    >
      <PaletteSkeleton />
    </motion.div>
  );
}

function GridView() {
  return (
    <motion.div
      key="grid"
      initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
      transition={{ type: "spring", duration: 0.4, bounce: 0 }}
    >
      <PaletteGrid />
      <ScrollHint />
    </motion.div>
  );
}

export function Extractor() {
  useColorExtraction();
  const colors = usePaletteStore((s) => s.colors);
  const isExtracting = usePaletteStore((s) => s.isExtracting);
  const preview = useUploadStore((s) => s.preview);

  const state = colors.length > 0 ? "grid" : isExtracting || preview ? "skeleton" : "empty";

  return (
    <AnimatePresence mode="popLayout">
      {state === "empty" && <EmptyState />}
      {state === "skeleton" && <SkeletonView />}
      {state === "grid" && <GridView />}
    </AnimatePresence>
  );
}
