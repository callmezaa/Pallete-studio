# Home Page GSAP Scroll Story — Design Spec

## Overview
Upgrade home page with a full-height hero + GSAP ScrollTrigger section reveals — without changing the structure of existing section components.

## Design Decisions

| Aspect | Choice |
|--------|--------|
| Hero layout | Full 100vh hero |
| Hero entrance | Typewriter + reveal sequence (badge → title → subtitle → CTA) |
| Background | Floating gradient blobs (4 large blurred circles) + ParticleField (existing) |
| Scroll reveal | Fade + Slide Up (y: 40→0, blur: 6→0, opacity: 0→1) via GSAP ScrollTrigger |
| New section | FeaturedPalette — heroic palette display between hero and HistoryPanel |
| Animation lib | GSAP (npm, includes ScrollTrigger) |
| reduced-motion | Skip all GSAP timelines, render all content visible immediately |

## New Components

| Component | Responsibility |
|-----------|---------------|
| `FloatingBlobs` | Canvas with 4 large gradient blobs — slow drift + mouse reaction |
| `GSAPReveal` | Wrapper — registers each child with ScrollTrigger for fade+slide entry |
| `GSAPHero` | Full 100vh hero with typewriter entrance, integrates FloatingBlobs + UploadZone |
| `FeaturedPalette` | Large palette card with expanded swatches, shown when colors exist |

## Modified Files

| File | Change |
|------|--------|
| `src/app/page.tsx` | Replace inline hero + Section wrappers with GSAPHero + GSAPReveal |
| `package.json` | Add `gsap` dependency |

## Animation Details

| Element | Effect | Duration | Trigger |
|---------|--------|----------|---------|
| Badge | Typewriter (0.04s/char) | ~1s | Page load |
| Title | Typewriter (0.025s/char) | ~0.5s | After badge |
| Subtitle | blur 12→0 + opacity 0→1 | 0.6s | After title |
| CTA (UploadZone) | y: 20→0 + opacity 0→1 | 0.4s | After subtitle |
| Scroll indicator | opacity 0→1 | 0.3s | After CTA |
| Section reveals | y: 40→0 + blur 6→0 + opacity 0→1 | 0.6s | ScrollTrigger (top 85%) |
| Scroll indicator fade | opacity 1→0 | 0.3s | First scroll >100px |

## Accessibility
- `prefers-reduced-motion`: all GSAP timelines skipped, content visible immediately
- Typewriter: full text always in DOM (each char wrapped in `<span>` for reveal), screen readers see complete text
- Scroll indicator: `aria-hidden="true"`
