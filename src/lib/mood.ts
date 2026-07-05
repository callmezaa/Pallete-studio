import type { ExtractedColor } from "@/types";

export function detectMood(colors: ExtractedColor[]): string[] {
  const moods: string[] = [];
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
