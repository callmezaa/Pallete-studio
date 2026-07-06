import type { ExtractedColor } from "@/types";

export const RELATIONSHIP_COLORS: Record<string, string> = {
  complementary: "#f43f5e",
  analogous: "#3b82f6",
  triadic: "#8b5cf6",
  "split-complementary": "#f59e0b",
  monochromatic: "#10b981",
  tetradic: "#ec4899",
};

export interface Relationship {
  type: string;
  a: string;
  b: string;
  strength: number;
  label: string;
}

export interface HarmonyData {
  pairs: Relationship[];
  types: string[];
  nodeHues: Record<string, number>;
}

export function hueDistance(h1: number, h2: number): number {
  const d = Math.abs(h1 - h2);
  return Math.min(d, 360 - d);
}

export function detectRelationships(colors: ExtractedColor[]): HarmonyData {
  if (colors.length < 2) return { pairs: [], types: [], nodeHues: {} };

  const nodeHues: Record<string, number> = {};
  colors.forEach((c) => { nodeHues[c.hex] = c.hsl.h; });

  const pairs: Relationship[] = [];
  const typeSet = new Set<string>();

  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const a = colors[i];
      const b = colors[j];
      const d = hueDistance(a.hsl.h, b.hsl.h);

      if (d >= 160 && d <= 200) {
        const strength = 1 - Math.abs(180 - d) / 20;
        if (strength > 0.3) {
          pairs.push({ type: "complementary", a: a.hex, b: b.hex, strength, label: "Complementary" });
          typeSet.add("complementary");
        }
      }

      if (d >= 10 && d <= 45) {
        const strength = 1 - (d - 10) / 35;
        if (strength > 0.3) {
          pairs.push({ type: "analogous", a: a.hex, b: b.hex, strength, label: "Analogous" });
          typeSet.add("analogous");
        }
      }

      if (d <= 8 && (Math.abs(a.hsl.s - b.hsl.s) > 10 || Math.abs(a.hsl.l - b.hsl.l) > 10)) {
        const strength = 0.5 + (Math.abs(a.hsl.s - b.hsl.s) + Math.abs(a.hsl.l - b.hsl.l)) / 400;
        if (strength > 0.3) {
          pairs.push({ type: "monochromatic", a: a.hex, b: b.hex, strength: Math.min(strength, 1), label: "Monochromatic" });
          typeSet.add("monochromatic");
        }
      }

      if ((d >= 145 && d <= 175) || (d >= 185 && d <= 215)) {
        const target = d < 180 ? 160 : 200;
        const strength = 1 - Math.abs(target - d) / 15;
        if (strength > 0.3) {
          pairs.push({ type: "split-complementary", a: a.hex, b: b.hex, strength, label: "Split Compl." });
          typeSet.add("split-complementary");
        }
      }
    }
  }

  const hexes = colors.map((c) => c.hex);
  for (let i = 0; i < hexes.length; i++) {
    for (let j = i + 1; j < hexes.length; j++) {
      for (let k = j + 1; k < hexes.length; k++) {
        const d1 = hueDistance(colors[i].hsl.h, colors[j].hsl.h);
        const d2 = hueDistance(colors[j].hsl.h, colors[k].hsl.h);
        const d3 = hueDistance(colors[k].hsl.h, colors[i].hsl.h);
        const avg = (d1 + d2 + d3) / 3;
        if (Math.abs(avg - 120) <= 20) {
          const strength = 1 - Math.abs(avg - 120) / 20;
          pairs.push({ type: "triadic", a: hexes[i], b: hexes[j], strength, label: "Triadic" });
          pairs.push({ type: "triadic", a: hexes[j], b: hexes[k], strength, label: "Triadic" });
          pairs.push({ type: "triadic", a: hexes[k], b: hexes[i], strength, label: "Triadic" });
          typeSet.add("triadic");
        }
      }
    }
  }

  const comps = pairs.filter((p) => p.type === "complementary");
  const seen = new Set<string>();
  for (let i = 0; i < comps.length; i++) {
    for (let j = i + 1; j < comps.length; j++) {
      const ha = nodeHues[comps[i].a] ?? 0;
      const hb = nodeHues[comps[j].a] ?? 0;
      const pairDist = hueDistance(ha, hb);
      if (pairDist >= 75 && pairDist <= 105) {
        const strength = 1 - Math.abs(pairDist - 90) / 15;
        const tetradPairs = [
          [comps[i].a, comps[j].a],
          [comps[i].b, comps[j].b],
          [comps[i].a, comps[j].b],
          [comps[i].b, comps[j].a],
        ];
        for (const [x, y] of tetradPairs) {
          const key = [x, y].sort().join("-");
          if (!seen.has(key)) {
            seen.add(key);
            pairs.push({ type: "tetradic", a: x, b: y, strength, label: "Tetradic" });
          }
        }
        typeSet.add("tetradic");
      }
    }
  }

  return {
    pairs,
    types: Array.from(typeSet),
    nodeHues,
  };
}
