"use client";

import { useRef, useEffect, useCallback, useState } from "react";
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

interface Node {
  hex: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

export function ForceGraph({ colors, relationships, activeTypes, selectedColor, onSelectColor, onHoverPair }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const rafRef = useRef<number>(0);
  const settledRef = useRef(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const filteredRels = relationships.filter((r) => activeTypes.includes(r.type));
  const relsRef = useRef(filteredRels);
  relsRef.current = filteredRels;

  const initNodes = useCallback(() => {
    const maxPct = Math.max(...colors.map((c) => c.percentage), 1);
    const cx = 200, cy = 150;
    nodesRef.current = colors.map((c, i) => {
      const angle = (i / colors.length) * Math.PI * 2 - Math.PI / 2;
      return {
        hex: c.hex,
        x: cx + Math.cos(angle) * 70,
        y: cy + Math.sin(angle) * 70,
        vx: 0,
        vy: 0,
        r: 16 + (c.percentage / maxPct) * 8,
      };
    });
    settledRef.current = false;
  }, [colors]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if (w === 0 || h === 0) return;

    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const nodes = nodesRef.current;
    const rels = relsRef.current;

    // Physics tick
    const kR = 6000;
    const kA = 0.004;
    const kG = 0.008;
    const rest = 130;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const d = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
        const fx = (dx / d) * (kR / (d * d));
        const fy = (dy / d) * (kR / (d * d));
        nodes[i].vx -= fx;
        nodes[i].vy -= fy;
        nodes[j].vx += fx;
        nodes[j].vy += fy;

        const connected = rels.some(
          (r) =>
            (r.a === nodes[i].hex && r.b === nodes[j].hex) ||
            (r.a === nodes[j].hex && r.b === nodes[i].hex),
        );
        if (connected) {
          const afx = (dx / d) * kA * (d - rest);
          const afy = (dy / d) * kA * (d - rest);
          nodes[i].vx += afx;
          nodes[i].vy += afy;
          nodes[j].vx -= afx;
          nodes[j].vy -= afy;
        }
      }
    }

    for (const node of nodes) {
      node.vx += (w / 2 - node.x) * kG;
      node.vy += (h / 2 - node.y) * kG;
      node.vx *= 0.92;
      node.vy *= 0.92;
      node.x += node.vx;
      node.y += node.vy;
      node.x = Math.max(node.r + 4, Math.min(w - node.r - 4, node.x));
      node.y = Math.max(node.r + 4, Math.min(h - node.r - 4, node.y));
    }

    const maxV = Math.max(...nodes.map((n) => Math.abs(n.vx) + Math.abs(n.vy)), 0);
    settledRef.current = maxV < 0.1;

    const activeSet = new Set(
      hoveredNode || selectedColor
        ? rels
            .filter(
              (r) =>
                r.a === (hoveredNode ?? selectedColor) ||
                r.b === (hoveredNode ?? selectedColor),
            )
            .flatMap((r) => [r.a, r.b])
        : colors.map((c) => c.hex),
    );

    const isDimmed = (hex: string) => (hoveredNode || selectedColor) && !activeSet.has(hex);

    ctx.clearRect(0, 0, w, h);

    // Edges
    for (const rel of rels) {
      const na = nodes.find((n) => n.hex === rel.a);
      const nb = nodes.find((n) => n.hex === rel.b);
      if (!na || !nb) continue;
      const dim = isDimmed(rel.a) && isDimmed(rel.b);
      const alpha = dim ? 0.04 : 0.2 + rel.strength * 0.5;
      ctx.beginPath();
      ctx.moveTo(na.x, na.y);
      ctx.lineTo(nb.x, nb.y);
      ctx.strokeStyle = RELATIONSHIP_COLORS[rel.type] ?? "#666";
      ctx.lineWidth = 1 + rel.strength * 3;
      ctx.globalAlpha = alpha;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Nodes
    for (const node of nodes) {
      const dim = isDimmed(node.hex);
      ctx.globalAlpha = dim ? 0.15 : 1;

      const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.r * 2.5);
      glow.addColorStop(0, node.hex + "50");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r * 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fillStyle = node.hex;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "rgba(255,255,255,0.65)";
      ctx.font = "9px monospace";
      ctx.textAlign = "center";
      ctx.fillText(node.hex, node.x, node.y + node.r + 13);
    }
    ctx.globalAlpha = 1;
  }, [colors, hoveredNode, selectedColor]);

  const drawRef = useRef(draw);
  drawRef.current = draw;

  useEffect(() => {
    const loop = () => {
      drawRef.current();
      if (!settledRef.current) {
        rafRef.current = requestAnimationFrame(loop);
      }
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => { settledRef.current = false; drawRef.current(); });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  useEffect(() => { initNodes(); }, [initNodes]);

  const getNodeAt = useCallback((clientX: number, clientY: number): Node | null => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const nodes = nodesRef.current;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const dx = x - nodes[i].x;
      const dy = y - nodes[i].y;
      if (dx * dx + dy * dy <= (nodes[i].r + 6) * (nodes[i].r + 6)) return nodes[i];
    }
    return null;
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const node = getNodeAt(e.clientX, e.clientY);
      setHoveredNode(node?.hex ?? null);
      if (node) onHoverPair(null);
    },
    [getNodeAt, onHoverPair],
  );

  const handlePointerLeave = useCallback(() => {
    setHoveredNode(null);
    onHoverPair(null);
  }, [onHoverPair]);

  const handleClick = useCallback(
    (e: React.PointerEvent) => {
      const node = getNodeAt(e.clientX, e.clientY);
      onSelectColor(node?.hex === selectedColor ? null : (node?.hex ?? null));
    },
    [getNodeAt, selectedColor, onSelectColor],
  );

  return (
    <div
      ref={containerRef}
      className="relative h-80 w-full overflow-hidden rounded-xl"
    >
      {colors.length === 0 && (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Extract colors to see the relationship graph.
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handleClick}
      />
    </div>
  );
}
