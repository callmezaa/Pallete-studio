# Gradient Physics — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static GradientPreview + GradientControls with an interactive gradient playground featuring draggable stops, mouse-reactive canvas, physics-smooth animations, and CSS/SVG export.

**Architecture:** Hybrid HTML+Canvas. Canvas handles gradient rendering + mouse-reactive behavior via rAF loop. HTML overlays handle interactive controls (draggable stops via Framer Motion drag, angle slider, type switcher, copy buttons).

**Tech Stack:** Next.js 16 / React 19, Framer Motion 12, Zustand 5, Canvas 2D API

## Global Constraints

- All animations must respect `prefers-reduced-motion`
- No new Zustand stores or persist
- No new npm dependencies
- Gradient interaction state is ephemeral — not in undo stack, not persisted
- Follow existing glass design tokens: `bg-white/[0.03] backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]`
- TypeScript strict
- Must build with 0 errors

---

### Task 1: Update `src/lib/gradients.ts` — stop-position CSS, mesh SVG, soft-blur SVG

**Files:**
- Modify: `src/lib/gradients.ts`

**Interfaces:**
- Consumes: nothing (pure functions)
- Produces: `generateLinearCss(hexes, positions, angle?)` → `string`
- Produces: `generateRadialCss(hexes, positions)` → `string`
- Produces: `generateMeshSvg(hexes, width, height)` → `string`
- Produces: `generateSoftBlurSvg(hexes, width, height)` → `string`
- Produces: `generateGradientOutput(type, hexes, positions, angle?)` → `string`

- [ ] **Step 1: Read current file**

Read `src/lib/gradients.ts` to see existing exports.

- [ ] **Step 2: Write new gradient utility functions**

Replace the file content with:

```ts
export function generateLinearCss(
  hexes: string[],
  positions: number[],
  angle = 135,
): string {
  const stops = hexes
    .map((h, i) => `${h} ${(positions[i] * 100).toFixed(0)}%`)
    .join(", ");
  return `linear-gradient(${angle}deg, ${stops})`;
}

export function generateRadialCss(hexes: string[], positions: number[]): string {
  const stops = hexes
    .map((h, i) => `${h} ${(positions[i] * 100).toFixed(0)}%`)
    .join(", ");
  return `radial-gradient(circle at center, ${stops})`;
}

export function generateMeshSvg(
  hexes: string[],
  width: number,
  height: number,
): string {
  const n = hexes.length;
  const cols = Math.ceil(Math.sqrt(n));
  const rows = Math.ceil(n / cols);
  const cellW = width / cols;
  const cellH = height / rows;

  const hexToRgb = (h: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
    return r
      ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) }
      : { r: 0, g: 0, b: 0 };
  };

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const rgbAt = (gx: number, gy: number) => {
    const idx = gy * cols + gx;
    const c = hexToRgb(hexes[idx % n]);
    return c;
  };

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">\n`;
  svg += `<defs><filter id="mesh-blur"><feGaussianBlur stdDeviation="2"/></filter></defs>\n`;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const x0 = x * cellW;
      const y0 = y * cellH;
      const x1 = Math.min(x0 + cellW, width);
      const y1 = Math.min(y0 + cellH, height);

      const tl = rgbAt(x, y);
      const tr = rgbAt(x + 1, y);
      const bl = rgbAt(x, y + 1);
      const br = rgbAt(x + 1, y + 1);

      // Subdivide cell into 2 triangles for smoother render
      const midR = (tl.r + tr.r + bl.r + br.r) / 4;
      const midG = (tl.g + tr.g + bl.g + br.g) / 4;
      const midB = (tl.b + tr.b + bl.b + br.b) / 4;
      const mid = `rgb(${midR},${midG},${midB})`;

      svg += `<polygon points="${x0},${y0} ${x1},${y0} ${(x0 + x1) / 2},${(y0 + y1) / 2}" fill="rgb(${tl.r},${tl.g},${tl.b})" filter="url(#mesh-blur)"/>\n`;
      svg += `<polygon points="${x1},${y0} ${x1},${y1} ${(x0 + x1) / 2},${(y0 + y1) / 2}" fill="rgb(${tr.r},${tr.g},${tr.b})" filter="url(#mesh-blur)"/>\n`;
      svg += `<polygon points="${x0},${y1} ${x1},${y1} ${(x0 + x1) / 2},${(y0 + y1) / 2}" fill="rgb(${bl.r},${bl.g},${bl.b})" filter="url(#mesh-blur)"/>\n`;
      svg += `<polygon points="${x0},${y0} ${x0},${y1} ${(x0 + x1) / 2},${(y0 + y1) / 2}" fill="rgb(${br.r},${br.g},${br.b})" filter="url(#mesh-blur)"/>\n`;
    }
  }
  svg += "</svg>";
  return svg;
}

