"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const THRESHOLD = 400;

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > THRESHOLD);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-top"
          onClick={scrollToTop}
          initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.25, filter: "blur(4px)" }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.25, filter: "blur(4px)" }}
          transition={{ type: "spring", duration: 0.4, bounce: 0 }}
          aria-label="Scroll to top"
          className={cn(
            "fixed bottom-8 right-8 z-40 flex h-10 w-10 items-center justify-center rounded-full",
            "bg-white/[0.04] backdrop-blur-xl",
            "shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_4px_12px_rgba(0,0,0,0.3)]",
            "text-muted-foreground/70 transition-[background-color,color] duration-200",
            "hover:bg-white/[0.08] hover:text-foreground/90",
            "active:scale-[0.96]",
          )}
        >
          <ArrowUp className="h-4 w-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
