"use client";

import { useColorExtraction } from "@/hooks/useColorExtraction";
import { PaletteGrid } from "./PaletteGrid";

export function Extractor() {
  useColorExtraction();
  return <PaletteGrid />;
}