export function generateSoftBlurSvg(
  hexes: string[],
  width: number,
  height: number,
): string {
  const cx = width / 2;
  const cy = height / 2;
  const n = hexes.length;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">\n`;
  svg += `<defs>\n`;

  hexes.forEach((hex, i) => {
    const angle = (i / n) * Math.PI * 2;
    const r = Math.min(width, height) * 0.25;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    svg += `<radialGradient id="b${i}" cx="50%" cy="50%" r="50%">\n`;
    svg += `  <stop offset="0%" stop-color="${hex}" stop-opacity="0.6"/>\n`;
    svg += `  <stop offset="100%" stop-color="${hex}" stop-opacity="0"/>\n`;
    svg += `</radialGradient>\n`;
  });

  svg += `</defs>\n`;
  svg += `<rect width="${width}" height="${height}" fill="#000"/>\n`;

  hexes.forEach((_, i) => {
    const angle = (i / n) * Math.PI * 2;
    const r = Math.min(width, height) * 0.25;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    svg += `<circle cx="${x}" cy="${y}" r="${Math.min(width, height) * 0.35}" fill="url(#b${i})" filter="url(#sb-blur)"/>\n`;
  });

  svg += "</svg>";
  return svg;
}

export function generateGradientOutput(
  type: string,
  hexes: string[],
  positions: number[],
  angle?: number,
): string {
  switch (type) {
    case "linear":
      return generateLinearCss(hexes, positions, angle);
    case "radial":
      return generateRadialCss(hexes, positions);
    case "mesh":
      return generateMeshSvg(hexes, 400, 300);
    case "soft-blur":
      return generateSoftBlurSvg(hexes, 400, 300);
    default:
      return generateLinearCss(hexes, positions, angle);
  }
}
```

- [ ] **Step 3: Build check**

```bash
npm run build 2>&1 | tail -20
```
Expected: no TypeScript or module errors.

---

### Task 2: Create `src/components/gradient/StopRail.tsx`

**Files:**
- Create: `src/components/gradient/StopRail.tsx`

**Interfaces:**
- Consumes: stops array, palette hexes, onChange callback
- Produces: `<StopRail stops onChange paletteHexes />`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { hexToRgb } from "@/lib/colors";
import { Plus, X } from "lucide-react";
import { useState } from "react";

export interface Stop {
  id: string;
  hex: string;
  position: number;
}

interface Props {
  stops: Stop[];
  paletteHexes: string[];
  onChange: (stops: Stop[]) => void;
}

function lerpRgb(a: string, b: string, t: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const r = Math.round(ca.r + (cb.r - ca.r) * t);
  const g = Math.round(ca.g + (cb.g - ca.g) * t);
  const b_ = Math.round(ca.b + (cb.b - ca.b) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b_.toString(16).padStart(2, "0")}`;
}

