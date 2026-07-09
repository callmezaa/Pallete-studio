"use client";

import { useState } from "react";
import { Reorder } from "framer-motion";
import { Check, Share2 } from "lucide-react";
import { usePaletteStore } from "@/store/palette-store";
import { useToastStore } from "@/store/toast-store";
import { ColorCard } from "./ColorCard";
import { cn } from "@/lib/utils";

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", duration: 0.5, bounce: 0 } as const,
  },
};

export function PaletteGrid() {
  const colors = usePaletteStore((s) => s.colors);
  const setColors = usePaletteStore((s) => s.setColors);
  const addToast = useToastStore((s) => s.addToast);
  const [copied, setCopied] = useState(false);

  const copyShareLink = () => {
    try {
      const json = btoa(JSON.stringify(colors));
      const url = `${window.location.origin}/palette/${json}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      addToast("Share link copied", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast("Failed to create share link", "error");
    }
  };

  if (colors.length === 0) return null;

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-balance">Palette</h2>
        <button
          onClick={copyShareLink}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150",
            "active:scale-[0.96]",
            copied
              ? "bg-green-500/15 text-green-400"
              : "bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08] hover:text-foreground",
          )}
        >
          {copied ? (
            <><Check className="h-3.5 w-3.5" /> Copied</>
          ) : (
            <><Share2 className="h-3.5 w-3.5" /> Share</>
          )}
        </button>
      </div>
      <Reorder.Group
        axis="y"
        values={colors}
        onReorder={setColors}
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.08 } },
        }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      >
        {colors.map((color, i) => (
          <Reorder.Item key={`${color.hex}-${i}`} value={color} variants={itemVariants}>
            <ColorCard color={color} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </section>
  );
}
