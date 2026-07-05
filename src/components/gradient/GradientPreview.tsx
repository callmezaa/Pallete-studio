"use client";

import { useEffect, useRef } from "react";
import { usePaletteStore } from "@/store/palette-store";
import { useUIStore } from "@/store/ui-store";

export function GradientPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colors = usePaletteStore((s) => s.colors);
  const gradientType = useUIStore((s) => s.gradientType);
  const hexes = colors.map((c) => c.hex);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || hexes.length < 2) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    let gradient: CanvasGradient;
    if (gradientType === "radial") {
      gradient = ctx.createRadialGradient(rect.width / 2, rect.height / 2, 0, rect.width / 2, rect.height / 2, rect.width / 2);
    } else {
      gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    }

    hexes.forEach((hex, i) => gradient.addColorStop(i / (hexes.length - 1), hex));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);
  }, [hexes, gradientType]);

  if (hexes.length < 2) return null;
  return <canvas ref={canvasRef} className="h-48 w-full rounded-xl" style={{ width: "100%", height: "12rem" }} />;
}
