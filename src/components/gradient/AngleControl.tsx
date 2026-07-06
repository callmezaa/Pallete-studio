"use client";

import { cn } from "@/lib/utils";

interface Props {
  angle: number;
  onChange: (angle: number) => void;
}

export function AngleControl({ angle, onChange }: Props) {
  return (
    <div className="flex items-center gap-3">
      <span className="min-w-[3rem] text-right text-xs font-medium text-muted-foreground">
        Angle
      </span>
      <input
        type="range"
        min={0}
        max={360}
        step={1}
        value={angle}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          "h-1.5 w-full cursor-pointer appearance-none rounded-full",
          "bg-white/[0.08]",
          "[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4",
          "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full",
          "[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_1px_4px_rgba(0,0,0,0.3)]",
          "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4",
          "[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full",
          "[&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white",
          "[&::-moz-range-thumb]:shadow-[0_1px_4px_rgba(0,0,0,0.3)]",
        )}
      />
      <span className="min-w-[3rem] text-xs font-medium text-muted-foreground tabular-nums">
        {angle}°
      </span>
    </div>
  );
}
