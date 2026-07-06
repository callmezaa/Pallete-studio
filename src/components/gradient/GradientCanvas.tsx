"use client";

import { useRef, useEffect, useCallback } from "react";
import type { GradientType } from "@/constants";

interface CanvasStop {
  hex: string;
  position: number;
}

interface Props {
  stops: CanvasStop[];
  angle: number;
  type: GradientType;
}

function hexToRgb(hex: string) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r
    ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) }
    : { r: 0, g: 0, b: 0 };
}

export function GradientCanvas({ stops, angle, type }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, active: false });
  const smoothRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number>(0);

  const stopsRef = useRef(stops);
  stopsRef.current = stops;
  const angleRef = useRef(angle);
  angleRef.current = angle;
  const typeRef = useRef(type);
  typeRef.current = type;

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if (w === 0 || h === 0) return;

    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const sm = smoothRef.current;
    const tm = mouseRef.current;
    if (tm.active) {
      sm.x += (tm.x - sm.x) * 0.08;
      sm.y += (tm.y - sm.y) * 0.08;
    } else {
      sm.x += (0.5 - sm.x) * 0.04;
      sm.y += (0.5 - sm.y) * 0.04;
    }

    const mx = sm.x;
    const my = sm.y;
    const mouseActive = tm.active || Math.abs(sm.x - 0.5) > 0.01;

    const currentStops = stopsRef.current;
    const currentAngle = angleRef.current;
    const currentType = typeRef.current;

    if (currentStops.length < 2) return;

    ctx.clearRect(0, 0, w, h);

    if (currentType === "mesh") {
      renderMesh(ctx, w, h, currentStops, mx, my, mouseActive);
      return;
    }

    if (currentType === "soft-blur") {
      renderSoftBlur(ctx, w, h, currentStops, mx, my, mouseActive);
      return;
    }

    let gradient: CanvasGradient;
    const hexes = currentStops.map((s) => s.hex);
    const positions = currentStops.map((s) => s.position);

    if (currentType === "linear") {
      const angleOffset = mouseActive ? (mx - 0.5) * 30 : 0;
      const angleRad = ((currentAngle + angleOffset - 90) * Math.PI) / 180;
      const cx = w / 2;
      const cy = h / 2;
      const len = Math.sqrt(w * w + h * h) / 2;
      gradient = ctx.createLinearGradient(
        cx + Math.cos(angleRad) * len,
        cy + Math.sin(angleRad) * len,
        cx - Math.cos(angleRad) * len,
        cy - Math.sin(angleRad) * len,
      );
    } else {
      const cx = mouseActive ? mx * w : w / 2;
      const cy = mouseActive ? my * h : h / 2;
      const radius = Math.max(w, h) * 0.75;
      gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    }

    positions.forEach((pos, i) => gradient.addColorStop(pos, hexes[i]));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    if (currentType === "linear" && mouseActive) {
      const angleOffset = (mx - 0.5) * 30;
      const angleRad = ((currentAngle + angleOffset - 90) * Math.PI) / 180;
      const cx = w / 2;
      const cy = h / 2;
      const len = Math.min(w, h) * 0.35;
      ctx.beginPath();
      ctx.moveTo(cx - Math.cos(angleRad) * len, cy - Math.sin(angleRad) * len);
      ctx.lineTo(cx + Math.cos(angleRad) * len, cy + Math.sin(angleRad) * len);
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, []);

  const r = useRef(render);
  r.current = render;

  useEffect(() => {
    const loop = () => {
      r.current();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => r.current());
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
      active: true,
    };
  }, []);

  const handlePointerLeave = useCallback(() => {
    mouseRef.current = { x: 0.5, y: 0.5, active: false };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-64 w-full overflow-hidden rounded-xl"
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      />
    </div>
  );
}

function renderMesh(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  stops: CanvasStop[],
  mx: number,
  my: number,
  active: boolean,
) {
  const hexes = stops.map((s) => s.hex);
  const n = hexes.length;
  const cols = Math.ceil(Math.sqrt(n));
  const rows = Math.ceil(n / cols);
  const cellW = w / cols;
  const cellH = h / rows;

  const displacement = active ? 30 : 0;
  const dx = (mx - 0.5) * displacement * 2;
  const dy = (my - 0.5) * displacement * 2;

  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      const falloff = 1 - Math.abs(gx / (cols - 1 || 1) - 0.5) * 2;
      const x0 = gx * cellW + dx * falloff;
      const y0 = gy * cellH + dy * falloff;
      const x1 = Math.min(x0 + cellW, w);
      const y1 = Math.min(y0 + cellH, h);

      const idx = gy * cols + gx;
      const c = hexToRgb(hexes[idx % n]);

      ctx.fillStyle = `rgb(${c.r},${c.g},${c.b})`;
      ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    }
  }
}

function renderSoftBlur(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  stops: CanvasStop[],
  mx: number,
  my: number,
  active: boolean,
) {
  const n = stops.length;
  const cx = w / 2;
  const cy = h / 2;
  const baseR = Math.min(w, h) * 0.15;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);

  stops.forEach((stop, i) => {
    const angle = (i / n) * Math.PI * 2;
    const orbit = Math.min(w, h) * 0.2;
    const offsetX = active ? (mx - 0.5) * w * 0.15 : 0;
    const offsetY = active ? (my - 0.5) * h * 0.15 : 0;
    const bx = cx + Math.cos(angle) * orbit + offsetX;
    const by = cy + Math.sin(angle) * orbit + offsetY;

    const gradient = ctx.createRadialGradient(bx, by, 0, bx, by, baseR * 2);
    gradient.addColorStop(0, stop.hex);
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.globalCompositeOperation = "screen";
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "source-over";
  });
}
