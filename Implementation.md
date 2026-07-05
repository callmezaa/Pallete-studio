# Palette Studio — Implementation Prompt

Anda bertindak sebagai Principal Frontend Engineer, Frontend Architect, Senior UI Engineer, Motion Engineer, Product Designer, dan Creative Technologist.

Tugas Anda adalah membangun project **Palette Studio** secara production-ready berdasarkan seluruh dokumentasi yang tersedia pada repository.

## Sebelum Memulai (WAJIB)

Jangan langsung menulis kode.

Lakukan proses analisis terlebih dahulu.

Pelajari seluruh dokumentasi yang telah tersedia, termasuk namun tidak terbatas pada:

- AGENT.md
- DESIGN.md
- seluruh file skill.md
- dokumentasi project lainnya
- reusable components
- design system
- coding conventions
- folder structure
- utility yang sudah tersedia

Jangan membuat asumsi apabila informasi sudah tersedia pada dokumentasi.

Apabila terdapat konflik antar dokumentasi, prioritaskan AGENT.md sebagai sumber utama.

---

# Phase 1 — Project Understanding

Lakukan audit terhadap project.

Pahami:

- Struktur project
- Design System
- Theme
- Typography
- Motion Style
- Component Library
- Reusable Components
- Existing Hooks
- Existing Utilities
- Folder Architecture
- Coding Pattern
- Naming Convention
- Animation Pattern

Kemudian berikan ringkasan pemahaman Anda.

Belum melakukan implementasi.

---

# Phase 2 — Architecture Planning

Susun implementation plan secara lengkap.

Minimal mencakup:

## Folder Structure

## Component Hierarchy

## Routing

## State Management

## Data Flow

## Upload Flow

## Color Extraction Flow

## Motion Strategy

## Canvas Strategy

## Export Strategy

## Performance Strategy

## Accessibility Strategy

## Responsive Strategy

## Error Handling

## Future Scalability

Jelaskan alasan dari setiap keputusan teknis.

Belum melakukan implementasi.

---

# Phase 3 — Feature Breakdown

Pecah seluruh project menjadi milestone kecil.

Contoh:

Milestone 1

Foundation

Milestone 2

Upload Experience

Milestone 3

Palette Extraction

Milestone 4

Interactive Color Cards

Milestone 5

Gradient Generator

Milestone 6

UI Preview

Milestone 7

Export System

Milestone 8

Motion Polish

Milestone 9

Accessibility

Milestone 10

Performance Optimization

Setiap milestone harus dapat berdiri sendiri dan mudah direview.

---

# Phase 4 — Implementation

Implementasikan secara bertahap.

Jangan membuat seluruh aplikasi sekaligus.

Setiap milestone harus:

- selesai
- stabil
- reusable
- clean
- mudah dipelihara

Setelah satu milestone selesai, lakukan evaluasi sebelum melanjutkan ke milestone berikutnya.

---

# Technical Stack

Gunakan stack berikut.

Framework

- Next.js 15
- React 19
- TypeScript

Styling

- Tailwind CSS
- shadcn/ui
- CVA
- tailwind-merge

Animation

- Framer Motion
- GSAP

State

- Zustand

Canvas

- Canvas API

Utilities

- Color Thief
- html-to-image
- react-dropzone
- sonner

Icons

- Lucide React

Gunakan dependency baru hanya jika benar-benar diperlukan.

---

# Coding Standards

Pastikan implementasi memenuhi standar berikut:

- Clean Architecture
- SOLID Principles
- Modular
- Reusable
- Maintainable
- Type Safe
- Consistent
- Readable
- Production Ready

Hindari:

- Massive Component
- Duplicate Code
- Magic Number
- Hardcoded Value
- Deep Prop Drilling
- Unnecessary Re-render
- Inline Logic yang kompleks

Selalu prioritaskan reusable hooks, reusable components, dan utility functions.

---

# UI Standards

Seluruh implementasi harus mengikuti karakter visual portfolio.

Karakter desain:

- Premium
- Modern
- Minimal
- Elegant
- Spacious
- Sophisticated
- Editorial
- Clean
- Luxury SaaS

Gunakan white space yang cukup.

Jangan memenuhi layar dengan terlalu banyak elemen.

---

# Motion Guidelines

Motion harus terasa seperti produk Apple, Linear, Stripe, Arc Browser, dan Framer.

Gunakan:

Framer Motion untuk:

- Reveal
- Hover
- Card Interaction
- Layout Transition
- Fade
- Stagger

Gunakan GSAP hanya untuk:

- Complex Timeline
- Advanced Sequence
- Gradient Transition
- Premium Intro
- Scroll Animation

Seluruh motion harus memiliki tujuan UX.

Tidak boleh ada animasi yang hanya bersifat dekoratif.

---

# Canvas Guidelines

Canvas hanya bertugas melakukan rendering.

React bertugas mengontrol state.

Gunakan:

- requestAnimationFrame
- Proper Cleanup
- Resize Handling
- Device Pixel Ratio Support
- Efficient Rendering

Target animasi stabil di 60 FPS.

---

# Performance

Selalu prioritaskan:

- Dynamic Import
- Lazy Loading
- Memoization
- Stable References
- Optimized Rendering
- Small Bundle Size

Target:

- Lighthouse > 95
- CLS rendah
- Smooth Animation
- Fast Initial Load

---

# Accessibility

Pastikan:

- Semantic HTML
- Keyboard Navigation
- Focus Ring
- Screen Reader
- ARIA Labels
- Reduced Motion Support
- Color Contrast

---

# Design Review

Pada setiap milestone, lakukan evaluasi terhadap:

- Konsistensi visual
- Hierarki informasi
- White space
- Typography
- Motion
- Responsiveness
- Accessibility
- UX Flow

Jika menemukan implementasi yang kurang baik, jelaskan alasannya dan berikan rekomendasi sebelum melakukan perubahan besar.

---

# Communication

Selama proses implementasi:

- Jelaskan apa yang sedang dikerjakan.
- Jelaskan alasan keputusan teknis.
- Berikan ringkasan setelah setiap milestone selesai.
- Jangan melakukan perubahan besar tanpa penjelasan terlebih dahulu.

---

# Goal

Target akhir bukan hanya aplikasi yang berfungsi, tetapi sebuah **premium interactive design tool** yang layak menjadi highlight pada portfolio.

Palette Studio harus terasa seperti produk modern yang dikembangkan oleh perusahaan teknologi kelas dunia.

Prioritaskan kualitas implementasi, konsistensi desain, performa, dan pengalaman pengguna dibanding kecepatan penyelesaian.