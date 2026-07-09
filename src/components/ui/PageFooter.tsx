"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, ExternalLink, Palette, Upload } from "lucide-react";
import { usePaletteStore } from "@/store/palette-store";
import { useToastStore } from "@/store/toast-store";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

export function PageFooter() {
  const colors = usePaletteStore((s) => s.colors);
  const addToast = useToastStore((s) => s.addToast);
  const reduced = useReducedMotion();
  const hasPalette = colors.length > 0;
  const [shareCopied, setShareCopied] = useState(false);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" });
  }, [reduced]);

  const scrollToExport = useCallback(() => {
    const el = document.getElementById("export-panel");
    if (el) el.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
  }, [reduced]);

  const copyShareLink = useCallback(() => {
    try {
      const json = btoa(JSON.stringify(colors));
      const url = `${window.location.origin}/palette/${json}`;
      navigator.clipboard.writeText(url);
      setShareCopied(true);
      addToast("Share link copied", "success");
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      addToast("Failed to create share link", "error");
    }
  }, [colors, addToast]);

  return (
    <footer className={cn(
      "relative overflow-hidden rounded-xl p-8 sm:p-10",
      "bg-white/[0.03] backdrop-blur-xl",
      "shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]",
    )}>
      {/* Subtle gradient accent line at top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative">
        {/* Brand */}
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.06]">
              <Palette className="h-3.5 w-3.5 text-foreground/80" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-foreground/90">
              Palette Studio
            </span>
          </div>
          <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground/60 max-w-xs">
            Discover the visual identity hidden inside every image
          </p>
        </div>

        {/* CTA Actions */}
        <AnimatePresence mode="popLayout">
          {hasPalette && (
            <motion.div
              key="cta-actions"
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:justify-start"
            >
              <button
                onClick={copyShareLink}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition-all duration-150",
                  "bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08] hover:text-foreground",
                  "active:scale-[0.96]",
                )}
              >
                {shareCopied ? (
                  <><Check className="h-3.5 w-3.5 text-green-400" /> Copied</>
                ) : (
                  <><Copy className="h-3.5 w-3.5" /> Copy share link</>
                )}
              </button>

              <button
                onClick={scrollToExport}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition-all duration-150",
                  "bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08] hover:text-foreground",
                  "active:scale-[0.96]",
                )}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Export palette
              </button>

              <button
                onClick={scrollToTop}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium transition-all duration-150",
                  "bg-white/10 text-foreground/90 hover:bg-white/[0.14]",
                  "shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset]",
                  "active:scale-[0.96]",
                )}
              >
                <Upload className="h-3.5 w-3.5" />
                Upload new image
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Credit */}
        <div className="mt-8 pt-5 text-center text-[10px] text-muted-foreground/30 sm:text-left" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          Built with Next.js, Three.js, and passion
        </div>
      </div>
    </footer>
  );
}
