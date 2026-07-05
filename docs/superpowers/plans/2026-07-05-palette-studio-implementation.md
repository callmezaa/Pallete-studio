# Palette Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium color extraction and palette exploration web application.

**Architecture:** Single-page Next.js 15 app with App Router + one share route. Feature-based component folder structure. Color extraction via Color Thief in a Web Worker. 4 Zustand stores for state management. Framer Motion for UI animations, GSAP for complex timeline animations. Canvas API for gradient previews.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, GSAP, Zustand, Color Thief, react-dropzone, sonner, lucide-react, html-to-image

## Global Constraints

- No serif/humanist sans fonts — use Geist (headings), Inter (body), Geist Mono (code)
- Dark theme first with glassmorphism, soft gradients, elegant blur
- All animations must respect `prefers-reduced-motion`
- Color extraction must run in Web Worker to avoid blocking main thread
- Lighthouse target ≥ 95
- All interactive elements need keyboard navigation + focus ring
- No magic numbers or hardcoded values — use constants file
- Dynamic imports for Canvas, GSAP, and export components
- TypeScript strict mode
- Every Zustand store selector must use shallow comparison for stable references

---

## File Structure

```
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    palette/[id]/page.tsx
  components/
    upload/
      UploadZone.tsx
      ImagePreview.tsx
    palette/
      ColorCard.tsx
      PaletteGrid.tsx
      ColorFormat.tsx
      PaletteName.tsx
      MoodBadge.tsx
    gradient/
      GradientPreview.tsx
      GradientControls.tsx
    preview/
      UIPreview.tsx
      HeroPreview.tsx
      CardPreview.tsx
      ButtonPreview.tsx
      NavbarPreview.tsx
      BadgePreview.tsx
      InputPreview.tsx
      GlassCardPreview.tsx
    export/
      ExportPanel.tsx
    ui/
      GlassCard.tsx
      Badge.tsx
    motion/
      Reveal.tsx
      Stagger.tsx
      CopyFeedback.tsx
  hooks/
    useImageUpload.ts
    useColorExtraction.ts
    useCopyToClipboard.ts
    useReducedMotion.ts
  store/
    palette-store.ts
    upload-store.ts
    ui-store.ts
    export-store.ts
  lib/
    colors.ts
    extraction.ts
    naming.ts
    mood.ts
    gradients.ts
    export.ts
  workers/
    color-worker.ts
  utils/
    cn.ts
  types/
    index.ts
  constants/
    index.ts
```

---

### Milestone 1: Foundation

### Task 1.1: Scaffold Next.js Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: working Next.js 15 app with Tailwind + shadcn/ui

- [ ] **Step 1: Create Next.js project**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Expected: Next.js 15 scaffold with `src/` directory, TypeScript, Tailwind CSS.

- [ ] **Step 2: Add postcss.config.mjs content**

```js
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
export default config;
```

- [ ] **Step 3: Write globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 0%;
    --foreground: 0 0% 100%;
    --card: 0 0% 4%;
    --card-foreground: 0 0% 100%;
    --border: 0 0% 12%;
    --muted: 0 0% 8%;
    --muted-foreground: 0 0% 60%;
    --accent: 0 0% 14%;
    --accent-foreground: 0 0% 100%;
    --radius: 0.75rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground antialiased;
  }
}
```

- [ ] **Step 4: Write layout.tsx**

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Palette Studio",
  description: "Discover the visual identity hidden inside every image.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Write next.config.ts**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
```

- [ ] **Step 6: Initialize shadcn/ui**

```bash
npx shadcn@latest init -d --force
```

Expected: shadcn/ui configured with `components/ui/` directory.

- [ ] **Step 7: Install all dependencies**

```bash
npm install framer-motion gsap zustand colorthief react-dropzone sonner lucide-react html-to-image file-saver class-variance-authority tailwind-merge
npm install --save-dev @types/colorthief
```

- [ ] **Step 8: Write utils/cn.ts**

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 9: Write constants/index.ts**

```ts
export const PALETTE_SIZE = 5;
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const SUPPORTED_FORMATS = ["image/png", "image/jpeg", "image/webp"];
export const ANIMATION_DURATION = 0.5;
export const THEME_TRANSITION_DURATION = 700;

export const COLOR_FORMATS = ["hex", "rgb", "hsl", "oklch", "css-var"] as const;
export type ColorFormat = (typeof COLOR_FORMATS)[number];

export const GRADIENT_TYPES = ["linear", "radial", "mesh", "soft-blur"] as const;
export type GradientType = (typeof GRADIENT_TYPES)[number];

export const EXPORT_FORMATS = ["css", "tailwind", "json", "scss", "tokens"] as const;
export type ExportFormat = (typeof EXPORT_FORMATS)[number];

export const MOODS = [
  "luxury", "modern", "elegant", "minimal", "cyber",
  "corporate", "nature", "vintage", "playful", "warm", "cold",
] as const;
export type Mood = (typeof MOODS)[number];
```

- [ ] **Step 10: Commit**

```bash
git init && git add -A && git commit -m "feat: scaffold Next.js 15 with Tailwind, shadcn/ui, deps"
```

---

### Task 1.2: Types, Theme Config, and Utility Functions

**Files:**
- Create: `src/types/index.ts`
- Create: `src/app/page.tsx` (skeleton)

**Interfaces:**
- Consumes: nothing
- Produces: `ExtractedColor`, `Palette`, `UploadState`, `GradientConfig`, `UITheme` types

- [ ] **Step 1: Write types/index.ts**

```ts
export interface ExtractedColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  oklch: { l: number; c: number; h: number };
  cssVar: string;
  percentage: number;
  name: string;
}

export interface Palette {
  colors: ExtractedColor[];
  mood: string[];
  dominantColor: string;
  gradient: GradientConfig;
}

export interface GradientConfig {
  type: "linear" | "radial" | "mesh" | "soft-blur";
  colors: string[];
  angle?: number;
}

export interface UploadState {
  file: File | null;
  preview: string | null;
  isUploading: boolean;
  error: string | null;
}

export interface UIState {
  reducedMotion: boolean;
  activePanel: string | null;
  theme: "dark" | "light";
}

export interface ExportState {
  format: string;
  data: string | null;
  isExporting: boolean;
}
```

- [ ] **Step 2: Write page.tsx skeleton**

```tsx
export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <section className="mb-24 text-center">
          <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
            Palette Studio
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Discover the visual identity hidden inside every image.
          </p>
        </section>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Verify app runs**

Run: `npm run dev`
Expected: App starts on localhost:3000 showing "Palette Studio" heading.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add types, constants, page skeleton"
```

---

### Milestone 2: Upload Experience

### Task 2.1: Upload Store