export function StopRail({ stops, paletteHexes, onChange }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleDrag = (id: string, clientX: number, railRect: DOMRect) => {
    const pos = Math.max(0, Math.min(1, (clientX - railRect.left) / railRect.width));
    const idx = stops.findIndex((s) => s.id === id);
    if (idx === -1) return;

    const minPos = idx > 0 ? stops[idx - 1].position + 0.01 : 0;
    const maxPos = idx < stops.length - 1 ? stops[idx + 1].position - 0.01 : 1;
    const clampedPos = Math.max(minPos, Math.min(maxPos, pos));

    const next = [...stops];
    next[idx] = { ...next[idx], position: clampedPos };
    onChange(next);
  };

  const handleTap = (id: string) => {
    const idx = stops.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const colorIdx = paletteHexes.indexOf(stops[idx].hex);
    const nextHex = paletteHexes[(colorIdx + 1) % paletteHexes.length];
    const next = [...stops];
    next[idx] = { ...next[idx], hex: nextHex };
    onChange(next);
  };

  const handleAdd = () => {
    let maxGap = 0;
    let gapIdx = 0;
    for (let i = 1; i < stops.length; i++) {
      const gap = stops[i].position - stops[i - 1].position;
      if (gap > maxGap) {
        maxGap = gap;
        gapIdx = i;
      }
    }
    const pos = (stops[gapIdx - 1].position + stops[gapIdx].position) / 2;
    const hex = lerpRgb(stops[gapIdx - 1].hex, stops[gapIdx].hex, 0.5);
    const id = `stop-${Date.now()}`;
    const next = [...stops];
    next.splice(gapIdx, 0, { id, hex, position: pos });
    onChange(next);
  };

  const handleRemove = (id: string) => {
    if (stops.length <= 2) return;
    onChange(stops.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-2">
      <div className="relative h-8 w-full">
        {/* Gradient track */}
        <div
          className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${stops
              .map((s) => `${s.hex} ${(s.position * 100).toFixed(0)}%`)
              .join(", ")})`,
          }}
        />

        {/* Stops */}
        {stops.map((stop, i) => (
          <motion.div
            key={stop.id}
            className={cn(
              "absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2",
              "h-5 w-5 cursor-grab rounded-full active:cursor-grabbing",
              "shadow-[0_0_0_2px_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.3)]",
              "transition-shadow duration-150 hover:shadow-[0_0_0_3px_rgba(255,255,255,0.9),0_2px_12px_rgba(0,0,0,0.4)]",
            )}
            style={{
              left: `${stop.position * 100}%`,
              backgroundColor: stop.hex,
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0}
            onDrag={(_, info) => {
              const rail = (info.target as HTMLElement).parentElement!;
              const railRect = rail.getBoundingClientRect();
              handleDrag(stop.id, info.point.x, railRect);
            }}
            dragMomentum={false}
            onTap={() => handleTap(stop.id)}
            onHoverStart={() => setHoveredId(stop.id)}
            onHoverEnd={() => setHoveredId(null)}
            layout
            transition={{ type: "spring", bounce: 0.3, duration: 0.3 }}
          >
            {hoveredId === stop.id && stops.length > 2 && (
              <button
                onPointerDown={(e) => {
                  e.stopPropagation();
                  handleRemove(stop.id);
                }}
                className={cn(
                  "absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full",
                  "bg-red-500 text-white",
                  "shadow-[0_1px_4px_rgba(0,0,0,0.3)]",
                )}
              >
                <X className="h-2.5 w-2.5" />
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Add button */}
      <button
        onClick={handleAdd}
        className={cn(
          "flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
          "bg-white/[0.04] text-muted-foreground",
          "transition-[background-color,color] duration-150",
          "hover:bg-white/[0.08] hover:text-foreground",
        )}
      >
        <Plus className="h-3 w-3" />
        Add Stop
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Build check**

```bash
npm run build 2>&1 | tail -20
```
Expected: no errors.

---

### Task 3: Create `src/components/gradient/AngleControl.tsx`

**Files:**
- Create: `src/components/gradient/AngleControl.tsx`

**Interfaces:**
- Consumes: angle value, onChange callback
- Produces: `<AngleControl angle onChange />`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { cn } from "@/lib/utils";

interface Props {
  angle: number;
  onChange: (angle: number) => void;
}

export function AngleControl({ angle, onChange }: Props) {
  return (
    <div className="flex items-center gap-3">
      <span className="min-w-[3rem] text-right text-xs font-medium text-muted-foreground">
        Angle
      </span>
      <input
        type="range"
        min={0}
        max={360}
        step={1}
        value={angle}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          "h-1.5 w-full cursor-pointer appearance-none rounded-full",
          "bg-white/[0.08]",
          "[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4",
          "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full",
          "[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_1px_4px_rgba(0,0,0,0.3)]",
          "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4",
          "[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full",
          "[&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-[0_1px_4px_rgba(0,0,0,0.3)]",
        )}
      />
      <span className="min-w-[3rem] text-xs font-medium text-muted-foreground tabular-nums">
        {angle}°
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Build check**

```bash
npm run build 2>&1 | tail -20
```

---

### Task 4: Create `src/components/gradient/GradientCanvas.tsx`

**Files:**
- Create: `src/components/gradient/GradientCanvas.tsx`

**Interfaces:**
- Consumes: `stops`, `angle`, `type` props
- Produces: `<GradientCanvas stops angle type />` — canvas element with mouse-reactive rendering

- [ ] **Step 1: Write the component**

```tsx
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

  // Keep latest props in refs for rAF access
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

    // Smooth mouse
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

    // Linear or Radial
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

    // Angle indicator
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

  // Render mesh gradient
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
        const x0 = gx * cellW + dx * (1 - Math.abs(gx / (cols - 1) - 0.5) * 2);
        const y0 = gy * cellH + dy * (1 - Math.abs(gy / (rows - 1) - 0.5) * 2);
        const x1 = Math.min(x0 + cellW, w);
        const y1 = Math.min(y0 + cellH, h);

        const idx = gy * cols + gx;
        const c = hexToRgb(hexes[idx % n]);

        ctx.fillStyle = `rgb(${c.r},${c.g},${c.b})`;
        ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
      }
    }
  }

  // Render soft-blur gradient
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

  // rAF loop
  useEffect(() => {
    const loop = () => {
      render();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [render]);

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => render());
    ro.observe(container);
    return () => ro.disconnect();
  }, [render]);

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
```

- [ ] **Step 2: Build check**

```bash
npm run build 2>&1 | tail -20
```

---

### Task 5: Create `src/components/gradient/GradientPhysics.tsx`

**Files:**
- Create: `src/components/gradient/GradientPhysics.tsx`

**Interfaces:**
- Consumes: palette colors (from store), gradientType (from ui-store)
- Produces: `<GradientPhysics />` — the full interactive gradient playground

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { usePaletteStore } from "@/store/palette-store";
import { useUIStore } from "@/store/ui-store";
import { GRADIENT_TYPES } from "@/constants";
import { generateGradientOutput } from "@/lib/gradients";
import { GradientCanvas } from "./GradientCanvas";
import { StopRail, type Stop } from "./StopRail";
import { AngleControl } from "./AngleControl";
import { cn } from "@/lib/utils";
import { useToastStore } from "@/store/toast-store";

export function GradientPhysics() {
  const colors = usePaletteStore((s) => s.colors);
  const gradientType = useUIStore((s) => s.gradientType);
  const setGradientType = useUIStore((s) => s.setGradientType);
  const addToast = useToastStore((s) => s.addToast);

  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<Stop[]>([]);
  const [copied, setCopied] = useState(false);

  // Initialize stops from palette colors
  useEffect(() => {
    if (colors.length === 0) {
      setStops([]);
      return;
    }
    setStops(
      colors.map((c, i) => ({
        id: `stop-${c.hex}-${i}`,
        hex: c.hex,
        position: colors.length > 1 ? i / (colors.length - 1) : 0.5,
      })),
    );
  }, [colors]);

  if (colors.length < 2) return null;

  const hexes = stops.map((s) => s.hex);
  const positions = stops.map((s) => s.position);

  const handleCopy = async () => {
    const output = generateGradientOutput(gradientType, hexes, positions, angle);
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast("Gradient copied to clipboard", "success");
  };

  return (
    <div
      className={cn(
        "rounded-xl p-6",
        "bg-white/[0.03] backdrop-blur-xl",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]",
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Gradient Physics</h3>
      </div>

      <div className="space-y-6">
        <GradientCanvas stops={stops} angle={angle} type={gradientType} />

        <StopRail
          stops={stops}
          paletteHexes={colors.map((c) => c.hex)}
          onChange={setStops}
        />

        {gradientType === "linear" && (
          <AngleControl angle={angle} onChange={setAngle} />
        )}

        {/* Type switcher */}
        <div className="relative flex rounded-full bg-white/[0.04] p-1 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]">
          {GRADIENT_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setGradientType(type)}
              className="relative z-10 flex-1 px-4 py-2 text-sm font-medium capitalize"
            >
              {gradientType === type && (
                <motion.div
                  layoutId="gradient-physics-bg"
                  className="absolute inset-0 rounded-full bg-foreground"
                  transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                />
              )}
              <span
                className={cn(
                  "relative z-10 transition-colors duration-150",
                  gradientType === type
                    ? "text-background"
                    : "text-muted-foreground",
                )}
              >
                {type === "soft-blur" ? "Soft Blur" : type}
              </span>
            </button>
          ))}
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-medium",
            "transition-[background-color,color,scale] duration-150 ease-out",
            "bg-white/[0.04] text-muted-foreground",
            "hover:bg-white/[0.08] hover:text-foreground active:scale-[0.96]",
          )}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {copied ? (
              <motion.span
                key="check"
                initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                transition={{ type: "spring", duration: 0.3, bounce: 0 }}
              >
                <Check className="h-4 w-4" />
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                transition={{ type: "spring", duration: 0.3, bounce: 0 }}
              >
                <Copy className="h-4 w-4" />
              </motion.span>
            )}
          </AnimatePresence>
          {copied ? "Copied!" : "Copy CSS"}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build check**

```bash
npm run build 2>&1 | tail -20
```

---

### Task 6: Update `src/app/page.tsx` — replace imports

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Read page.tsx**

Read the current file to identify exact lines to change.

- [ ] **Step 2: Replace GradientControls + GradientPreview with GradientPhysics**

Remove:
```tsx
import { GradientControls } from "@/components/gradient/GradientControls";
```
And the dynamic import for GradientPreview.

Add:
```tsx
import { GradientPhysics } from "@/components/gradient/GradientPhysics";
```

Replace the JSX section:
```tsx
          <Section show={hasPalette} delay={0.6}>
            <GradientPreview />
          </Section>
          <Section show={hasPalette} delay={0.7}>
            <GradientControls />
          </Section>
```
With:
```tsx
          <Section show={hasPalette} delay={0.6}>
            <GradientPhysics />
          </Section>
```

- [ ] **Step 3: Delete old files**

```bash
rm src/components/gradient/GradientControls.tsx src/components/gradient/GradientPreview.tsx
```

- [ ] **Step 4: Build check**

```bash
npm run build 2>&1 | tail -20
```
Expected: 0 errors.

---

### Task 7: Final build & verification

- [ ] **Step 1: Full build**

```bash
npm run build 2>&1
```
Expected: ✓ Compiled successfully, 0 errors, 0 warnings.

- [ ] **Step 2: Verify no remaining references**

```bash
rg "GradientControls|GradientPreview" src/ 2>/dev/null || echo "No references found"
```
Expected: "No references found"
