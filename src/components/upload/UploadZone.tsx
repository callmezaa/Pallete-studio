"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Upload, Image as ImageIcon } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { cn } from "@/lib/utils";

export function UploadZone() {
  const { getRootProps, getInputProps, isDragActive } = useImageUpload();

  return (
    <motion.div
      {...(getRootProps() as any)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", duration: 0.6, bounce: 0 }}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-2xl p-16 text-center",
        "transition-[scale,box-shadow,background-color] duration-300 ease-out",
        "active:scale-[0.98]",
        "bg-white/[0.02] backdrop-blur-xl",
        isDragActive
          ? "bg-white/[0.06] shadow-[0_0_0_1px_rgba(255,255,255,0.2)_inset,0_0_40px_rgba(255,255,255,0.04)]"
          : "shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset]"
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 0.5px, transparent 0.5px)",
          backgroundSize: "24px 24px",
        }}
      />
      <input {...getInputProps()} />
      <div className="relative">
        <div
          className={cn(
            "mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full",
            "transition-[background-color,box-shadow] duration-300 ease-out",
            isDragActive
              ? "bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.06)]"
              : "bg-white/[0.04]"
          )}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {isDragActive ? (
              <motion.span
                key="active-icon"
                initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                transition={{ type: "spring", duration: 0.3, bounce: 0 }}
              >
                <ImageIcon className="h-6 w-6 text-foreground" />
              </motion.span>
            ) : (
              <motion.span
                key="inactive-icon"
                initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                transition={{ type: "spring", duration: 0.3, bounce: 0 }}
              >
                <Upload className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-foreground/80" />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence initial={false} mode="popLayout">
          {isDragActive ? (
            <motion.div
              key="drop-text"
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <p className="text-lg font-medium text-balance">Drop your image here</p>
            </motion.div>
          ) : (
            <motion.div
              key="idle-text"
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <p className="text-lg font-medium text-balance">Drop an image here</p>
              <p className="mt-1 text-sm text-muted-foreground">
                or click to browse · PNG, JPG, WEBP up to 10MB
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                or press{" "}
                <kbd className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[11px]">
                  ⌘V
                </kbd>{" "}
                to paste
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