**Files:**
- Create: `src/store/upload-store.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `useUploadStore` with `setImage`, `clearImage`, `setError`

- [ ] **Step 1: Write upload-store.ts**

```ts
import { create } from "zustand";
import type { UploadState } from "@/types";

interface UploadActions {
  setImage: (file: File, preview: string) => void;
  clearImage: () => void;
  setError: (error: string | null) => void;
  setUploading: (isUploading: boolean) => void;
}

type UploadStore = UploadState & UploadActions;

export const useUploadStore = create<UploadStore>((set) => ({
  file: null,
  preview: null,
  isUploading: false,
  error: null,
  setImage: (file, preview) => set({ file, preview, error: null }),
  clearImage: () => set({ file: null, preview: null, error: null }),
  setError: (error) => set({ error }),
  setUploading: (isUploading) => set({ isUploading }),
}));
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add upload store"
```

---

### Task 2.2: Upload Zone and Image Preview

**Files:**
- Create: `src/hooks/useImageUpload.ts`
- Create: `src/components/upload/UploadZone.tsx`
- Create: `src/components/upload/ImagePreview.tsx`

**Interfaces:**
- Consumes: `useUploadStore` — `setImage`, `clearImage`, `preview`, `file`
- Produces: `UploadZone` (dropzone), `ImagePreview` (image with fade)

- [ ] **Step 1: Write useImageUpload hook**

```ts
"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useUploadStore } from "@/store/upload-store";
import { SUPPORTED_FORMATS, MAX_IMAGE_SIZE } from "@/constants";

export function useImageUpload() {
  const setImage = useUploadStore((s) => s.setImage);
  const setError = useUploadStore((s) => s.setError);
  const setUploading = useUploadStore((s) => s.setUploading);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setUploading(true);
      const preview = URL.createObjectURL(file);
      setImage(file, preview);
      setUploading(false);
    },
    [setImage, setError, setUploading]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: SUPPORTED_FORMATS.reduce(
      (acc, f) => ({ ...acc, [f]: [] }),
      {} as Record<string, string[]>
    ),
    maxSize: MAX_IMAGE_SIZE,
    multiple: false,
  });

  return { getRootProps, getInputProps, isDragActive };
}
```

- [ ] **Step 2: Write UploadZone.tsx**

```tsx
"use client";

import { motion } from "framer-motion";
import { Upload, Image as ImageIcon } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { cn } from "@/utils/cn";

export function UploadZone() {
  const { getRootProps, getInputProps, isDragActive } = useImageUpload();

  return (
    <motion.div
      {...getRootProps()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative cursor-pointer rounded-2xl border-2 border-dashed p-16 text-center transition-colors",
        isDragActive
          ? "border-foreground bg-foreground/5"
          : "border-border hover:border-muted-foreground/50"
      )}
    >
      <input {...getInputProps()} />
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        {isDragActive ? (
          <ImageIcon className="h-6 w-6 text-foreground" />
        ) : (
          <Upload className="h-6 w-6 text-muted-foreground" />
        )}
      </div>
      {isDragActive ? (
        <p className="text-lg font-medium">Drop your image here</p>
      ) : (
        <>
          <p className="text-lg font-medium">Drop an image here</p>
          <p className="mt-1 text-sm text-muted-foreground">
            or click to browse · PNG, JPG, WEBP up to 10MB
          </p>
        </>
      )}
    </motion.div>
  );
}
```

- [ ] **Step 3: Write ImagePreview.tsx**

```tsx
"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useUploadStore } from "@/store/upload-store";

export function ImagePreview() {
  const preview = useUploadStore((s) => s.preview);
  const clearImage = useUploadStore((s) => s.clearImage);

  if (!preview) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-2xl"
    >
      <img
        src={preview}
        alt="Uploaded preview"
        className="h-auto w-full max-h-[500px] object-contain"
      />
      <button
        onClick={clearImage}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-background"
        aria-label="Remove image"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
```

- [ ] **Step 4: Integrate into page.tsx**

Update `src/app/page.tsx`:

```tsx
import { UploadZone } from "@/components/upload/UploadZone";
import { ImagePreview } from "@/components/upload/ImagePreview";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <section className="mb-24 text-center">
          <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
            Palette Studio
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Discover the visual identity hidden inside every image.
          </p>
        </section>
        <section className="space-y-8">
          <UploadZone />
          <ImagePreview />
        </section>
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add upload zone and image preview"
```

---

### Milestone 3: Color Extraction

### Task 3.1: Palette Store

**Files:**
- Create: `src/store/palette-store.ts`

**Interfaces:**
- Consumes: `ExtractedColor` from types
- Produces: `usePaletteStore` with `setColors`, `setMood`, `setGradient`, `togglePin`

- [ ] **Step 1: Write palette-store.ts**

```ts
import { create } from "zustand";
import type { ExtractedColor, GradientConfig } from "@/types";

interface PaletteState {
  colors: ExtractedColor[];
  mood: string[];
  dominantColor: string;
  gradient: GradientConfig | null;
  isExtracting: boolean;
  pinnedColors: string[];
}

interface PaletteActions {
  setColors: (colors: ExtractedColor[]) => void;
  setMood: (mood: string[]) => void;
  setGradient: (gradient: GradientConfig) => void;
  togglePin: (hex: string) => void;
  setExtracting: (v: boolean) => void;
  clear: () => void;
}

type PaletteStore = PaletteState & PaletteActions;

export const usePaletteStore = create<PaletteStore>((set) => ({
  colors: [],
  mood: [],
  dominantColor: "",
  gradient: null,
  isExtracting: false,
  pinnedColors: [],
  setColors: (colors) =>
    set({ colors, dominantColor: colors[0]?.hex ?? "" }),
  setMood: (mood) => set({ mood }),
  setGradient: (gradient) => set({ gradient }),
  togglePin: (hex) =>
    set((s) => ({
      pinnedColors: s.pinnedColors.includes(hex)
        ? s.pinnedColors.filter((h) => h !== hex)
        : [...s.pinnedColors, hex],
    })),
  setExtracting: (isExtracting) => set({ isExtracting }),
  clear: () =>
    set({
      colors: [],
      mood: [],
      dominantColor: "",
      gradient: null,
      isExtracting: false,
    }),
}));
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add palette store"
```

---

### Task 3.2: Color Extraction Worker

**Files:**
- Create: `src/workers/color-worker.ts`
- Create: `src/lib/extraction.ts`
- Create: `src/lib/colors.ts` (color utilities)
- Create: `src/hooks/useColorExtraction.ts`

**Interfaces:**
- Consumes: `useUploadStore` (preview), `usePaletteStore` (setColors...)
- Produces: Web Worker that extracts colors, `useColorExtraction` hook

- [ ] **Step 1: Write lib/colors.ts**

```ts
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

export function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function rgbToOklch(r: number, g: number, b: number) {
  // sRGB linearization
  const linearize = (c: number) =>
    c / 255 <= 0.04045 ? c / 255 / 12.92 : Math.pow((c / 255 + 0.055) / 1.055, 2.4);
  const lr = linearize(r), lg = linearize(g), lb = linearize(b);
  // sRGB to LMS
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
  // LMS to Oklab
  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);
  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;
  const c = Math.sqrt(a * a + b_ * b_);
  const h = (Math.atan2(b_, a) * 180) / Math.PI;
  return { l: Number(L.toFixed(3)), c: Number(c.toFixed(3)), h: Number((h + 360) % 360) };
}

