"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { usePaletteStore } from "@/store/palette-store";
import { useUIStore } from "@/store/ui-store";
import { useToastStore } from "@/store/toast-store";
import { GRADIENT_TYPES } from "@/constants";
import { generateGradientOutput } from "@/lib/gradients";
import { GradientCanvas } from "./GradientCanvas";
import { StopRail, type Stop } from "./StopRail";
import { AngleControl } from "./AngleControl";
import { cn } from "@/lib/utils";

export function GradientPhysics() {
  const colors = usePaletteStore((s) => s.colors);
  const gradientType = useUIStore((s) => s.gradientType);
  const setGradientType = useUIStore((s) => s.setGradientType);
  const addToast = useToastStore((s) => s.addToast);

  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<Stop[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (colors.length === 0) {
      setStops([]);
      return;
    }
    setStops(
      colors.map((c, i) => ({
        id: `stop-${c.hex}-${i}`,
        hex: c.hex,
        position: colors.length > 1 ? i / (colors.length - 1) : 0.5,
      })),
    );
  }, [colors]);

  if (colors.length < 2) return null;

  const hexes = stops.map((s) => s.hex);
  const positions = stops.map((s) => s.position);

  const handleCopy = async () => {
    const output = generateGradientOutput(gradientType, hexes, positions, angle);
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast("Gradient copied to clipboard", "success");
  };

  return (
    <div
      className={cn(
        "rounded-xl p-6",
        "bg-white/[0.03] backdrop-blur-xl",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]",
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Gradient Physics</h3>
      </div>

      <div className="space-y-6">
        <GradientCanvas stops={stops} angle={angle} type={gradientType} />

        <StopRail
          stops={stops}
          paletteHexes={colors.map((c) => c.hex)}
          onChange={setStops}
        />

        {gradientType === "linear" && (
          <AngleControl angle={angle} onChange={setAngle} />
        )}

        <div className="relative flex rounded-full bg-white/[0.04] p-1 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]">
          {GRADIENT_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setGradientType(type)}
              className="relative z-10 flex-1 px-4 py-2 text-sm font-medium capitalize active:scale-[0.96] transition-transform duration-150"
            >
              {gradientType === type && (
                <motion.div
                  layoutId="gradient-physics-bg"
                  className="absolute inset-0 rounded-full bg-foreground"
                  transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                />
              )}
              <span
                className={cn(
                  "relative z-10 transition-colors duration-150",
                  gradientType === type
                    ? "text-background"
                    : "text-muted-foreground",
                )}
              >
                {type === "soft-blur" ? "Soft Blur" : type}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={handleCopy}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-medium",
            "transition-[background-color,color,scale] duration-150 ease-out",
            "bg-white/[0.04] text-muted-foreground",
            "hover:bg-white/[0.08] hover:text-foreground active:scale-[0.96]",
          )}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {copied ? (
              <motion.span
                key="check"
                initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                transition={{ type: "spring", duration: 0.3, bounce: 0 }}
              >
                <Check className="h-4 w-4" />
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                transition={{ type: "spring", duration: 0.3, bounce: 0 }}
              >
                <Copy className="h-4 w-4" />
              </motion.span>
            )}
          </AnimatePresence>
          {copied ? "Copied!" : "Copy CSS"}
        </button>
      </div>
    </div>
  );
}
