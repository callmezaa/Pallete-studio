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