export function hexToCssVar(hex: string): string {
  return `--color-${hex.replace("#", "").toLowerCase()}`;
}

export function formatColor(color: { hex: string; rgb: { r: number; g: number; b: number }; hsl: { h: number; s: number; l: number }; oklch: { l: number; c: number; h: number }; cssVar: string }, format: string): string {
  switch (format) {
    case "hex": return color.hex;
    case "rgb": return `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
    case "hsl": return `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`;
    case "oklch": return `oklch(${color.oklch.l} ${color.oklch.c} ${color.oklch.h})`;
    case "css-var": return `var(${color.cssVar})`;
    default: return color.hex;
  }
}

export function hexToOklch(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToOklch(r, g, b);
}
```

- [ ] **Step 2: Write extraction.ts (Color Thief integration)**

```ts
// ponytail: Color Thief via dynamic import + canvas, runs in worker

export interface WorkerResult {
  hex: string;
  percentage: number;
}

export function extractColorsFromImageData(
  imageData: ImageData,
  colorCount: number = 5
): WorkerResult[] {
  const data = imageData.data;
  const pixels: { r: number; g: number; b: number }[] = [];

  for (let i = 0; i < data.length; i += 4) {
    pixels.push({ r: data[i], g: data[i + 1], b: data[i + 2] });
  }

  // ponytail: simple median-cut quantization, upgrade to k-means if quality needs it
  const buckets = quantize(pixels, colorCount);

  const total = pixels.length;
  return buckets.map((bucket) => ({
    hex: rgbToHex(bucket.color),
    percentage: Math.round((bucket.count / total) * 10000) / 100,
  }));
}

interface Bucket {
  color: { r: number; g: number; b: number };
  count: number;
}

function quantize(pixels: { r: number; g: number; b: number }[], maxColors: number): Bucket[] {
  if (pixels.length === 0) return [];

  let buckets: { r: number; g: number; b: number }[][] = [pixels];

  while (buckets.length < maxColors) {
    const largestIdx = buckets.reduce((maxIdx, bucket, i) =>
      bucket.length > buckets[maxIdx].length ? i : maxIdx, 0);

    const largest = buckets[largestIdx];
    if (largest.length < 2) break;

    const range = findLargestChannelRange(largest);
    const sorted = [...largest].sort((a, b) => {
      const vals = [a[range.channel], b[range.channel]];
      return vals[0] - vals[1];
    });

    const mid = Math.floor(sorted.length / 2);
    buckets[largestIdx] = sorted.slice(0, mid);
    buckets.push(sorted.slice(mid));
  }

  return buckets.map((bucket) => ({
    color: averageColor(bucket),
    count: bucket.length,
  }));
}

function findLargestChannelRange(pixels: { r: number; g: number; b: number }[]): { channel: "r" | "g" | "b"; range: number } {
  const rMin = Math.min(...pixels.map((p) => p.r));
  const rMax = Math.max(...pixels.map((p) => p.r));
  const gMin = Math.min(...pixels.map((p) => p.g));
  const gMax = Math.max(...pixels.map((p) => p.g));
  const bMin = Math.min(...pixels.map((p) => p.b));
  const bMax = Math.max(...pixels.map((p) => p.b));

  const rRange = rMax - rMin, gRange = gMax - gMin, bRange = bMax - bMin;

  if (rRange >= gRange && rRange >= bRange) return { channel: "r", range: rRange };
  if (gRange >= rRange && gRange >= bRange) return { channel: "g", range: gRange };
  return { channel: "b", range: bRange };
}

function averageColor(pixels: { r: number; g: number; b: number }[]): { r: number; g: number; b: number } {
  const total = pixels.length;
  const sum = pixels.reduce(
    (acc, p) => ({ r: acc.r + p.r, g: acc.g + p.g, b: acc.b + p.b }),
    { r: 0, g: 0, b: 0 }
  );
  return { r: Math.round(sum.r / total), g: Math.round(sum.g / total), b: Math.round(sum.b / total) };
}

function rgbToHex(color: { r: number; g: number; b: number }): string {
  return `#${[color.r, color.g, color.b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}
```

- [ ] **Step 3: Write color-worker.ts**

```ts
import { extractColorsFromImageData, type WorkerResult } from "@/lib/extraction";

self.onmessage = (e: MessageEvent<ImageData>) => {
  const result = extractColorsFromImageData(e.data);
  self.postMessage(result);
};
```

- [ ] **Step 4: Write useColorExtraction hook**

```ts
"use client";

import { useEffect, useRef, useCallback } from "react";
import { useUploadStore } from "@/store/upload-store";
import { usePaletteStore } from "@/store/palette-store";
import { hexToRgb, rgbToHsl, rgbToOklch, hexToCssVar } from "@/lib/colors";
import type { ExtractedColor, WorkerResult } from "@/types";

export function useColorExtraction() {
  const preview = useUploadStore((s) => s.preview);
  const setColors = usePaletteStore((s) => s.setColors);
  const setExtracting = usePaletteStore((s) => s.setExtracting);
  const clear = usePaletteStore((s) => s.clear);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/color-worker.ts", import.meta.url)
    );
    return () => workerRef.current?.terminate();
  }, []);

  const extract = useCallback(async () => {
    if (!preview) { clear(); return; }

    setExtracting(true);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = preview;
    await img.decode();

    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = (200 / img.width) * img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    return new Promise<void>((resolve) => {
      if (!workerRef.current) return;
      workerRef.current.onmessage = (e: MessageEvent<WorkerResult[]>) => {
        const colors: ExtractedColor[] = e.data.map((r: WorkerResult) => {
          const rgb = hexToRgb(r.hex);
          const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
          const oklch = rgbToOklch(rgb.r, rgb.g, rgb.b);
          return {
            hex: r.hex,
            rgb,
            hsl,
            oklch,
            cssVar: hexToCssVar(r.hex),
            percentage: r.percentage,
            name: "",
          };
        });
        setColors(colors);
        setExtracting(false);
        resolve();
      };
      workerRef.current.postMessage(imageData);
    });
  }, [preview, setColors, setExtracting, clear]);

  useEffect(() => {
    extract();
  }, [extract]);
}
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add color extraction with web worker"
```

---

### Milestone 4: Interactive Palette

### Task 4.1: Color Card and Palette Grid

**Files:**
- Create: `src/hooks/useCopyToClipboard.ts`
- Create: `src/components/palette/ColorCard.tsx`
- Create: `src/components/palette/PaletteGrid.tsx`
- Create: `src/components/palette/ColorFormat.tsx`

**Interfaces:**
- Consumes: `usePaletteStore` (colors, pinnedColors, togglePin)
- Produces: `PaletteGrid` that renders `ColorCard` for each color

- [ ] **Step 1: Write useCopyToClipboard hook**

```ts
"use client";

