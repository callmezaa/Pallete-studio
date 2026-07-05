"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { PaletteGrid } from "@/components/palette/PaletteGrid";
import { PaletteName } from "@/components/palette/PaletteName";
import { MoodBadge } from "@/components/palette/MoodBadge";
import { usePaletteStore } from "@/store/palette-store";
import type { ExtractedColor } from "@/types";

interface SharePageProps {
  params: Promise<{ id: string }>;
}

export default function SharePalettePage({ params }: SharePageProps) {
  const { id } = use(params);
  const [decoded, setDecoded] = useState<ExtractedColor[] | null>(null);
  const setColors = usePaletteStore((s) => s.setColors);

  useEffect(() => {
    try {
      const json = atob(id);
      const colors = JSON.parse(json) as ExtractedColor[];
      setColors(colors);
      setDecoded(colors);
    } catch {
      setDecoded([]);
    }
  }, [id, setColors]);

  if (decoded === null) return <div className="p-24 text-center">Loading...</div>;
  if (decoded.length === 0) return notFound();

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <section className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Shared Palette</h1>
            <PaletteName />
          </div>
          <MoodBadge />
        </section>
        <PaletteGrid />
      </div>
    </main>
  );
}
