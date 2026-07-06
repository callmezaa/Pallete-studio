"use client";

import { useEffect, useRef, useState } from "react";
import { usePaletteStore } from "@/store/palette-store";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
  color: string;
  life: number;
  maxLife: number;
  delay: number;
}

const COUNT = 50;
const MAX_SPEED = 0.4;

function create(w: number, h: number, palette: string[]): Particle {
  const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.6;
  const s = 0.1 + Math.random() * 0.3;
  return {
    x: Math.random() * w,
    y: h + 10 + Math.random() * 30,
    vx: Math.cos(a) * s * 0.3,
    vy: -Math.abs(Math.sin(a) * s),
    size: 1.5 + Math.random() * 2.5,
    baseAlpha: 0.12 + Math.random() * 0.3,
    color: palette[Math.floor(Math.random() * palette.length)] + "cc",
    life: 0,
    maxLife: 400 + Math.random() * 500,
    delay: Math.random() * 150,
  };
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1e6, y: -1e6 });
  const idRef = useRef(0);
  const colors = usePaletteStore((s) => s.colors);
  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const hexes = colors.map((c) => c.hex);
  const palette = hexes.length > 0 ? hexes : ["#6366f1", "#a78bfa", "#f472b6", "#34d399", "#fbbf24"];

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => {
      mouseRef.current = { x: -1e6, y: -1e6 };
    };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("mouseleave", onLeave);

    headRef.current = Array.from({ length: COUNT }, (_, i) => create(w, h, palette));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const p of headRef.current) {
        p.life++;
        if (p.life < p.delay) continue;
        const t = (p.life - p.delay) / p.maxLife;

        p.x += p.vx;
        p.y += p.vy;

        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 14400) {
          const dist = Math.sqrt(dist2);
          const f = (1 - dist / 120) * 0.6;
          p.vx += (dx / dist) * f * 0.12;
          p.vy += (dy / dist) * f * 0.12;
        }

        const sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (sp > MAX_SPEED) {
          p.vx = (p.vx / sp) * MAX_SPEED;
          p.vy = (p.vy / sp) * MAX_SPEED;
        }

        const fadeIn = t < 0.12 ? t / 0.12 : 1;
        const fadeOut = t > 0.85 ? (1 - t) / 0.15 : 1;
        const alpha = p.baseAlpha * Math.max(0, fadeIn * fadeOut);

        if (alpha < 0.01) continue;

        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.y < -20 || p.x < -20 || p.x > w + 20 || t >= 1) {
          headRef.current[headRef.current.indexOf(p)] = create(w, h, palette);
        }
      }

      ctx.globalAlpha = 1;
      idRef.current = requestAnimationFrame(draw);
    };

    idRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(idRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [palette, reduced]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
    />
  );
}
