"use client";

import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { formatColor } from "@/lib/colors";
import type { ExtractedColor } from "@/types";
import { COLOR_FORMATS } from "@/constants";
import { cn } from "@/lib/utils";

interface ColorFormatProps {
  color: ExtractedColor;
}

export function ColorFormat({ color }: ColorFormatProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className="space-y-1">
      {COLOR_FORMATS.map((format) => (
        <button
          key={format}
          onClick={() => copy(formatColor(color, format), `${color.hex}-${format}`)}
          className={cn(
            "flex w-full items-center justify-between rounded px-2 py-1 text-xs font-mono transition-colors hover:bg-muted",
            copied === `${color.hex}-${format}` && "text-green-500"
          )}
          aria-label={`Copy ${format} value`}
        >
          <span className="uppercase text-muted-foreground">{format}</span>
          <span>{formatColor(color, format)}</span>
        </button>
      ))}
    </div>
  );
}
