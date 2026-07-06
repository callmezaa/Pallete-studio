# Gradient Physics — Interactive Gradient Playground

**Date:** 2026-07-06
**Status:** Approved
**Context:** Replace existing GradientPreview + GradientControls section with an interactive playground featuring draggable color stops, mouse-reactive canvas rendering, and physics-smooth animations.

## Overview

Replace the existing `GradientPreview` + `GradientControls` section with a unified `GradientPhysics` component. The playground lets users drag gradient stops, change angle, switch types, see mouse-reactive behavior, and export CSS/SVG — all with spring animations and smooth lerp-based motion.

## Component Tree

```
GradientPhysics.tsx          — Container, local state (stops, angle, mousePos)
├── GradientCanvas.tsx       — <canvas>, DPR-aware, renders all 4 gradient types
├── StopRail.tsx             — Horizontal rail with draggable stop handles
├── AngleControl.tsx         — Range slider 0–360° + degree label
├── TypeSwitcher             — Segmented control (existing pattern, gradientType from ui-store)
└── Export button            — "Copy CSS", outputs CSS or SVG per type
```

## State

| State | Location | Type |
|-------|----------|------|
| `stops` | GradientPhysics (useState) | `Array<{id: string, hex: string, position: number}>` |
| `angle` | GradientPhysics (useState) | `number` (0–360) |
| `gradientType` | ui-store (Zustand) | `GradientType` |

No new Zustand stores. Gradient interaction state is ephemeral — not persisted, not in undo stack.

## Stop System

- **Default initialization:** palette colors → evenly spaced at `i / (n-1)`
- **Drag:** each stop is `motion.div` with `drag="x"`, constrained to rail width
- **Boundaries:** stops clamped between neighbors (min `prevPos + 0.01`, max `nextPos - 0.01`)
- **Spring:** `{ type: "spring", bounce: 0.3 }` on drag end
- **Tap:** cycles to next palette color (sequential)
- **Add:** floating `+` button, inserts at midpoint between nearest two stops, color = RGB lerp of neighbors
- **Remove:** hover reveals `×`, minimum 2 stops enforced
- **Visual:** pill handle colored with stop's hex, white border ring, thin gradient track below

## Canvas Rendering

- ResizeObserver + DPR scaling (matching existing GradientPreview pattern)
- Height: `h-64` (16rem), full width

### Per-type:
- **Linear:** `createLinearGradient` from angle endpoints. Mouse offset adds ±15° to angle.
- **Radial:** `createRadialGradient`. Mouse center follows pointer (clamped), falls back to center on leave.
- **Mesh:** Grid of vertices with palette colors, bilinear interpolation per pixel. Mouse displaces vertices (distance falloff). Export as SVG.
- **Soft-blur:** N overlapping radial blobs, `globalCompositeOperation = "screen"`, blob positions lerp toward mouse.

`AnimatePresence mode="popLayout"` wraps canvas for crossfade on type change.

## Physics & Reactivity

### Spring (Framer Motion on HTML):
- Stop drags (drag + spring release)
- Angle indicator (rotate with spring)
- Type transitions (AnimatePresence crossfade)

### Smooth mouse (rAF loop inside GradientCanvas):
- Pointer events registered on canvas element directly
- Target position stored in `useRef`, never triggers React re-render
- rAF lerps: `current = current + (target - current) * 0.08`
- On `pointerleave`, drifts back to neutral over ~300ms
- Canvas render function reads smoothed values each frame

### Intensity:
- Subtle — ±15° angle offset, ~20% center shift, mild mesh warp

## Angle Control

- `<input type="range" min={0} max={360} step={1}>` with glass styling
- Degree label on right
- Angle indicator line: rendered on canvas for linear type, rotates with spring

## Export

Single "Copy CSS" button:
- **Linear/Radial:** `linear-gradient(…)` / `radial-gradient(…)` with stop positions as percentages
- **Mesh:** SVG string (color grid rendered as SVG paths with interpolation)
- **Soft-blur:** SVG with `<filter>` and `feGaussianBlur` for overlapping blobs

## Styling

Glass card container matching project pattern:
```
bg-white/[0.03] backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset] p-6 rounded-xl space-y-6
```

All animations respect `prefers-reduced-motion`.

## File Changes

| Action | File |
|--------|------|
| DELETE | `src/components/gradient/GradientControls.tsx` |
| DELETE | `src/components/gradient/GradientPreview.tsx` |
| CREATE | `src/components/gradient/GradientPhysics.tsx` |
| CREATE | `src/components/gradient/GradientCanvas.tsx` |
| CREATE | `src/components/gradient/StopRail.tsx` |
| CREATE | `src/components/gradient/AngleControl.tsx` |
| UPDATE | `src/lib/gradients.ts` — stop-position CSS, mesh SVG export, soft-blur SVG |
| UPDATE | `src/app/page.tsx` — replace GradientPreview + GradientControls imports with GradientPhysics |

## No-Go Areas

- No new Zustand stores or persist
- No color picker dependency (tap-to-cycle only)
- No Web Worker (Turbopack incompatible)
- No undo/redo for gradient changes
- No collapsible sections
