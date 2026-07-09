"use client";
import { usePaletteStore } from "@/store/palette-store";
import { cn } from "@/lib/utils";

export function InputPreview() {
  const colors = usePaletteStore((s) => s.colors);
  const activeIndex = usePaletteStore((s) => s.activeColorIndex);
  const accent = activeIndex !== null ? colors[activeIndex]?.hex : colors[0]?.hex;
  if (!accent) return null;
  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Default input"
        className={cn(
          "w-full rounded-lg border bg-white/[0.03] px-4 py-2.5 text-sm text-foreground/85 outline-none transition-[border-color,box-shadow] duration-150 ease-out",
          "placeholder:text-muted-foreground/30",
        )}
        style={{ borderColor: accent + "30" }}
      />
      <input
        type="text"
        placeholder="Focused state"
        className={cn(
          "w-full rounded-lg border bg-white/[0.03] px-4 py-2.5 text-sm text-foreground/85 outline-none transition-[border-color,box-shadow] duration-150 ease-out",
          "placeholder:text-muted-foreground/30",
        )}
        style={{ borderColor: accent, boxShadow: `0 0 0 2px ${accent}20` }}
      />
    </div>
  );
}
