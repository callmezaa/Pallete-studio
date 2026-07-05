"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { usePaletteStore } from "@/store/palette-store";
import { useUIStore } from "@/store/ui-store";
import { generateCssGradient } from "@/lib/gradients";
import { GRADIENT_TYPES } from "@/constants";
import { cn } from "@/lib/utils";

export function GradientControls() {
  const colors = usePaletteStore((s) => s.colors);
  const gradientType = useUIStore((s) => s.gradientType);
  const setGradientType = useUIStore((s) => s.setGradientType);
  const [copied, setCopied] = useState<string | null>(null);

  if (colors.length < 2) return null;

  const hexes = colors.map((c) => c.hex);
  const css = generateCssGradient(gradientType, hexes);

  const copyCss = async () => {
    await navigator.clipboard.writeText(css);
    setCopied("css");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {GRADIENT_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setGradientType(type)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors",
              gradientType === type
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-accent"
            )}
          >
            {type}
          </button>
        ))}
      </div>
      <button
        onClick={copyCss}
        className="flex items-center gap-1.5 rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent"
      >
        {copied === "css" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied === "css" ? "Copied!" : "Copy CSS"}
      </button>
    </div>
  );
}
