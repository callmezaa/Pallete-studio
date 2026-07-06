"use client";
import { usePaletteStore } from "@/store/palette-store";

export function NavbarPreview() {
  const dominantColor = usePaletteStore((s) => s.dominantColor);
  if (!dominantColor) return null;
  return (
    <div
      className="flex items-center justify-between rounded-xl px-6 py-4 transition-[background-color] duration-300 ease-out hover:bg-white/[0.03]"
      style={{ backgroundColor: dominantColor + "15", borderBottom: `1px solid ${dominantColor}30` }}
    >
      <span className="font-semibold" style={{ color: dominantColor }}>Logo</span>
      <div className="flex gap-6 text-sm text-muted-foreground"><span>Home</span><span>About</span><span>Contact</span></div>
    </div>
  );
}
