# AGENT.md

# 🎨 Palette Studio

> **Discover the visual identity hidden inside every image.**

Palette Studio adalah sebuah premium playground web application yang mengeksplorasi warna, identitas visual, dan design system dari sebuah gambar. Aplikasi ini bukan hanya color extractor biasa, melainkan sebuah **interactive visual experience** yang membantu designer maupun developer memahami bagaimana sebuah palet warna dapat digunakan dalam produk digital modern.

Target utama project ini adalah memberikan pengalaman yang terasa seperti produk Apple, Linear, Vercel, dan Framer: bersih, premium, minimalis, halus, dan sangat interaktif.

---

# Vision

Membuat color extraction menjadi pengalaman visual yang menyenangkan, elegan, dan berguna.

Palette Studio harus terasa seperti sebuah design tool modern, bukan utility sederhana.

---

# Objectives

- Mengekstrak warna dominan dari sebuah gambar.
- Memberikan visualisasi palette yang premium.
- Membantu pengguna memahami karakter warna.
- Menampilkan implementasi warna pada UI.
- Memberikan export yang siap digunakan pada project nyata.
- Menghasilkan pengalaman interaktif dengan animasi yang smooth.

---

# Target Users

- UI Designer
- Product Designer
- Frontend Developer
- Creative Developer
- Branding Designer
- Motion Designer
- Students
- Digital Artists

---

# Design Principles

Palette Studio harus mengikuti prinsip berikut:

- Less but Better
- Premium Digital Experience
- Minimalism
- Motion with Purpose
- Visual Consistency
- Accessibility First
- Performance First
- Clean Architecture

---

# Visual Direction

Inspirasi desain berasal dari:

- Apple
- Linear
- Vercel
- Framer
- Raycast
- Arc Browser
- Nothing

Karakter visual:

- Dark Theme First
- Glassmorphism ringan
- Soft Gradient
- Elegant Blur
- Large White Space
- Smooth Rounded Corners
- Minimal UI
- Floating Cards
- Soft Shadow
- Premium Typography

---

# Core Features

## 1. Image Upload

User dapat:

- Drag & Drop
- Browse File
- Paste Image

Supported format:

- PNG
- JPG
- JPEG
- WEBP

Preview image muncul dengan smooth fade animation.

---

## 2. Smart Color Extraction

Aplikasi akan:

- Mengekstrak warna dominan.
- Menghasilkan palette harmonis.
- Mengurutkan warna berdasarkan dominasi.
- Menampilkan persentase setiap warna.

Contoh:

██████
#0F172A

██████
#2563EB

██████
#38BDF8

██████
#E2E8F0

██████
#FFFFFF

---

## 3. Multiple Color Formats

Setiap warna memiliki:

- HEX
- RGB
- HSL
- OKLCH
- CSS Variable

Semua dapat di-copy hanya dengan satu klik.

---

## 4. Smart Palette Naming

Palette otomatis diberikan nama yang elegan.

Contoh:

- Midnight Graphite
- Ocean Breeze
- Sunset Coral
- Polar Mist
- Forest Moss
- Desert Gold
- Aurora Sky

---

## 5. Mood Detection

Palette dianalisis menjadi beberapa kategori.

Misalnya:

- Luxury
- Modern
- Elegant
- Minimal
- Cyber
- Corporate
- Nature
- Vintage
- Playful
- Warm
- Cold

Mood ditampilkan dalam bentuk badge premium.

---

## 6. Gradient Generator

Palette otomatis menghasilkan beberapa gradient.

Jenis:

- Linear
- Radial
- Mesh Style
- Soft Blur Gradient

User dapat:

- Preview
- Copy CSS
- Copy Tailwind
- Export SVG

---

## 7. UI Preview

Warna langsung diterapkan ke mockup UI.

Preview meliputi:

- Hero
- Card
- Button
- Navbar
- Badge
- Input
- Glass Card

Tujuannya agar user memahami bagaimana warna bekerja dalam sebuah interface.

---

## 8. Live Theme Preview

Saat memilih warna.

Background aplikasi berubah secara smooth.

Seluruh komponen ikut menyesuaikan.

Transisi dilakukan tanpa reload.

---

## 9. Interactive Color Cards

Hover:

