"use client";

import { useEffect, useRef } from "react";
import type { ExtractedColor } from "@/types";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
}

interface Props {
  colors: ExtractedColor[];
  phase: string;
  activeColor?: string;
}

const PARTICLE_COUNT = 25;

function makeParticle(w: number, h: number, palette: string[]): Particle {
  return {
    x: Math.random() * w,
    y: h + Math.random() * 20,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -(0.15 + Math.random() * 0.25),
    size: 1.5 + Math.random() * 2.5,
    alpha: 0.08 + Math.random() * 0.2,
    color: palette[Math.floor(Math.random() * palette.length)],
    life: 0,
    maxLife: 300 + Math.random() * 400,
  };
}

export function StoryBackground({ colors, phase, activeColor }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);

  const hexes = colors.map((c) => c.hex);
  const palette = hexes.length > 0 ? hexes : ["#6366f1", "#a78bfa", "#f472b6"];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

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

    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
      makeParticle(w, h, palette),
    );

    const draw = () => {
      timeRef.current += 1;
      ctx.clearRect(0, 0, w, h);

      // Gradient background
      const angle = timeRef.current * 0.002;
      const cx = w / 2;
      const cy = h / 2;
      const len = Math.max(w, h);

      const colorsToUse = activeColor
        ? [activeColor, ...palette.filter((c) => c !== activeColor).slice(0, 2)]
        : palette;

      if (colorsToUse.length >= 2) {
        const grad = ctx.createLinearGradient(
          cx + Math.cos(angle) * len,
          cy + Math.sin(angle) * len,
          cx - Math.cos(angle) * len,
          cy - Math.sin(angle) * len,
        );
        colorsToUse.forEach((hex, i) =>
          grad.addColorStop(i / (colorsToUse.length - 1), hex + "18"),
        );
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // Particles
      for (const p of particlesRef.current) {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        const t = p.life / p.maxLife;
        const fadeIn = t < 0.1 ? t / 0.1 : 1;
        const fadeOut = t > 0.85 ? (1 - t) / 0.15 : 1;
        const a = p.alpha * fadeIn * fadeOut;

        if (a < 0.01 || p.y < -10) {
          Object.assign(p, makeParticle(w, h, palette));
          continue;
        }

        ctx.globalAlpha = a;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [palette, activeColor]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
