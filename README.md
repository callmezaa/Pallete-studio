# Palette Studio

> Discover the visual identity hidden inside every image.

Upload an image — extract its dominant colors — explore harmonies, contrasts, gradients, and 3D visualizations. A premium color toolkit for designers and developers.

---

## Features

- **Color Extraction** — Custom median-cut quantization extracts 5 dominant colors from any image. No external APIs, no third-party color libraries.
- **Interactive Palette** — Drag to reorder, pin favorites, copy in hex/rgb/hsl/oklch, long-press for instant copy.
- **Mood Detection** — Auto-classifies palette mood (luxury, modern, elegant, cyber, nature, etc.).
- **WCAG Contrast Checker** — Full pairwise contrast analysis with AA/AAA ratings.
- **Color Relationship Map** — Wheel view + force graph showing complementary, analogous, triadic, and other harmony relationships.
- **Gradient Physics** — Interactive playground with linear, radial, mesh, and soft-blur gradient types. Drag stops, adjust angle, real-time canvas preview.
- **3D DNA Helix** — Interactive Three.js visualization of your palette as a double helix with bloom post-processing, orbit controls, and PNG export.
- **UI Preview** — Live demo of buttons, badges, cards, forms, navbar, dashboard, and theme toggle — all styled with your extracted palette.
- **Export** — Copy or download as CSS variables, Tailwind config, JSON, SCSS, design tokens, or PNG palette strip.
- **Palette Story** — Animated reveal sequence showcasing each color with ambient transitions.
- **History** — Persisted palette history with restore, swipe-to-delete, and shareable links.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16, React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4, shadcn/ui, CVA |
| Animation | Framer Motion 12, GSAP 3 + ScrollTrigger |
| 3D | Three.js, @react-three/fiber, @react-three/drei, @react-three/postprocessing |
| State | Zustand 5 (persist middleware) |
| Icons | Lucide React |
| Fonts | Geist / Geist Mono / Inter |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home page
│   ├── history/page.tsx    # Saved palette history
│   └── palette/[id]/       # Shared palette (base64-encoded)
├── components/
│   ├── home/               # Hero, scroll reveals, featured palette
│   ├── upload/             # Drop zone, image preview
│   ├── palette/            # Color cards, grid, extractor, history
│   ├── gradient/           # Gradient playground, canvas, stops
│   ├── preview/            # UI component demos (buttons, cards, forms, etc.)
│   ├── motion/             # Particle field, gradient animation
│   ├── relationship/       # Color harmony wheel + graph
│   ├── story/              # Animated palette reveal sequence
│   ├── export/             # CSS/Tailwind/JSON/SCSS export
│   └── ui/                 # Shared primitives (glass card, toast, etc.)
├── hooks/                  # Custom React hooks
├── lib/                    # Core logic (colors, contrast, extraction, harmony, etc.)
├── store/                  # Zustand stores (palette, history, upload, toast, ui)
├── types/                  # TypeScript type definitions
└── constants/              # App-wide constants
```

## Design

Dark-first glassmorphism with subtle noise texture, spring animations, and consistent `active:scale-[0.96]` on all interactive elements. Every heading uses `text-wrap: balance` to prevent orphans. Dynamic numbers use `tabular-nums` to prevent layout shift. Animations respect `prefers-reduced-motion`.

All surfaces use layered `box-shadow` with transparency over solid borders — depth adapts naturally to any background.

## License

MIT
