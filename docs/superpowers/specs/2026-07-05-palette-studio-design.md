# Palette Studio — Design Spec

> Version: alpha · Date: 2026-07-05
> Source: AGENT.md · Implementation.md

## Vision

Membuat color extraction menjadi pengalaman visual yang menyenangkan, elegan, dan berguna — terasa seperti design tool modern (Apple, Linear, Vercel, Framer), bukan utility biasa.

## Target Users

UI Designer, Product Designer, Frontend Developer, Creative Developer, Branding Designer, Motion Designer, Students, Digital Artists

## Design Principles

Less but Better · Premium Digital Experience · Minimalism · Motion with Purpose · Visual Consistency · Accessibility First · Performance First · Clean Architecture

## Visual Direction

- Dark Theme First
- Glassmorphism ringan
- Soft Gradient
- Elegant Blur
- Large White Space
- Smooth Rounded Corners
- Minimal UI
- Floating Cards
- Soft Shadow
- Premium Typography (Geist headings, Inter body, Geist Mono code)

## Color System

- Primary: White
- Secondary: Neutral Gray
- Accent: Dynamic (mengikuti palette hasil ekstraksi)

## Core Features

1. **Image Upload** — Drag & Drop, Browse File, Paste Image (PNG/JPG/WEBP)
2. **Smart Color Extraction** — Ekstrak warna dominan, generate palette harmonis, sort by dominance + percentage
3. **Multiple Color Formats** — HEX, RGB, HSL, OKLCH, CSS Variable, one-click copy
4. **Smart Palette Naming** — Nama elegan otomatis (Midnight Graphite, Ocean Breeze, dll)
5. **Mood Detection** — Luxury, Modern, Elegant, Minimal, Cyber, Nature, dll — ditampilkan sebagai badge
6. **Gradient Generator** — Linear, Radial, Mesh Style, Soft Blur — preview + copy CSS/Tailwind + export SVG
7. **UI Preview** — Warna diterapkan ke mockup (Hero, Card, Button, Navbar, Badge, Input, Glass Card)
8. **Live Theme Preview** — Background berubah smooth sesuai palette
9. **Interactive Color Cards** — Hover (scale, glow, shadow), Click (copy + ripple), Double-click (pin)
10. **Export** — CSS Variables, Tailwind Config, JSON, SCSS Variables, Design Tokens
11. **Share Palette** — Generate unique URL (/palette/[id])

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 + React 19 + TypeScript |
| Styling | Tailwind CSS + shadcn/ui + CVA + tailwind-merge |
| Animation | Framer Motion (reveal/hover/card/layout) + GSAP (timeline/gradient/complex) |
| State | Zustand (4 stores: palette, upload, UI, export) |
| Canvas | Canvas API via requestAnimationFrame |
| Color | Color Thief in Web Worker |
| Icons | Lucide React |
| Utilities | react-dropzone, sonner, html-to-image |

## Architecture

### Pages
- `/` — Main single-page app (scroll-based sections)
- `/palette/[id]` — Shared palette (read-only)

### Folder Structure
```
src/
  app/
    page.tsx
    layout.tsx
    globals.css
    palette/[id]/page.tsx
  components/
    upload/     → Dropzone, ImagePreview
    palette/    → ColorCard, PaletteGrid, PaletteNaming
    gradient/   → GradientPreview, GradientControls
    preview/    → UIPreview, HeroPreview, CardPreview, etc
    export/     → ExportPanel, ExportFormatButton
    motion/     → Reveal, Stagger, FadeIn, etc (Framer Motion wrappers)
    ui/         → GlassCard, Badge, Button, etc (shared primitives)
  hooks/
  store/        → usePaletteStore, useUploadStore, useUIStore, useExportStore
  lib/          → color extraction logic, color utilities
  utils/        → cn(), formaters, etc
  types/        → TypeScript types/interfaces
  constants/    → colors, moods, naming data
  styles/
  workers/      → color-thief.worker.ts
```

### State Management (Zustand)
- `usePaletteStore` — extracted colors[], selectedColor, pinnedColors[], isExtracting
- `useUploadStore` — image, preview, isUploading, error
- `useUIStore` — theme, activePanel, reducedMotion
- `useExportStore` — format, data, isExporting

### Data Flow
1. User uploads image → UploadStore updates → ImagePreview render
2. Image loaded → Web Worker starts Color Thief → PaletteStore populated
3. PaletteStore updates → PaletteGrid, GradientGenerator, UIPreview, MoodBadges re-render
4. User interacts (copy, pin, export) → respective store/handler updates

### Color Extraction — Web Worker Strategy
- Color Thief runs in Web Worker via `new Worker()`
- Worker receives ImageData, returns `{ hex, rgb, percentage }[]`
- Fallback: if worker fails, run on main thread
- Post-process: sort by dominance, generate harmonies, detect mood

### Motion Strategy
- Framer Motion: entry animations, hover effects, layout transitions, stagger children, copy feedback
- GSAP: gradient animation timeline, premium intro sequence, canvas-based motion
- All animations respect `prefers-reduced-motion`

### Canvas Strategy
- Canvas untuk: gradient preview, animated gradient background
- React controls state only; Canvas handles rendering via rAF
- Cleanup on unmount, resize observer, DPR support

## Performance Targets
- Lighthouse ≥ 95
- First Load < 2s
- 60 FPS Animation
- Dynamic import for heavy components (gradient, canvas, export)
- Web Worker for color extraction
- Memoization dengan useMemo/useCallback
- Stable references di store selectors

## Accessibility
- Semantic HTML
- Keyboard navigation
- Focus ring
- ARIA labels
- Screen reader support
- `prefers-reduced-motion`
- Color contrast WCAG AA

## Milestones (Implementation Order)

| # | Milestone | Key Deliverables |
|---|-----------|-----------------|
| 1 | Foundation | Scaffold Next.js, Tailwind, shadcn/ui, folder structure, theme |
| 2 | Upload Experience | Dropzone, drag & drop, paste, preview with fade-in |
| 3 | Color Extraction | Web Worker, Color Thief, palette data, percentage |
| 4 | Interactive Palette | ColorCard, grid, hover/click/copy/pin, format toggle |
| 5 | Palette Naming + Mood | Name generation, mood detection, premium badges |
| 6 | Gradient Generator | Linear/Radial/Mesh/Blur, Canvas preview, copy/export |
| 7 | UI Preview | Live mockup components with extracted palette |
| 8 | Live Theme | Dynamic background, smooth transitions |
| 9 | Export System | CSS, Tailwind, JSON, SCSS, Design Tokens |
| 10 | Share Palette | /palette/[id] route, URL generation |
| 11 | Motion Polish | GSAP intro, refined animations, reduced-motion |
| 12 | Performance + A11y | Audit, optimization, final polish |