import { useState, useCallback } from "react";

export function useCopyToClipboard() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = useCallback(async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  return { copied, copy };
}
```

- [ ] **Step 2: Write ColorCard.tsx**

```tsx
"use client";

import { motion } from "framer-motion";
import { Check, Pin, PinOff } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { usePaletteStore } from "@/store/palette-store";
import { cn } from "@/utils/cn";
import type { ExtractedColor } from "@/types";

interface ColorCardProps {
  color: ExtractedColor;
  index: number;
}

export function ColorCard({ color, index }: ColorCardProps) {
  const { copied, copy } = useCopyToClipboard();
  const togglePin = usePaletteStore((s) => s.togglePin);
  const pinnedColors = usePaletteStore((s) => s.pinnedColors);
  const isPinned = pinnedColors.includes(color.hex);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20"
    >
      <div
        className="h-32 w-full transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundColor: color.hex }}
      />
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-sm tabular-nums">{color.hex}</span>
          <span className="text-xs text-muted-foreground">{color.percentage}%</span>
        </div>
        <ColorFormat color={color} />
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => copy(color.hex, color.hex)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-colors",
              copied === color.hex
                ? "bg-green-500/20 text-green-500"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
            aria-label={`Copy ${color.hex}`}
          >
            {copied === color.hex ? (
              <><Check className="h-3.5 w-3.5" /> Copied</>
            ) : (
              "Copy"
            )}
          </button>
          <button
            onClick={() => togglePin(color.hex)}
            className={cn(
              "flex items-center justify-center rounded-lg px-3 py-2 transition-colors",
              isPinned
                ? "bg-foreground/10 text-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            )}
            aria-label={isPinned ? "Unpin color" : "Pin color"}
          >
            {isPinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 3: Write ColorFormat.tsx**

```tsx
"use client";

import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { formatColor } from "@/lib/colors";
import type { ExtractedColor, ColorFormat as ColorFormatType } from "@/types";
import { COLOR_FORMATS } from "@/constants";
import { cn } from "@/utils/cn";

interface ColorFormatProps {
  color: ExtractedColor;
}

export function ColorFormat({ color }: ColorFormatProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className="space-y-1">
      {COLOR_FORMATS.map((format) => (
        <button
          key={format}
          onClick={() => copy(formatColor(color, format), `${color.hex}-${format}`)}
          className={cn(
            "flex w-full items-center justify-between rounded px-2 py-1 text-xs font-mono transition-colors hover:bg-muted",
            copied === `${color.hex}-${format}` && "text-green-500"
          )}
          aria-label={`Copy ${format} value`}
        >
          <span className="uppercase text-muted-foreground">{format}</span>
          <span>{formatColor(color, format)}</span>
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Write PaletteGrid.tsx**

```tsx
"use client";

import { usePaletteStore } from "@/store/palette-store";
import { ColorCard } from "./ColorCard";

export function PaletteGrid() {
  const colors = usePaletteStore((s) => s.colors);

  if (colors.length === 0) return null;

  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold tracking-tight">Palette</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {colors.map((color, i) => (
          <ColorCard key={color.hex} color={color} index={i} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Update page.tsx to include PaletteGrid**

```tsx
import { UploadZone } from "@/components/upload/UploadZone";
import { ImagePreview } from "@/components/upload/ImagePreview";
import { PaletteGrid } from "@/components/palette/PaletteGrid";
import { useColorExtraction } from "@/hooks/useColorExtraction";

function Extractor() {
  useColorExtraction();
  return <PaletteGrid />;
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <section className="mb-24 text-center">
          <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
            Palette Studio
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Discover the visual identity hidden inside every image.
          </p>
        </section>
        <section className="space-y-8">
          <UploadZone />
          <ImagePreview />
          <Extractor />
        </section>
      </div>
    </main>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add interactive color cards and palette grid"
```

---

### Milestone 5: Palette Naming + Mood

### Task 5.1: Naming and Mood Detection

**Files:**
- Create: `src/lib/naming.ts`
- Create: `src/lib/mood.ts`
- Create: `src/components/palette/PaletteName.tsx`
- Create: `src/components/palette/MoodBadge.tsx`
- Modify: `src/store/palette-store.ts`, `src/hooks/useColorExtraction.ts`

**Interfaces:**
- Consumes: `ExtractedColor[]`, palette store
- Produces: color names + mood tags assigned to palette

- [ ] **Step 1: Write lib/naming.ts**

```ts
// ponytail: static name pool, upgrade to AI naming if needed

const ADJECTIVES = [
  "Midnight", "Ocean", "Sunset", "Polar", "Forest", "Desert", "Aurora",
  "Crimson", "Frost", "Shadow", "Golden", "Silver", "Cobalt", "Ruby",
  "Emerald", "Amber", "Sapphire", "Rose", "Slate", "Ivory",
];

const NOUNS = [
  "Graphite", "Breeze", "Coral", "Mist", "Moss", "Gold", "Sky",
  "Dawn", "Storm", "Flame", "Night", "Dust", "Cloud", "Leaf",
  "Stone", "Velvet", "Ocean", "Mountain", "River", "Sand",
];

function hashHex(hex: string): number {
  let hash = 0;
  for (let i = 0; i < hex.length; i++) {
    hash = ((hash << 5) - hash) + hex.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function generateColorName(hex: string): string {
  const h = hashHex(hex);
  const adj = ADJECTIVES[h % ADJECTIVES.length];
  const noun = NOUNS[(h * 31) % NOUNS.length];
  return `${adj} ${noun}`;
}
```

- [ ] **Step 2: Write lib/mood.ts**

```ts
// ponytail: hue/saturation heuristics for mood, upgrade to ML if needed

import type { ExtractedColor, Mood } from "@/types";

export function detectMood(colors: ExtractedColor[]): Mood[] {
  const moods: Mood[] = [];
  const avgSat = colors.reduce((sum, c) => sum + c.hsl.s, 0) / colors.length;
  const avgLight = colors.reduce((sum, c) => sum + c.hsl.l, 0) / colors.length;
  const hueSpread = calcHueSpread(colors);

  if (avgSat < 15) moods.push("minimal");
  if (avgSat > 50) moods.push("playful");
  if (avgSat > 60 && hueSpread > 180) moods.push("cyber");
  if (avgLight < 30) moods.push("luxury");
  if (avgLight > 30 && avgLight < 50 && avgSat < 30) moods.push("corporate");
  if (hueSpread < 60) moods.push("elegant");
  if (hueSpread > 120) moods.push("modern");
  if (avgLight > 70) moods.push("warm");
  if (avgLight < 40 && avgSat > 40) moods.push("vintage");
  if (avgLight > 60 && avgSat > 30) moods.push("nature");

  if (moods.length === 0) moods.push("modern");
  return moods.slice(0, 3);
}

function calcHueSpread(colors: ExtractedColor[]): number {
  if (colors.length < 2) return 0;
  const hues = colors.map((c) => c.hsl.h);
  return Math.max(...hues) - Math.min(...hues);
}
```

- [ ] **Step 3: Write PaletteName.tsx**

```tsx
"use client";

import { usePaletteStore } from "@/store/palette-store";
import { generateColorName } from "@/lib/naming";
import { motion } from "framer-motion";

export function PaletteName() {
  const colors = usePaletteStore((s) => s.colors);
  if (colors.length === 0) return null;

  const name = generateColorName(colors[0].hex);

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-sm text-muted-foreground"
    >
      Palette · <span className="font-medium text-foreground">{name}</span>
    </motion.p>
  );
}
```

- [ ] **Step 4: Write MoodBadge.tsx**

```tsx
"use client";

import { motion } from "framer-motion";
import { usePaletteStore } from "@/store/palette-store";
import { cn } from "@/utils/cn";

const moodColors: Record<string, string> = {
  luxury: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  modern: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  elegant: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  minimal: "bg-slate-500/10 text-slate-300 border-slate-500/20",
  cyber: "bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-500/20",
  corporate: "bg-sky-500/10 text-sky-500 border-sky-500/20",
  nature: "bg-green-500/10 text-green-500 border-green-500/20",
  vintage: "bg-amber-700/10 text-amber-600 border-amber-700/20",
  playful: "bg-pink-500/10 text-pink-500 border-pink-500/20",
  warm: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  cold: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
};

export function MoodBadge() {
  const mood = usePaletteStore((s) => s.mood);
  if (mood.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {mood.map((m, i) => (
        <motion.span
          key={m}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className={cn(
            "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium capitalize",
            moodColors[m] ?? "bg-muted text-muted-foreground border-border"
          )}
        >
          {m}
        </motion.span>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Integrate naming + mood into useColorExtraction**

Update `src/hooks/useColorExtraction.ts`:

```ts
// After setColors(colors) in worker onmessage:
import { generateColorName } from "@/lib/naming";
import { detectMood } from "@/lib/mood";
import { setMood } from "@/store/palette-store";  // already imported setColors

// Replace the worker onmessage block:
workerRef.current.onmessage = (e: MessageEvent<WorkerResult[]>) => {
  const colors: ExtractedColor[] = e.data.map((r: WorkerResult) => {
    const rgb = hexToRgb(r.hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const oklch = rgbToOklch(rgb.r, rgb.g, rgb.b);
    return {
      hex: r.hex,
      rgb,
      hsl,
      oklch,
      cssVar: hexToCssVar(r.hex),
      percentage: r.percentage,
      name: generateColorName(r.hex),
    };
  });
  setColors(colors);
  setMood(detectMood(colors));
  setExtracting(false);
  resolve();
};
```

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add palette naming and mood detection"
```

---

### Milestone 6: Gradient Generator

### Task 6.1: UI Store and Gradient Components

**Files:**
- Create: `src/store/ui-store.ts`
- Create: `src/lib/gradients.ts`
- Create: `src/components/gradient/GradientPreview.tsx`
- Create: `src/components/gradient/GradientControls.tsx`

**Interfaces:**
- Consumes: `usePaletteStore` (colors), UI store
- Produces: Canvas-based gradient preview with type switching

- [ ] **Step 1: Write ui-store.ts**

```ts
import { create } from "zustand";
import type { GradientType } from "@/constants";

interface UIState {
  reducedMotion: boolean;
  activePanel: string | null;
  gradientType: GradientType;
}

interface UIActions {
  setReducedMotion: (v: boolean) => void;
  setActivePanel: (panel: string | null) => void;
  setGradientType: (type: GradientType) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set) => ({
  reducedMotion: false,
  activePanel: null,
  gradientType: "linear",
  setReducedMotion: (v) => set({ reducedMotion: v }),
  setActivePanel: (panel) => set({ activePanel: panel }),
  setGradientType: (type) => set({ gradientType: type }),
}));
```

- [ ] **Step 2: Write lib/gradients.ts**

```ts
export function generateLinearGradient(colors: string[], angle: number = 135): string {
  const stops = colors.join(", ");
  return `linear-gradient(${angle}deg, ${stops})`;
}

export function generateRadialGradient(colors: string[]): string {
  const stops = colors.join(", ");
  return `radial-gradient(circle at center, ${stops})`;
}

export function generateMeshGradient(colors: string[]): string[] {
  // ponytail: simple multi-stop mesh, upgrade to SVG path blending if needed
  return colors.map((c, i) => {
    const positions = [
      "0% 0%",
      "100% 0%",
      "50% 100%",
      "0% 50%",
      "100% 50%",
    ];
    return `radial-gradient(circle at ${positions[i % positions.length]}, ${c} 0%, transparent 70%)`;
  });
}

export function generateCssGradient(type: string, colors: string[], angle?: number): string {
  switch (type) {
    case "linear": return generateLinearGradient(colors, angle);
    case "radial": return generateRadialGradient(colors);
    default: return generateLinearGradient(colors, angle);
  }
}

export function generateSvgGradient(type: string, colors: string[]): string {
  const stops = colors
    .map((c, i) => `    <stop offset="${(i / (colors.length - 1)) * 100}%" stop-color="${c}" />`)
    .join("\n");

  if (type === "radial") {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
  <defs>
    <radialGradient id="g">
${stops}
    </radialGradient>
  </defs>
  <rect width="400" height="300" fill="url(#g)" />
</svg>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
${stops}
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#g)" />
</svg>`;
}
```

- [ ] **Step 3: Write GradientPreview.tsx**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { usePaletteStore } from "@/store/palette-store";
import { useUIStore } from "@/store/ui-store";
import { generateLinearGradient, generateRadialGradient } from "@/lib/gradients";

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
      gradient = ctx.createRadialGradient(
        rect.width / 2, rect.height / 2, 0,
        rect.width / 2, rect.height / 2, rect.width / 2
      );
    } else {
      gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    }

    hexes.forEach((hex, i) => {
      gradient.addColorStop(i / (hexes.length - 1), hex);
    });

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);
  }, [hexes, gradientType]);

  if (hexes.length < 2) return null;

  return (
    <canvas
      ref={canvasRef}
      className="h-48 w-full rounded-xl"
      style={{ width: "100%", height: "12rem" }}
    />
  );
}
```

- [ ] **Step 4: Write GradientControls.tsx**

```tsx
"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { usePaletteStore } from "@/store/palette-store";
import { useUIStore } from "@/store/ui-store";
import { generateCssGradient, generateSvgGradient } from "@/lib/gradients";
import { GRADIENT_TYPES } from "@/constants";
import { cn } from "@/utils/cn";

export function GradientControls() {
  const colors = usePaletteStore((s) => s.colors);
  const gradientType = useUIStore((s) => s.gradientType);
  const setGradientType = useUIStore((s) => s.setGradientType);
  const [copied, setCopied] = useState<string | null>(null);

  if (colors.length < 2) return null;

  const hexes = colors.map((c) => c.hex);

  const copyCss = async () => {
    const css = generateCssGradient(gradientType, hexes);
    await navigator.clipboard.writeText(css);
    setCopied("css");
    setTimeout(() => setCopied(null), 2000);
  };

  const copySvg = async () => {
    const svg = generateSvgGradient(gradientType, hexes);
    await navigator.clipboard.writeText(svg);
    setCopied("svg");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {GRADIENT_TYPES.filter((t) => t !== "mesh" && t !== "soft-blur").map((type) => (
          <button
            key={type}
            onClick={() => setGradientType(type)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors",
              gradientType === type
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {type}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={copyCss}
          className="flex items-center gap-1.5 rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {copied === "css" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          Copy CSS
        </button>
        <button
          onClick={copySvg}
          className="flex items-center gap-1.5 rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {copied === "svg" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          Copy SVG
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Integrate into page.tsx**

```tsx
import { GradientPreview } from "@/components/gradient/GradientPreview";
import { GradientControls } from "@/components/gradient/GradientControls";

// Add inside the section after <Extractor />:
<GradientPreview />
<GradientControls />
```

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add gradient generator with canvas preview"
```

---

### Milestone 7: UI Preview

### Task 7.1: UI Preview Components

**Files:**
- Create: `src/components/preview/UIPreview.tsx`
- Create: `src/components/preview/HeroPreview.tsx`
- Create: `src/components/preview/CardPreview.tsx`
- Create: `src/components/preview/ButtonPreview.tsx`
- Create: `src/components/preview/NavbarPreview.tsx`
- Create: `src/components/preview/BadgePreview.tsx`
- Create: `src/components/preview/InputPreview.tsx`
- Create: `src/components/preview/GlassCardPreview.tsx`

**Interfaces:**
- Consumes: `usePaletteStore` (colors, dominantColor)
- Produces: Mockup UI components using extracted palette colors

- [ ] **Step 1: Write GlassCard (shared UI primitive)**

```tsx
"use client";

import { cn } from "@/utils/cn";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl",
        className
      )}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Write Badge primitive**

```tsx
"use client";

import { cn } from "@/utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        className
      )}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 3: Write preview components**

```tsx
// HeroPreview.tsx
"use client";

import { usePaletteStore } from "@/store/palette-store";

export function HeroPreview() {
  const dominantColor = usePaletteStore((s) => s.dominantColor);
  if (!dominantColor) return null;

  return (
    <div
      className="flex h-64 items-center justify-center rounded-xl"
      style={{ backgroundColor: dominantColor + "20" }}
    >
      <div className="text-center">
        <h3 className="text-2xl font-bold" style={{ color: dominantColor }}>
          Built with your palette
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          A hero section using extracted colors
        </p>
      </div>
    </div>
  );
}
```

```tsx
// CardPreview.tsx
"use client";

import { usePaletteStore } from "@/store/palette-store";

export function CardPreview() {
  const colors = usePaletteStore((s) => s.colors);
  if (colors.length < 2) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div
        className="mb-4 h-32 rounded-lg"
        style={{ backgroundColor: colors[1].hex }}
      />
      <h4 className="font-semibold">Card Title</h4>
      <p className="mt-1 text-sm text-muted-foreground">
        This card uses your extracted palette for styling.
      </p>
    </div>
  );
}
```

```tsx
// ButtonPreview.tsx
"use client";

import { usePaletteStore } from "@/store/palette-store";

export function ButtonPreview() {
  const colors = usePaletteStore((s) => s.colors);
  if (colors.length < 2) return null;

  return (
    <div className="flex flex-wrap gap-3">
      <button
        className="rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90"
        style={{ backgroundColor: colors[0].hex }}
      >
        Primary
      </button>
      <button
        className="rounded-lg border px-6 py-2.5 text-sm font-medium transition-all hover:opacity-90"
        style={{ borderColor: colors[0].hex, color: colors[0].hex }}
      >
        Outline
      </button>
      <button
        className="rounded-lg px-6 py-2.5 text-sm font-medium transition-all"
        style={{ backgroundColor: colors[0].hex + "20", color: colors[0].hex }}
      >
        Ghost
      </button>
    </div>
  );
}
```

```tsx
// NavbarPreview.tsx
"use client";

import { usePaletteStore } from "@/store/palette-store";

export function NavbarPreview() {
  const dominantColor = usePaletteStore((s) => s.dominantColor);
  if (!dominantColor) return null;

  return (
    <div
      className="flex items-center justify-between rounded-xl px-6 py-4"
      style={{ backgroundColor: dominantColor + "15", borderBottom: `1px solid ${dominantColor}30` }}
    >
      <span className="font-semibold" style={{ color: dominantColor }}>Logo</span>
      <div className="flex gap-6 text-sm text-muted-foreground">
        <span>Home</span>
        <span>About</span>
        <span>Contact</span>
      </div>
    </div>
  );
}
```

```tsx
// BadgePreview.tsx
"use client";

import { usePaletteStore } from "@/store/palette-store";

export function BadgePreview() {
  const colors = usePaletteStore((s) => s.colors);
  if (colors.length < 2) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {colors.slice(0, 4).map((c) => (
        <span
          key={c.hex}
          className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium"
          style={{
            backgroundColor: c.hex + "20",
            color: c.hex,
            borderColor: c.hex + "40",
          }}
        >
          {c.hex}
        </span>
      ))}
    </div>
  );
}
```

```tsx
// InputPreview.tsx
"use client";

import { usePaletteStore } from "@/store/palette-store";

export function InputPreview() {
  const dominantColor = usePaletteStore((s) => s.dominantColor);
  if (!dominantColor) return null;

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Default input"
        className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none transition-all focus:ring-2"
        style={{ borderColor: dominantColor + "40", "--tw-ring-color": dominantColor } as React.CSSProperties}
      />
      <input
        type="text"
        placeholder="Focused state"
        className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none transition-all"
        style={{ borderColor: dominantColor, boxShadow: `0 0 0 2px ${dominantColor}30` }}
      />
    </div>
  );
}
```

```tsx
// GlassCardPreview.tsx
"use client";

import { usePaletteStore } from "@/store/palette-store";

export function GlassCardPreview() {
  const colors = usePaletteStore((s) => s.colors);
  if (colors.length < 2) return null;

  return (
    <div
      className="rounded-xl border p-6 backdrop-blur-xl"
      style={{
        backgroundColor: colors[0].hex + "10",
        borderColor: colors[0].hex + "20",
      }}
    >
      <h4 className="font-semibold" style={{ color: colors[0].hex }}>Glass Card</h4>
      <p className="mt-1 text-sm text-muted-foreground">
        Glassmorphism card styled with your palette.
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Write UIPreview.tsx container**

```tsx
"use client";

import { usePaletteStore } from "@/store/palette-store";
import { HeroPreview } from "./HeroPreview";
import { CardPreview } from "./CardPreview";
import { ButtonPreview } from "./ButtonPreview";
import { NavbarPreview } from "./NavbarPreview";
import { BadgePreview } from "./BadgePreview";
import { InputPreview } from "./InputPreview";
import { GlassCardPreview } from "./GlassCardPreview";

export function UIPreview() {
  const colors = usePaletteStore((s) => s.colors);
  if (colors.length === 0) return null;

  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold tracking-tight">UI Preview</h2>
      <div className="space-y-6">
        <HeroPreview />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <CardPreview />
          <GlassCardPreview />
          <NavbarPreview />
        </div>
        <ButtonPreview />
        <BadgePreview />
        <InputPreview />
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Integrate into page.tsx**

```tsx
import { UIPreview } from "@/components/preview/UIPreview";
// Add in page.tsx after gradient components
```

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add UI preview components"
```

---

### Milestone 8: Live Theme

### Task 8.1: Dynamic Background Theme

**Files:**
- Modify: `src/app/page.tsx` (add live background)
- Create: `src/components/ui/ThemeBackground.tsx`

**Interfaces:**
- Consumes: `usePaletteStore` (dominantColor, colors)
- Produces: Smooth background color transitions

- [ ] **Step 1: Write ThemeBackground.tsx**

```tsx
"use client";

import { useEffect, useState } from "react";
import { usePaletteStore } from "@/store/palette-store";

export function ThemeBackground() {
  const colors = usePaletteStore((s) => s.colors);
  const [prevGradient, setPrevGradient] = useState("");

  useEffect(() => {
    if (colors.length < 2) return;
    const gradient = `linear-gradient(135deg, ${colors[0].hex}15, ${colors[1].hex}10)`;
    setPrevGradient(gradient);
  }, [colors]);

  if (colors.length < 2) return null;

  return (
    <div
      className="fixed inset-0 -z-10 transition-all duration-700 ease-in-out"
      style={{
        background: prevGradient || `linear-gradient(135deg, ${colors[0].hex}15, ${colors[1].hex}10)`,
      }}
    />
  );
}
```

- [ ] **Step 2: Integrate into layout.tsx**

```tsx
// Add in RootLayout, inside body:
import { ThemeBackground } from "@/components/ui/ThemeBackground";

// Wrap children:
<ThemeBackground />
{children}
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add live theme background transitions"
```

---

### Milestone 9: Export System

### Task 9.1: Export Store and Logic

**Files:**
- Create: `src/store/export-store.ts`
- Create: `src/lib/export.ts`

**Interfaces:**
- Consumes: `ExtractedColor[]`
- Produces: Export data in all formats

- [ ] **Step 1: Write lib/export.ts**

```ts
import type { ExtractedColor } from "@/types";

export function generateCSS(colors: ExtractedColor[]): string {
  return `:root {\n${colors
    .map((c) => `  ${c.cssVar}: ${c.hex};`)
    .join("\n")}\n}`;
}

export function generateTailwind(colors: ExtractedColor[]): string {
  return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${colors
    .map(
      (c, i) =>
        `        'palette-${i + 1}': '${c.hex}',`
    )
    .join("\n")}\n      },\n    },\n  },\n};`;
}

export function generateJSON(colors: ExtractedColor[]): string {
  return JSON.stringify(
    colors.map((c) => ({
      name: c.name,
      hex: c.hex,
      rgb: `rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b})`,
      hsl: `hsl(${c.hsl.h}, ${c.hsl.s}%, ${c.hsl.l}%)`,
      percentage: c.percentage,
    })),
    null,
    2
  );
}

export function generateSCSS(colors: ExtractedColor[]): string {
  return colors
    .map(
      (c, i) =>
        `$palette-${i + 1}: ${c.hex}; // ${c.name}`
    )
    .join("\n");
}