- Scale
- Glow
- Shadow
- Tooltip

Click:

- Copy HEX
- Ripple Animation

Double Click:

- Pin Color

---

## 10. Export

Export:

- CSS Variables
- Tailwind Config
- JSON
- SCSS Variables
- Design Tokens

---

## 11. Share Palette

Generate URL unik.

Contoh:

/palette/aurora-mist

atau

/palette/4hj8s9

---

# Motion Design

Seluruh animasi harus memiliki tujuan UX.

Gunakan animasi yang:

- Halus
- Elegan
- Tidak berlebihan

---

## Upload Animation

Image

↓

Fade In

↓

Scale

↓

Glass Card muncul

↓

Palette muncul satu per satu

---

## Palette Reveal

Setiap warna:

Opacity

↓

Scale

↓

Glow

↓

Idle

---

## Hover Animation

Hover card:

Scale

↓

Elevation

↓

Shadow

↓

Soft Glow

---

## Copy Animation

Klik warna:

Ripple

↓

Check Icon

↓

Toast

---

## Background Transition

Ketika palette berubah:

Background melakukan crossfade menggunakan gradient.

Durasi sekitar 700ms.

---

## Gradient Animation

Gradient bergerak perlahan.

Tidak mencolok.

Tidak mengganggu.

---

# UI Layout

```
────────────────────────────────────────

Palette Studio

Discover the visual identity
hidden inside every image.

────────────────────────────────────────

Upload Area

────────────────────────────────────────

Image Preview

Palette

Gradient

Mood

UI Preview

Export

────────────────────────────────────────
```

---

# Typography

Heading

Geist

Body

Inter

Monospace

Geist Mono

---

# Color System

Primary

White

Secondary

Neutral Gray

Accent

Dynamic mengikuti palette yang dihasilkan.

---

# Tech Stack

## Framework

- Next.js 15
- React 19
- TypeScript

---

## Styling

- Tailwind CSS
- shadcn/ui
- class-variance-authority
- tailwind-merge

---

## Animation

- Framer Motion
- GSAP

Gunakan:

Framer Motion

- Reveal
- Hover
- Fade
- Layout

GSAP

- Timeline
- Advanced Sequencing
- Gradient Transition
- Complex Motion

---

## Canvas

Canvas API

Untuk:

- Gradient Preview
- Animated Background
- Interactive Effects

---

## Color Extraction

Gunakan:

- Color Thief
- Vibrant.js (opsional untuk perbandingan hasil)

---

## Utilities

- react-dropzone
- sonner
- html-to-image
- file-saver

---

## Icons

Lucide React

---

## State Management

Zustand

Pisahkan:

- Palette State
- Upload State
- UI State
- Export State

---

# Performance

Wajib:

- Lazy Loading
- Dynamic Import
- Memoization
- Web Worker jika ekstraksi berat
- Optimized Rendering
- RequestAnimationFrame untuk animasi Canvas
- Minimal Bundle Size

Target:

- Lighthouse ≥ 95
- First Load < 2 detik
- 60 FPS Animation

---

# Accessibility

Pastikan:

- Keyboard Navigation
- Focus Ring
- Semantic HTML
- Color Contrast
- ARIA Label
- Screen Reader Friendly
- Reduced Motion Support

---

# Folder Structure

```
src/

app/

components/
  upload/
  palette/
  preview/
  gradient/
  export/
  motion/

hooks/

store/

lib/

utils/

types/

constants/

styles/
```

---

# Future Roadmap

## Phase 2

- AI Color Harmony
- AI Branding Suggestion
- Accessibility Score
- Contrast Checker
- Font Pair Recommendation
- Brand Kit Generator

---

## Phase 3

- Palette History
- Team Workspace
- Cloud Sync
- Export to Figma
- Export to Framer
- Export Design Tokens

---

# Development Goal

Palette Studio bukan sekadar color picker.

Palette Studio harus terasa seperti sebuah **premium design tool** yang menggabungkan engineering, visual design, motion, dan user experience dalam satu aplikasi yang elegan, modern, cepat, dan menyenangkan untuk digunakan.

Setiap interaksi harus memberikan kesan profesional, setiap animasi harus memiliki tujuan, dan setiap detail visual harus mencerminkan kualitas produk digital kelas dunia.