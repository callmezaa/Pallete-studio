"use client";

import { Palette } from "lucide-react";
import { useColorExtraction } from "@/hooks/useColorExtraction";
import { usePaletteStore } from "@/store/palette-store";
import { useUploadStore } from "@/store/upload-store";
import { PaletteGrid } from "./PaletteGrid";
import { PaletteSkeleton } from "@/components/ui/PaletteSkeleton";

export function Extractor() {
  useColorExtraction();
  const colors = usePaletteStore((s) => s.colors);
  const isExtracting = usePaletteStore((s) => s.isExtracting);
  const preview = useUploadStore((s) => s.preview);

  if (colors.length > 0) return <PaletteGrid />;
  if (isExtracting || preview) return <PaletteSkeleton />;

  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-white/[0.02] p-16 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.04]">
        <Palette className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">Discover your colors</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Drop an image above to extract its palette
      </p>
    </div>
  );
}
