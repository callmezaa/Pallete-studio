"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Check, Download } from "lucide-react";
import { usePaletteStore } from "@/store/palette-store";
import { useToastStore } from "@/store/toast-store";
import { exportGenerators, generatePaletteStripBlob } from "@/lib/export";
import { EXPORT_FORMATS } from "@/constants";
import { cn } from "@/lib/utils";

interface HighlightToken {
  text: string;
  hex?: string;
}

function parseHighlight(text: string): HighlightToken[] {
  const tokens: HighlightToken[] = [];
  const regex = /(#[a-fA-F0-9]{6})/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ text: text.slice(lastIndex, match.index) });
    }
    tokens.push({ text: match[1], hex: match[1] });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push({ text: text.slice(lastIndex) });
  }

  return tokens;
}

const formatLabels: Record<string, string> = {
  css: "CSS",
  tailwind: "Tailwind",
  json: "JSON",
  scss: "SCSS",
  tokens: "Tokens",
  png: "PNG",
};

export function ExportPanel() {
  const colors = usePaletteStore((s) => s.colors);
  const addToast = useToastStore((s) => s.addToast);
  const [format, setFormat] = useState<string>("css");
  const [copied, setCopied] = useState<string | null>(null);
  const [pngBlob, setPngBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isPng = format === "png";
  const generator = isPng ? null : exportGenerators[format];
  const data = generator?.(colors) ?? "";
  const highlighted = useMemo(() => parseHighlight(data), [data]);

  useEffect(() => {
    if (!isPng || colors.length === 0) {
      setPngBlob(null);
      return;
    }
    let cancelled = false;
    generatePaletteStripBlob(colors).then((blob) => {
      if (cancelled || !blob) return;
      setPngBlob(blob);
    });
    return () => { cancelled = true; };
  }, [isPng, colors]);

  useEffect(() => {
    if (!pngBlob) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(pngBlob);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [pngBlob]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, []);

  if (colors.length === 0) return null;
  if (!isPng && !generator) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data);
      setCopied("copy");
    } catch {
      addToast("Failed to copy to clipboard", "error");
    }
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyImage = async () => {
    if (!pngBlob) return;
    try {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": pngBlob })]);
      setCopied("copy-image");
      addToast("Image copied to clipboard", "success");
    } catch {
      addToast("Failed to copy image", "error");
    }
    setTimeout(() => setCopied(null), 2000);
  };

  const handleShare = async () => {
    try {
      const json = JSON.stringify(
        colors.map((c) => ({
          hex: c.hex, rgb: c.rgb, hsl: c.hsl, oklch: c.oklch,
          cssVar: c.cssVar, percentage: c.percentage, name: c.name,
        })),
      );
      const encoded = btoa(json);
      const url = `${window.location.origin}/palette/${encoded}`;
      await navigator.clipboard.writeText(url);
      setCopied("share");
    } catch {
      addToast("Failed to copy share link", "error");
    }
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownload = () => {
    const extMap: Record<string, string> = { css: "css", tailwind: "js", json: "json", scss: "scss", tokens: "json" };
    const ext = extMap[format] || "txt";
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `palette.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPng = () => {
    if (!pngBlob) return;
    const url = URL.createObjectURL(pngBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "palette-strip.png";
    a.click();
    URL.revokeObjectURL(url);
  };

  const springIcon = { type: "spring" as const, duration: 0.3, bounce: 0 };

  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold tracking-tight">Export</h2>
      <div
        className={cn(
          "rounded-xl p-6",
          "bg-white/[0.03] backdrop-blur-xl",
          "shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]",
        )}
      >
        <div className="mb-4 flex flex-wrap gap-2">
          {EXPORT_FORMATS.map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-[background-color,color,transform] duration-150 active:scale-[0.96]",
                format === f
                  ? "bg-foreground text-background"
                  : "bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08] hover:text-foreground",
              )}
            >
              {formatLabels[f] || f}
            </button>
          ))}
        </div>

        {isPng ? (
          <div className="mb-4 flex justify-center rounded-lg bg-black/30 p-4">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Palette strip"
                className="h-auto max-w-full rounded-lg"
              />
            ) : (
              <div className="h-24 w-full animate-pulse rounded-lg bg-white/[0.04]" />
            )}
          </div>
        ) : (
          <div
            className={cn(
              "relative mb-4 max-h-48 overflow-auto rounded-lg bg-black/30 p-4",
              "font-mono text-xs leading-relaxed",
              "shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]",
            )}
          >
            {highlighted.map((token, i) =>
              token.hex ? (
                <span key={i} className="font-medium" style={{ color: token.hex }}>
                  {token.text}
                </span>
              ) : (
                <span key={i} className="text-muted-foreground">
                  {token.text}
                </span>
              ),
            )}
          </div>
        )}

        <div className="flex gap-2">
          {isPng ? (
            <>
              <button
                onClick={handleCopyImage}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-medium",
                  "transition-[background-color,color,scale] duration-150 ease-out",
                  "bg-white/[0.04] text-muted-foreground",
                  "hover:bg-white/[0.08] hover:text-foreground active:scale-[0.96]",
                )}
              >
                <AnimatePresence initial={false} mode="popLayout">
                  {copied === "copy-image" ? (
                    <motion.span
                      key="check-img"
                      initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                      transition={springIcon}
                    >
                      <Check className="h-4 w-4" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy-img"
                      initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                      transition={springIcon}
                    >
                      <Copy className="h-4 w-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
                {copied === "copy-image" ? "Copied!" : "Copy Image"}
              </button>
              <button
                onClick={handleDownloadPng}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-medium",
                  "transition-[background-color,color,scale] duration-150 ease-out",
                  "bg-white/[0.04] text-muted-foreground",
                  "hover:bg-white/[0.08] hover:text-foreground active:scale-[0.96]",
                )}
              >
                <Download className="h-4 w-4" />
                Download PNG
              </button>
            </>
          ) : (
            <>
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
                  {copied === "copy" ? (
                    <motion.span
                      key="check-copy"
                      initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                      transition={springIcon}
                    >
                      <Check className="h-4 w-4" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle-copy"
                      initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                      transition={springIcon}
                    >
                      <Copy className="h-4 w-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
                {copied === "copy" ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={handleDownload}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-medium",
                  "transition-[background-color,color,scale] duration-150 ease-out",
                  "bg-white/[0.04] text-muted-foreground",
                  "hover:bg-white/[0.08] hover:text-foreground active:scale-[0.96]",
                )}
              >
                <Download className="h-4 w-4" />
                Download
              </button>
              <button
                onClick={handleShare}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-medium",
                  "transition-[background-color,color,scale] duration-150 ease-out",
                  "bg-white/[0.04] text-muted-foreground",
                  "hover:bg-white/[0.08] hover:text-foreground active:scale-[0.96]",
                )}
              >
                <AnimatePresence initial={false} mode="popLayout">
                  {copied === "share" ? (
                    <motion.span
                      key="check-share"
                      initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                      transition={springIcon}
                    >
                      <Check className="h-4 w-4" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle-share"
                      initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                      transition={springIcon}
                    >
                      <Copy className="h-4 w-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
                Share Link
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