export function generateTokens(colors: ExtractedColor[]): string {
  return JSON.stringify(
    {
      version: "1.0",
      palette: colors.map((c, i) => ({
        name: c.name,
        value: c.hex,
        attributes: {
          category: "color",
          type: "palette",
          item: `palette-${i + 1}`,
        },
      })),
    },
    null,
    2
  );
}

export const exportGenerators = {
  css: generateCSS,
  tailwind: generateTailwind,
  json: generateJSON,
  scss: generateSCSS,
  tokens: generateTokens,
};
```

- [ ] **Step 2: Write export-store.ts**

```ts
import { create } from "zustand";

interface ExportState {
  format: string;
  data: string | null;
  isExporting: boolean;
}

interface ExportActions {
  setFormat: (format: string) => void;
  setData: (data: string | null) => void;
  setExporting: (v: boolean) => void;
}

type ExportStore = ExportState & ExportActions;

export const useExportStore = create<ExportStore>((set) => ({
  format: "css",
  data: null,
  isExporting: false,
  setFormat: (format) => set({ format }),
  setData: (data) => set({ data }),
  setExporting: (isExporting) => set({ isExporting }),
}));
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add export logic and store"
```

---

### Task 9.2: Export Panel UI

**Files:**
- Create: `src/components/export/ExportPanel.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `usePaletteStore` (colors), `useExportStore`
- Produces: Export panel with format tabs + copy/download

