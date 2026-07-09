"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useUploadStore } from "@/store/upload-store";
import { usePaletteStore } from "@/store/palette-store";
import { cn } from "@/lib/utils";

export function ImagePreview() {
  const preview = useUploadStore((s) => s.preview);
  const clearImage = useUploadStore((s) => s.clearImage);
  const isExtracting = usePaletteStore((s) => s.isExtracting);
  const [loaded, setLoaded] = useState(false);

  if (!preview) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", duration: 0.5, bounce: 0 }}
      className="relative overflow-hidden rounded-xl shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]"
    >
      <AnimatePresence>
        {!loaded && (
          <motion.div
            key="shimmer"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center bg-white/[0.03]"
          >
            <div className="h-8 w-8 animate-pulse rounded-full bg-white/[0.06]" />
          </motion.div>
        )}
      </AnimatePresence>

      <img
        src={preview}
        alt="Uploaded preview"
        onLoad={() => setLoaded(true)}
        className={cn(
          "h-auto w-full max-h-[500px] object-contain",
          "outline outline-1 -outline-offset-1 outline-white/10",
          "transition-opacity duration-500 ease-out",
          loaded ? "opacity-100" : "opacity-0"
        )}
      />

      {isExtracting && (
        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/[0.08] px-3 py-1.5 backdrop-blur-xl">
          <svg className="h-3 w-3 animate-spin text-foreground/80" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-xs text-foreground/80">Extracting</span>
        </div>
      )}

      <button
        onClick={clearImage}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-foreground backdrop-blur-xl transition-[background-color,scale] duration-150 ease-out hover:bg-white/[0.12] active:scale-[0.96]"
        aria-label="Remove image"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
