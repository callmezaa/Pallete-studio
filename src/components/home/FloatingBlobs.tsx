"use client";

import { useEffect, useRef, useState } from "react";
import { usePaletteStore } from "@/store/palette-store";

interface Blob {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  color: string;
  alpha: number;
}

const DEFAULT_COLORS = ["#6366f1", "#a78bfa", "#f472b6", "#34d399"];
const BLOB_COUNT = 4;

function createBlob(w: number, h: number, hexes: string[]): Blob {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    radius: 100 + Math.random() * 120,
    color: hexes[Math.floor(Math.random() * hexes.length)],
    alpha: 0.12 + Math.random() * 0.12,
  };
}

export function FloatingBlobs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blobsRef = useRef<Blob[]>([]);
  const mouseRef = useRef({ x: -1e6, y: -1e6 });
  const rafRef = useRef(0);
  const colors = usePaletteStore((s) => s.colors);
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const hexes = colors.length > 0 ? colors.map((c) => c.hex) : DEFAULT_COLORS;

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      if (blobsRef.current.length === 0) {
        blobsRef.current = Array.from({ length: BLOB_COUNT }, () => createBlob(w, h, hexes));
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => { mouseRef.current = { x: -1e6, y: -1e6 }; };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("mouseleave", onLeave);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const b of blobsRef.current) {
        b.x += b.vx;
        b.y += b.vy;

        const dx = mouseRef.current.x - b.x;
        const dy = mouseRef.current.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 600) {
          b.vx += (dx / dist) * 0.03;
          b.vy += (dy / dist) * 0.03;
        }

        const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        if (speed > 0.5) { b.vx = (b.vx / speed) * 0.5; b.vy = (b.vy / speed) * 0.5; }

        if (b.x < -b.radius) b.x = w + b.radius;
        if (b.x > w + b.radius) b.x = -b.radius;
        if (b.y < -b.radius) b.y = h + b.radius;
        if (b.y > h + b.radius) b.y = -b.radius;

        ctx.save();
        ctx.filter = `blur(${b.radius * 0.35}px)`;
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        grad.addColorStop(0, b.color);
        grad.addColorStop(1, "transparent");
        ctx.globalAlpha = b.alpha;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [hexes, reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-20"
      aria-hidden="true"
    />
  );
}