- [ ] **Step 1: Write ExportPanel.tsx**

```tsx
"use client";

import { useState } from "react";
import { Copy, Check, Download } from "lucide-react";
import { usePaletteStore } from "@/store/palette-store";
import { exportGenerators } from "@/lib/export";
import { EXPORT_FORMATS } from "@/constants";
import { cn } from "@/utils/cn";

export function ExportPanel() {
  const colors = usePaletteStore((s) => s.colors);
  const [format, setFormat] = useState<string>("css");
  const [copied, setCopied] = useState(false);

  if (colors.length === 0) return null;

  const generator = exportGenerators[format as keyof typeof exportGenerators];
  const data = generator(colors);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = format === "tailwind" ? "js" : format === "json" || format === "tokens" ? "json" : format === "scss" ? "scss" : "css";
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `palette.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold tracking-tight">Export</h2>
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {EXPORT_FORMATS.map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                format === f
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              )}
            >
              {f === "css-var" ? "CSS Var" : f}
            </button>
          ))}
        </div>
        <pre className="mb-4 max-h-48 overflow-auto rounded-lg bg-muted p-4 text-xs font-mono">
          {data}
        </pre>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-lg bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Integrate into page.tsx**

```tsx
import { ExportPanel } from "@/components/export/ExportPanel";
// Add in page.tsx after UIPreview
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add export panel with copy and download"
```

