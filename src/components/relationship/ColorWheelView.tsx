"use client";

import { useState } from "react";
import type { ExtractedColor } from "@/types";
import type { Relationship } from "@/lib/harmony";
import { RELATIONSHIP_COLORS } from "@/lib/harmony";

interface Props {
  colors: ExtractedColor[];
  relationships: Relationship[];
  activeTypes: string[];
  selectedColor: string | null;
  onSelectColor: (hex: string | null) => void;
  onHoverPair: (pair: { a: string; b: string } | null) => void;
}

const CX = 150;
const CY = 150;
const R_INNER = 70;
const R_OUTER = 105;
const R_NODE = R_OUTER + 5;
const R_LABEL = R_OUTER + 18;

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function ColorWheelView({
  colors, relationships, activeTypes,
  selectedColor, onSelectColor, onHoverPair,
}: Props) {
  const [hoveredHex, setHoveredHex] = useState<string | null>(null);
  const [hoveredArc, setHoveredArc] = useState<{ a: string; b: string } | null>(null);

  const filtered = relationships.filter((r) => activeTypes.includes(r.type));

  const active = new Set(
    hoveredHex || selectedColor
      ? filtered
          .filter((r) => r.a === (hoveredHex ?? selectedColor) || r.b === (hoveredHex ?? selectedColor))
          .flatMap((r) => [r.a, r.b])
      : colors.map((c) => c.hex),
  );

  const arcLabel =
    hoveredArc ?? hoveredHex
      ? filtered.find(
          (r) =>
            (r.a === (hoveredArc?.a ?? hoveredHex) && r.b === (hoveredArc?.b ?? hoveredHex)) ||
            (r.b === (hoveredArc?.a ?? hoveredHex) && r.a === (hoveredArc?.b ?? hoveredHex)),
        )
      : null;

  return (
    <div className="relative mx-auto max-w-[300px]">
      <svg viewBox="0 0 300 300" className="h-auto w-full">
        {/* Hue ring */}
        {Array.from({ length: 72 }).map((_, i) => {
          const s = i * 5;
          const e = (i + 1) * 5;
          const mid = s + 2.5;
          const si = polar(CX, CY, R_INNER, e);
          const ei = polar(CX, CY, R_INNER, s);
          const so = polar(CX, CY, R_OUTER, s);
          const eo = polar(CX, CY, R_OUTER, e);
          return (
            <path
              key={i}
              d={`M ${si.x} ${si.y} A ${R_INNER} ${R_INNER} 0 0 0 ${ei.x} ${ei.y} L ${so.x} ${so.y} A ${R_OUTER} ${R_OUTER} 0 0 1 ${eo.x} ${eo.y} Z`}
              fill={`hsl(${mid}, 100%, 50%)`}
            />
          );
        })}

        {/* Harmony arcs */}
        {filtered.map((r, i) => {
          const ca = colors.find((c) => c.hex === r.a);
          const cb = colors.find((c) => c.hex === r.b);
          if (!ca || !cb) return null;
          const midR = (R_INNER + R_OUTER) / 2;
          const highlighted =
            !hoveredHex && !selectedColor
              ? true
              : r.a === (hoveredHex ?? selectedColor) || r.b === (hoveredHex ?? selectedColor);
          const opacity = highlighted ? 0.25 + r.strength * 0.5 : 0.04;

          return (
            <path
              key={i}
              d={arcPath(CX, CY, midR, ca.hsl.h, cb.hsl.h)}
              fill="none"
              stroke={RELATIONSHIP_COLORS[r.type] ?? "#666"}
              strokeWidth={1 + r.strength * 4}
              strokeLinecap="round"
              opacity={opacity}
              className="cursor-pointer transition-[opacity] duration-200"
              onMouseEnter={() => setHoveredArc({ a: r.a, b: r.b })}
              onMouseLeave={() => setHoveredArc(null)}
            />
          );
        })}

        {/* Center circle */}
        <circle cx={CX} cy={CY} r={R_INNER - 4} fill="rgba(0,0,0,0.15)" />

        {/* Nodes */}
        {colors.map((c) => {
          const pos = polar(CX, CY, R_NODE, c.hsl.h);
          const dimmed = !active.has(c.hex);
          return (
            <g
              key={c.hex}
              className="cursor-pointer transition-opacity duration-200"
              opacity={dimmed ? 0.2 : 1}
              onMouseEnter={() => { setHoveredHex(c.hex); onHoverPair(null); }}
              onMouseLeave={() => setHoveredHex(null)}
              onClick={() => onSelectColor(selectedColor === c.hex ? null : c.hex)}
            >
              <circle cx={pos.x} cy={pos.y} r="7" fill={c.hex} stroke="white" strokeWidth="2" />
              <text
                x={pos.x}
                y={pos.y + 14}
                textAnchor="middle"
                className="fill-muted-foreground text-[7px] font-mono"
              >
                {c.hex}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Arc tooltip */}
      {arcLabel && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="rounded-lg bg-black/60 px-3 py-1.5 text-center text-[11px] backdrop-blur-sm">
            <span
              className="inline-block h-2 w-2 rounded-full align-middle"
              style={{ backgroundColor: RELATIONSHIP_COLORS[arcLabel.type] }}
            />
            <span className="ml-1.5 font-medium text-white">{arcLabel.label}</span>
            <span className="ml-2 text-muted-foreground">
              {arcLabel.a} ↔ {arcLabel.b}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const s = polar(cx, cy, r, endDeg);
  const e = polar(cx, cy, r, startDeg);
  const sweep = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${sweep} 0 ${e.x} ${e.y}`;
}
