"use client";

import { useEffect, useRef, useCallback } from "react";
import { useUploadStore } from "@/store/upload-store";
import { usePaletteStore } from "@/store/palette-store";
import { hexToRgb, rgbToHsl, rgbToOklch, hexToCssVar } from "@/lib/colors";
import { generateColorName } from "@/lib/naming";
import { detectMood } from "@/lib/mood";
import { extractColorsFromImageData } from "@/lib/extraction";
import type { ExtractedColor } from "@/types";

export function useColorExtraction() {
  const preview = useUploadStore((s) => s.preview);
  const setColors = usePaletteStore((s) => s.setColors);
  const setExtracting = usePaletteStore((s) => s.setExtracting);
  const setMood = usePaletteStore((s) => s.setMood);
  const clear = usePaletteStore((s) => s.clear);

  const extract = useCallback(() => {
    if (!preview) { clear(); return; }
    setExtracting(true);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = preview;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = (200 / img.width) * img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const raw = extractColorsFromImageData(imageData);
      const namedColors: ExtractedColor[] = raw.map((r) => {
        const rgb = hexToRgb(r.hex);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        const oklch = rgbToOklch(rgb.r, rgb.g, rgb.b);
        return {
          hex: r.hex,
          rgb,
          hsl,
          oklch,
          cssVar: hexToCssVar(r.hex),
          percentage: r.percentage,
          name: generateColorName(r.hex),
        };
      });

      setColors(namedColors);
      setMood(detectMood(namedColors));
      setExtracting(false);
    };

    img.onerror = () => {
      console.error("Failed to load image for extraction");
      setExtracting(false);
    };
  }, [preview, setColors, setExtracting, setMood, clear]);

  useEffect(() => { extract(); }, [extract]);
}
