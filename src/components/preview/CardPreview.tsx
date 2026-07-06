"use client";
import { usePaletteStore } from "@/store/palette-store";

export function CardPreview() {
  const colors = usePaletteStore((s) => s.colors);
  if (colors.length < 2) return null;
  return (
    <div className="group rounded-xl bg-white/[0.03] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset] transition-[box-shadow,scale] duration-300 ease-out hover:scale-[1.02] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset,0_8px_24px_rgba(0,0,0,0.3)]">
      <div className="mb-4 h-32 overflow-hidden rounded-lg transition-transform duration-500 ease-out group-hover:scale-105" style={{ backgroundColor: colors[1].hex }} />
      <h4 className="font-semibold">Card Title</h4>
      <p className="mt-1 text-sm text-muted-foreground">This card uses your extracted palette for styling.</p>
    </div>
  );
}
