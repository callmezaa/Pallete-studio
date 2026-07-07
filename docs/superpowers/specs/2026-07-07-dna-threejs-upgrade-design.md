# Three.js DNA Helix — Design Spec

## Overview
Upgrade existing SVG-based DnaArt component to an interactive 3D DNA helix using @react-three/fiber with bloom post-processing, orbital controls, and auto-rotation.

## Dependencies
- `three` — core 3D engine
- `@react-three/fiber` — React bridge
- `@react-three/drei` — OrbitControls, Float helpers
- `@react-three/postprocessing` — UnrealBloomPass

## Architecture
DnaArt.tsx (glass container + UI buttons) → DnaHelix.tsx (Canvas + 3D scene)

## Scene Structure
- Camera: position [0, 0, 12], fov 45
- OrbitControls: autoRotate (0.5 speed), enableDamping
- Float: gentle bobbing (speed 0.5, intensity 2)
- Backbone: 2x TubeGeometry with CatmullRomCurve3, vertex colors, roughness 0.2 / metalness 0.3
- Rungs: CylinderGeometry connecting left↔right at each color, colored by palette
- Nodes: SphereGeometry at each end, emissive + bloom glow
- Bloom: UnrealBloomPass (threshold 0.1, strength 0.3, radius 0.5)
- Lights: ambient (0.3) + pointLight (0.5)

## 3D Coordinate System
- Y-axis vertical: -5 to +5 range
- X-axis: amplitude 2 (cosine oscillation for left/right)
- Z-axis: depth 1.5 (sine oscillation, 90° out of phase with X)

## Interaction
- Drag to orbit, scroll to zoom
- Auto-rotation pauses on drag
- Hover nodes → tooltip overlay showing hex + percentage
- Export PNG via canvas.toDataURL

## Export Changes
- Download: gl.domElement.toDataURL → palette-dna-3d.png
- Copy: canvas.toBlob → ClipboardItem → navigator.clipboard.write
- SVG export removed

## Files
- Create: src/components/palette/DnaHelix.tsx
- Modify: src/components/palette/DnaArt.tsx, src/lib/dna.ts, package.json

## Accessibility
- prefers-reduced-motion: disable autoRotate + Float, static scene
- aria-label on canvas container