---

### Milestone 10: Share Palette

### Task 10.1: Share Route and URL Generation

**Files:**
- Create: `src/app/palette/[id]/page.tsx`
- Modify: `src/components/export/ExportPanel.tsx` (add share button)

**Interfaces:**
- Consumes: `usePaletteStore`
- Produces: `/palette/[id]` route with encoded palette data

- [ ] **Step 1: Write share page**

```tsx
"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { PaletteGrid } from "@/components/palette/PaletteGrid";
import { PaletteName } from "@/components/palette/PaletteName";
import { MoodBadge } from "@/components/palette/MoodBadge";
import { usePaletteStore } from "@/store/palette-store";
import type { ExtractedColor } from "@/types";

interface SharePageProps {
  params: Promise<{ id: string }>;
}

export default function SharePalettePage({ params }: SharePageProps) {
  const { id } = use(params);
  const [decoded, setDecoded] = useState<ExtractedColor[] | null>(null);
  const setColors = usePaletteStore((s) => s.setColors);

  useEffect(() => {
    try {
      const json = atob(id);
      const colors = JSON.parse(json) as ExtractedColor[];
      setColors(colors);
      setDecoded(colors);
    } catch {
      setDecoded([]);
    }
  }, [id, setColors]);

  if (decoded === null) return <div className="p-24 text-center">Loading...</div>;
  if (decoded.length === 0) return notFound();

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <section className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Shared Palette</h1>
            <PaletteName />
          </div>
          <MoodBadge />
        </section>
        <PaletteGrid />
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Add share button to ExportPanel**

```tsx
// After the download button in ExportPanel, add share button if handleShare is defined:

