"use client";

import { useEffect, useRef, useState } from "react";
import { usePaletteStore } from "@/store/palette-store";

const ROTATION_SPEED = 0.003;
const OPACITY_SPEED = 0.35;
const OPACITY_MIN = 0.18;
const OPACITY_MAX = 0.35;

export function GradientAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colors = usePaletteStore((s) => s.colors);
  const animRef = useRef(0);
  const timeRef = useRef(0);
  const [reduced, setReduced] = useState(true);

  const hexes = colors.map((c) => c.hex);
  const hasColors = hexes.length >= 2;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !hasColors) return;
    const ctx = canvas.getContext("2d")!;

    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      timeRef.current += reduced ? 0 : ROTATION_SPEED;
      const angle = timeRef.current * Math.PI * 2;

      const grad = ctx.createLinearGradient(
        w * Math.sin(angle),
        h * Math.cos(angle),
        w * Math.sin(angle + Math.PI),
        h * Math.cos(angle + Math.PI),
      );
      hexes.forEach((hex, i) =>
        grad.addColorStop(i / (hexes.length - 1), hex + "cc"),
      );

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      canvas.style.opacity = String(
        OPACITY_MIN +
          (OPACITY_MAX - OPACITY_MIN) *
            (0.5 + 0.5 * Math.sin(timeRef.current * OPACITY_SPEED)),
      );

      if (!reduced) animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [hexes, reduced, hasColors]);

  const cssGradient = hasColors
    ? `linear-gradient(135deg, ${hexes.join(", ")})`
    : "linear-gradient(135deg, #0f0f1a, #1a1a2e)";

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 -z-20 h-full w-full opacity-[0.15]"
        style={{ background: cssGradient, willChange: "opacity" }}
        aria-hidden="true"
      />
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 -z-20 h-full w-full"
        style={{ willChange: "opacity" }}
        aria-hidden="true"
      />
    </>
  );
}
