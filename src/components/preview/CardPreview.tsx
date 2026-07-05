"use client";
import { usePaletteStore } from "@/store/palette-store";

export function CardPreview() {
  const colors = usePaletteStore((s) => s.colors);
  if (colors.length < 2) return null;
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 h-32 rounded-lg" style={{ backgroundColor: colors[1].hex }} />
      <h4 className="font-semibold">Card Title</h4>
      <p className="mt-1 text-sm text-muted-foreground">This card uses your extracted palette for styling.</p>
    </div>
  );
}
