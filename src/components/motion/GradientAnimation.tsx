"use client";

import { useEffect, useRef } from "react";
import { usePaletteStore } from "@/store/palette-store";

export function GradientAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colors = usePaletteStore((s) => s.colors);
  const animRef = useRef<number>(0);
  const progressRef = useRef(0);

  useEffect(() => {
    if (colors.length < 2) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const hexes = colors.map((c) => c.hex);

    const animate = () => {
      progressRef.current = (progressRef.current + 0.002) % 1;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const grad = ctx.createLinearGradient(
        rect.width * Math.sin(progressRef.current * Math.PI * 2),
        rect.height * Math.cos(progressRef.current * Math.PI * 2),
        rect.width * Math.sin(progressRef.current * Math.PI * 2 + Math.PI),
        rect.height * Math.cos(progressRef.current * Math.PI * 2 + Math.PI)
      );
      hexes.forEach((hex, i) => grad.addColorStop(i / (hexes.length - 1), hex));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, rect.width, rect.height);
      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animRef.current);
  }, [colors]);

  if (colors.length < 2) return null;
  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 -z-20 h-full w-full opacity-30" />;
}
