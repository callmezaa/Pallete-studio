import type { ExtractedColor } from "@/types";

export interface HelixBar {
  leftX: number;
  rightX: number;
  y: number;
  thickness: number;
  hex: string;
}

export interface HelixData {
  bars: HelixBar[];
  leftPoints: Array<{ x: number; y: number }>;
  rightPoints: Array<{ x: number; y: number }>;
}

interface HelixConfig {
  colors: ExtractedColor[];
  viewBox?: { width: number; height: number };
  amplitude?: number;
  barMinWidth?: number;
  barMaxWidth?: number;
}

export function getHelixData(config: HelixConfig): HelixData {
  const {
    colors,
    viewBox = { width: 300, height: 500 },
    amplitude = 60,
    barMinWidth = 16,
    barMaxWidth = 100,
  } = config;

  const n = colors.length;
  const maxPct = Math.max(...colors.map((c) => c.percentage), 1);
  const margin = 40;
  const cx = viewBox.width / 2;

  const bars: HelixBar[] = [];
  const leftPoints: Array<{ x: number; y: number }> = [];
  const rightPoints: Array<{ x: number; y: number }> = [];

  colors.forEach((color, i) => {
    const y = n > 1
      ? margin + (i / (n - 1)) * (viewBox.height - margin * 2)
      : viewBox.height / 2;
    const phase = n > 1 ? (i / (n - 1)) * Math.PI : 0;
    const offset = Math.cos(phase) * amplitude;
    const thickness = barMinWidth + (color.percentage / maxPct) * (barMaxWidth - barMinWidth);

    const leftX = cx + offset;
    const rightX = cx - offset;

    bars.push({ leftX, rightX, y, thickness, hex: color.hex });
    leftPoints.push({ x: leftX, y });
    rightPoints.push({ x: rightX, y });
  });

  return { bars, leftPoints, rightPoints };
}

export function smoothPath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return "";
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const midY = (p0.y + p1.y) / 2;
    d += ` C ${p0.x.toFixed(1)} ${midY.toFixed(1)}, ${p1.x.toFixed(1)} ${midY.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
  }
  return d;
}
