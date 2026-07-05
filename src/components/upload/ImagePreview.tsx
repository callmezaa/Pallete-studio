"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useUploadStore } from "@/store/upload-store";

export function ImagePreview() {
  const preview = useUploadStore((s) => s.preview);
  const clearImage = useUploadStore((s) => s.clearImage);

  if (!preview) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-2xl"
    >
      <img
        src={preview}
        alt="Uploaded preview"
        className="h-auto w-full max-h-[500px] object-contain"
      />
      <button
        onClick={clearImage}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-background"
        aria-label="Remove image"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
