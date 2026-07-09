"use client";
import { usePaletteStore } from "@/store/palette-store";
import { cn } from "@/lib/utils";

export function NavbarPreview() {
  const colors = usePaletteStore((s) => s.colors);
  const activeIndex = usePaletteStore((s) => s.activeColorIndex);
  const accent = activeIndex !== null ? colors[activeIndex]?.hex : colors[0]?.hex;
  if (!accent) return null;
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl px-5 py-3.5 transition-all duration-300 ease-out",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset] hover:bg-white/[0.04]",
      )}
    >
      <span className="font-semibold" style={{ color: accent }}>Studio</span>
      <div className="flex gap-5 text-sm text-muted-foreground/60">
        <span className="transition-colors hover:text-foreground/80">Home</span>
        <span className="transition-colors hover:text-foreground/80">About</span>
        <span className="transition-colors hover:text-foreground/80">Contact</span>
      </div>
    </div>
  );
}