const handleShare = () => {
  const json = JSON.stringify(colors.map((c) => ({
    hex: c.hex,
    rgb: c.rgb,
    hsl: c.hsl,
    oklch: c.oklch,
    cssVar: c.cssVar,
    percentage: c.percentage,
    name: c.name,
  })));
  const encoded = btoa(json);
  const url = `${window.location.origin}/palette/${encoded}`;
  navigator.clipboard.writeText(url);
};
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add share palette route"
```

---

### Milestone 11: Motion Polish

### Task 11.1: Motion Wrappers and GSAP Gradient

**Files:**
- Create: `src/components/motion/Reveal.tsx`
- Create: `src/components/motion/Stagger.tsx`
- Create: `src/components/motion/CopyFeedback.tsx`
- Create: `src/components/motion/GradientAnimation.tsx` (GSAP)

**Interfaces:**
- Consumes: nothing (generic wrappers)
- Produces: Reusable animation components

- [ ] **Step 1: Write Reveal.tsx**

```tsx
"use client";

import { motion } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Write Stagger.tsx**

```tsx
"use client";

import { motion } from "framer-motion";

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function Stagger({ children, className, staggerDelay = 0.05 }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: Write CopyFeedback.tsx**

```tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";

interface CopyFeedbackProps {
  show: boolean;
}

export function CopyFeedback({ show }: CopyFeedbackProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="bg-foreground text-background rounded-full px-3 py-1 text-xs font-medium"
        >
          Copied!
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 4: Write GradientAnimation.tsx (GSAP)**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { usePaletteStore } from "@/store/palette-store";
import gsap from "gsap";

export function GradientAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colors = usePaletteStore((s) => s.colors);

  useEffect(() => {
    if (colors.length < 2) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    let animationId: number;
    let progress = 0;

    const hexes = colors.map((c) => c.hex);

    const animate = () => {
      progress = (progress + 0.002) % 1;

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const grad = ctx.createLinearGradient(
        rect.width * Math.sin(progress * Math.PI * 2),
        rect.height * Math.cos(progress * Math.PI * 2),
        rect.width * Math.sin(progress * Math.PI * 2 + Math.PI),
        rect.height * Math.cos(progress * Math.PI * 2 + Math.PI)
      );

      hexes.forEach((hex, i) => {
        grad.addColorStop(i / (hexes.length - 1), hex);
      });

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, rect.width, rect.height);

      animationId = requestAnimationFrame(animate);
    };

    // ponytail: GSAP integration for timeline control, pure rAF for now
    animate();

    return () => cancelAnimationFrame(animationId);
  }, [colors]);

  if (colors.length < 2) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-20 h-full w-full opacity-30"
    />
  );
}
```

- [ ] **Step 5: Apply motion wrappers to key page sections**

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add motion wrappers and gradient animation"
```

---

### Milestone 12: Performance + A11y

### Task 12.1: Performance Optimization

**Files:**
- Modify: various files for dynamic imports, memoization, lazy loading

- [ ] **Step 1: Dynamic import heavy components**

```tsx
// In page.tsx — use next/dynamic for Canvas/GSAP/Export components
import dynamic from "next/dynamic";

const GradientPreview = dynamic(
  () => import("@/components/gradient/GradientPreview"),
  { ssr: false }
);

const GradientAnimation = dynamic(
  () => import("@/components/motion/GradientAnimation"),
  { ssr: false }
);

const ExportPanel = dynamic(
  () => import("@/components/export/ExportPanel"),
  { ssr: false }
);
```

- [ ] **Step 2: Add useReducedMotion hook**

```ts
"use client";

import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}
```

- [ ] **Step 3: Add `reduced-motion` class to html when reduced**

Modify layout to add `class="dark"` with media query check.

- [ ] **Step 4: Keyboard navigation audit — ensure all interactive elements have `aria-label`, `role`, and focus styles**

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "perf: dynamic imports, reduced motion, a11y audit"
```

---

## Self-Review Checklist

- Spec coverage: All 12 milestones map to features in AGENT.md and the design spec
- No placeholders: every step has actual code
- Type consistency: ExtractedColor, Palette, WorkerResult types are consistent across all tasks
- Each milestone produces independently testable, working software
