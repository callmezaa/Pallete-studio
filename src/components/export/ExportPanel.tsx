"use client";

import { useState } from "react";
import { Copy, Check, Download } from "lucide-react";
import { usePaletteStore } from "@/store/palette-store";
import { exportGenerators } from "@/lib/export";
import { EXPORT_FORMATS } from "@/constants";
import { cn } from "@/lib/utils";

export function ExportPanel() {
  const colors = usePaletteStore((s) => s.colors);
  const [format, setFormat] = useState<string>("css");
  const [copied, setCopied] = useState(false);

  if (colors.length === 0) return null;

  const generator = exportGenerators[format];
  if (!generator) return null;
  const data = generator(colors);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const json = JSON.stringify(colors.map((c) => ({
      hex: c.hex, rgb: c.rgb, hsl: c.hsl, oklch: c.oklch,
      cssVar: c.cssVar, percentage: c.percentage, name: c.name,
    })));
    const encoded = btoa(json);
    const url = `${window.location.origin}/palette/${encoded}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold tracking-tight">Export</h2>
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {EXPORT_FORMATS.map((f) => (
            <button key={f} onClick={() => setFormat(f)} className={cn("rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors", format === f ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-accent")}>
              {f === "tokens" ? "Design Tokens" : f}
            </button>
          ))}
        </div>
        <pre className="mb-4 max-h-48 overflow-auto rounded-lg bg-muted p-4 text-xs font-mono">{data}</pre>
        <div className="flex gap-2">
          <button onClick={handleCopy} className="flex items-center gap-1.5 rounded-lg bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-accent">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button onClick={handleDownload} className="flex items-center gap-1.5 rounded-lg bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-accent">
            <Download className="h-4 w-4" /> Download
          </button>
          <button onClick={handleShare} className="flex items-center gap-1.5 rounded-lg bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-accent">
            <Copy className="h-4 w-4" /> Share Link
          </button>
        </div>
      </div>
    </section>
  );
}
