"use client";

import { useEffect, useRef, useCallback } from "react";
import { useUploadStore } from "@/store/upload-store";
import { usePaletteStore } from "@/store/palette-store";
import { hexToRgb, rgbToHsl, rgbToOklch, hexToCssVar } from "@/lib/colors";
import { generateColorName } from "@/lib/naming";
import { detectMood } from "@/lib/mood";
import type { ExtractedColor } from "@/types";
import type { WorkerResult } from "@/lib/extraction";

export function useColorExtraction() {
  const preview = useUploadStore((s) => s.preview);
  const setColors = usePaletteStore((s) => s.setColors);
  const setExtracting = usePaletteStore((s) => s.setExtracting);
  const setMood = usePaletteStore((s) => s.setMood);
  const clear = usePaletteStore((s) => s.clear);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/color-worker.ts", import.meta.url)
    );
    return () => workerRef.current?.terminate();
  }, []);

  const extract = useCallback(async () => {
    if (!preview) { clear(); return; }
    setExtracting(true);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = preview;
    await img.decode();

    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = (200 / img.width) * img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    return new Promise<void>((resolve, reject) => {
      if (!workerRef.current) {
        setExtracting(false);
        return resolve();
      }
      workerRef.current.onmessage = (e: MessageEvent<WorkerResult[]>) => {
        const namedColors: ExtractedColor[] = e.data.map((r: WorkerResult) => {
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
        resolve();
      };
      workerRef.current.onerror = (err) => {
        console.error("Worker error:", err);
        setExtracting(false);
        reject(err);
      };
      workerRef.current.onmessageerror = (err) => {
        console.error("Worker message error:", err);
        setExtracting(false);
        reject(err);
      };
      workerRef.current.postMessage(imageData);
    });
  }, [preview, setColors, setExtracting, setMood, clear]);

  useEffect(() => { extract(); }, [extract]);
}
