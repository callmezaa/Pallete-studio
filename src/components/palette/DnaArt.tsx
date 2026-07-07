"use client";

import { useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePaletteStore } from "@/store/palette-store";
import { useToastStore } from "@/store/toast-store";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { DnaHelix } from "./DnaHelix";
import { cn } from "@/lib/utils";
import { Check, Copy, Download } from "lucide-react";

export function DnaArt() {
  const colors = usePaletteStore((s) => s.colors);
  const addToast = useToastStore((s) => s.addToast);
  const { copied, copy } = useCopyToClipboard();
  const exportRef = useRef<(() => Promise<string | null>) | null>(null);
  const [hoveredHex, setHoveredHex] = useState<string | null>(null);

  if (colors.length === 0) return null;

  const handleDownload = useCallback(async () => {
    const dataUrl = await exportRef.current?.();
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "palette-dna-3d.png";
    a.click();
    addToast("DNA downloaded", "success");
  }, [addToast]);

  const handleCopyPng = useCallback(async () => {
    const dataUrl = await exportRef.current?.();
    if (!dataUrl) return;
    const blob = await fetch(dataUrl).then((r) => r.blob());
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      copy("png", "dna-png");
      addToast("PNG copied to clipboard", "success");
    } catch {
      addToast("Failed to copy image", "error");
    }
  }, [addToast, copy]);

  return (
    <div
      className={cn(
        "rounded-xl p-6",
        "bg-white/[0.03] backdrop-blur-xl",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]",
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">DNA</h3>
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium",
              "transition-[background-color,color,transform] duration-150 ease-out",
              "bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08] hover:text-foreground active:scale-[0.96]",
            )}
          >
            <Download className="h-3.5 w-3.5" />
            PNG
          </button>
          <AnimatePresence initial={false} mode="popLayout">
            {copied === "dna-png" ? (
              <motion.span
                key="check"
                initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium",
                  "bg-green-500/20 text-green-500",
                )}
              >
                <Check className="h-3.5 w-3.5" />
                Copied
              </motion.span>
            ) : (
              <motion.button
                key="copy"
                initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                onClick={handleCopyPng}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium",
                  "transition-[background-color,color,transform] duration-150 ease-out",
                  "bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08] hover:text-foreground active:scale-[0.96]",
                )}
              >
                <Copy className="h-3.5 w-3.5" />
                Copy PNG
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative mx-auto max-w-[320px]">
        <DnaHelix exportRef={exportRef} onHover={setHoveredHex} />
        {hoveredHex && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-lg border border-white/[0.08] bg-white/[0.06] px-3 py-1 font-mono text-xs text-foreground/80 backdrop-blur-xl">
            {hoveredHex}
          </div>
        )}
      </div>
    </div>
  );
}
