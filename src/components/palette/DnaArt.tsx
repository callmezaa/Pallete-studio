"use client";

import { useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePaletteStore } from "@/store/palette-store";
import { useToastStore } from "@/store/toast-store";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { DnaHelix } from "./DnaHelix";
import { cn } from "@/lib/utils";
import { Check, Copy, Download, Dna } from "lucide-react";

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
        "overflow-hidden rounded-xl",
        "bg-white/[0.03] backdrop-blur-xl",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_8px_32px_rgba(0,0,0,0.2)]",
      )}
    >
      <div className="flex items-center justify-between px-6 pt-5 pb-1">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04]">
            <Dna className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-base font-semibold tracking-tight text-foreground text-balance">
              DNA Helix
            </h3>
            <p className="text-[11px] text-muted-foreground/60">
              Interactive 3D visualization of your palette
            </p>
          </div>
        </div>
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

      <div className="relative mt-2 h-[480px] w-full">
        {/* Subtle vignette overlay */}
        <div className="pointer-events-none absolute inset-0 z-10 rounded-b-2xl bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.3)_100%)]" />

        <DnaHelix exportRef={exportRef} onHover={setHoveredHex} />

        {hoveredHex && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-xl border border-white/[0.08] bg-black/40 px-4 py-2 font-mono text-sm tracking-tight text-foreground/90 backdrop-blur-2xl"
          >
            {hoveredHex}
          </motion.div>
        )}

        {/* Bottom gradient edge */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-12 bg-gradient-to-t from-background/40 to-transparent" />
      </div>
    </div>
  );
}
