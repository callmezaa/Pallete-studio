"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { useHistoryStore } from "@/store/history-store";
import { useToastStore } from "@/store/toast-store";
import { HistoryCard, cardVariants } from "@/components/palette/HistoryCard";
import { cn } from "@/lib/utils";

export default function HistoryPage() {
  const palettes = useHistoryStore((s) => s.palettes);
  const clearHistory = useHistoryStore((s) => s.clearHistory);
  const addToast = useToastStore((s) => s.addToast);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (!clearing) return;
    const t = setTimeout(() => setClearing(false), 2500);
    return () => clearTimeout(t);
  }, [clearing]);

  const handleClearAll = () => {
    if (!clearing) {
      setClearing(true);
      return;
    }
    clearHistory();
    addToast("History cleared", "info");
    setClearing(false);
  };

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>

          <h1 className="text-lg font-semibold tracking-tight text-balance">History</h1>

          {palettes.length > 0 && (
            <button
              onClick={handleClearAll}
              className={cn(
                "text-sm transition-[color,transform] duration-150 active:scale-[0.96]",
                clearing
                  ? "text-red-400 hover:text-red-300"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {clearing ? "Sure?" : "Clear All"}
            </button>
          )}
        </div>

        {palettes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.04]">
              <Clock className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <h2 className="text-lg font-medium text-foreground text-balance">No saved palettes yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Extract colors on the home page and they&apos;ll appear here.
            </p>
            <Link
              href="/"
              className={cn(
                "mt-8 flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm",
                "bg-white/[0.04] text-muted-foreground",
                "transition-[background-color,color] duration-150 ease-out",
                "hover:bg-white/[0.08] hover:text-foreground",
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              <motion.div
                key="grid"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } },
                }}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {palettes.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    variants={cardVariants}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      filter: "blur(4px)",
                      transition: { duration: 0.2 },
                    }}
                    className="[&:not(:last-child)]:..."
                  >
                    <HistoryCard palette={p} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            <p className="mt-10 text-center text-xs text-muted-foreground/50 tabular-nums">
              Showing {palettes.length} {palettes.length === 1 ? "palette" : "palettes"}
            </p>
          </>
        )}
      </div>
    </main>
  );
}
