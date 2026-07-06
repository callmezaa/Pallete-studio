"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb, X } from "lucide-react";

interface FirstVisitTipProps {
  show: boolean;
  onDismiss: () => void;
}

export function FirstVisitTip({ show, onDismiss }: FirstVisitTipProps) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onDismiss, 5000);
    const onPaste = () => onDismiss();
    document.addEventListener("paste", onPaste);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("paste", onPaste);
    };
  }, [show, onDismiss]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.96, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, scale: 0.96, filter: "blur(4px)" }}
          transition={{ type: "spring", duration: 0.5, bounce: 0 }}
          className="mb-4 flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 backdrop-blur-xl"
        >
          <Lightbulb className="h-4 w-4 shrink-0 text-amber-400" />
          <p className="flex-1 text-sm text-muted-foreground">
            Press{" "}
            <kbd className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[11px]">
              ⌘V
            </kbd>{" "}
            to paste an image from your clipboard
          </p>
          <button
            onClick={onDismiss}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-[background-color,transform] duration-150 hover:bg-white/[0.08] active:scale-[0.96]"
            aria-label="Dismiss tip"
          >
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
