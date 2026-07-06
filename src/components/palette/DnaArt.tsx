"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePaletteStore } from "@/store/palette-store";
import { useToastStore } from "@/store/toast-store";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { getHelixData, smoothPath } from "@/lib/dna";
import { cn } from "@/lib/utils";
import { Check, Copy, Download } from "lucide-react";

const GLOW_FILTER = (
  <filter id="dna-glow" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
    <feMerge>
      <feMergeNode in="blur" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>
);

export function DnaArt() {
  const colors = usePaletteStore((s) => s.colors);
  const addToast = useToastStore((s) => s.addToast);
  const { copied, copy } = useCopyToClipboard();
  const svgRef = useRef<SVGSVGElement>(null);

  if (colors.length === 0) return null;

  const data = getHelixData({ colors });

  const handleDownload = () => {
    const el = svgRef.current;
    if (!el) return;
    const svgString = new XMLSerializer().serializeToString(el);
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "palette-dna.svg";
    a.click();
    URL.revokeObjectURL(url);
    addToast("DNA downloaded", "success");
  };

  const handleCopySvg = () => {
    const el = svgRef.current;
    if (!el) return;
    const svgString = new XMLSerializer().serializeToString(el);
    navigator.clipboard.writeText(svgString);
    copy(svgString, "dna-svg");
    addToast("SVG copied to clipboard", "success");
  };

  const backboneGradId = "dna-backbone-grad";

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
            SVG
          </button>
          <AnimatePresence initial={false} mode="popLayout">
            {copied === "dna-svg" ? (
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
                onClick={handleCopySvg}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium",
                  "transition-[background-color,color,transform] duration-150 ease-out",
                  "bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08] hover:text-foreground active:scale-[0.96]",
                )}
              >
                <Copy className="h-3.5 w-3.5" />
                Copy SVG
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mx-auto max-w-[260px]">
        <svg
          ref={svgRef}
          viewBox="0 0 300 500"
          xmlns="http://www.w3.org/2000/svg"
          className="h-auto w-full"
        >
          <defs>
            {GLOW_FILTER}
            <linearGradient id={backboneGradId} x1="0" y1="0" x2="0" y2="1">
              {colors.map((c, i) => (
                <stop
                  key={i}
                  offset={`${(i / (colors.length - 1 || 1)) * 100}%`}
                  stopColor={c.hex}
                  stopOpacity="0.25"
                />
              ))}
            </linearGradient>
          </defs>

          {/* Connecting lines between consecutive same-side nodes */}
          {data.bars.slice(0, -1).map((bar, i) => (
            <g key={`conn-${i}`}>
              <line
                x1={bar.leftX} y1={bar.y}
                x2={data.bars[i + 1].leftX} y2={data.bars[i + 1].y}
                stroke="rgba(255,255,255,0.04)" strokeWidth="1"
              />
              <line
                x1={bar.rightX} y1={bar.y}
                x2={data.bars[i + 1].rightX} y2={data.bars[i + 1].y}
                stroke="rgba(255,255,255,0.04)" strokeWidth="1"
              />
            </g>
          ))}

          {/* Backbones */}
          <path
            d={smoothPath(data.leftPoints)}
            fill="none"
            stroke={`url(#${backboneGradId})`}
            strokeWidth="2"
          />
          <path
            d={smoothPath(data.rightPoints)}
            fill="none"
            stroke={`url(#${backboneGradId})`}
            strokeWidth="2"
          />

          {/* Bars */}
          {data.bars.map((bar, i) => (
            <g key={`bar-${i}`}>
              <line
                x1={bar.leftX} y1={bar.y}
                x2={bar.rightX} y2={bar.y}
                stroke={bar.hex}
                strokeWidth={bar.thickness}
                strokeLinecap="round"
                opacity="0.15"
              />
              <line
                x1={bar.leftX} y1={bar.y}
                x2={bar.rightX} y2={bar.y}
                stroke={bar.hex}
                strokeWidth={bar.thickness * 0.5}
                strokeLinecap="round"
              />
              <circle cx={bar.leftX} cy={bar.y} r="4" fill={bar.hex} filter="url(#dna-glow)" />
              <circle cx={bar.rightX} cy={bar.y} r="4" fill={bar.hex} filter="url(#dna-glow)" />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
