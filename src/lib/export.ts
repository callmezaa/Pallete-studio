import type { ExtractedColor } from "@/types";

export function generateCSS(colors: ExtractedColor[]): string {
  return `:root {\n${colors.map((c) => `  ${c.cssVar}: ${c.hex};`).join("\n")}\n}`;
}

export function generateTailwind(colors: ExtractedColor[]): string {
  return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${colors.map((c, i) => `        'palette-${i + 1}': '${c.hex}',`).join("\n")}\n      },\n    },\n  },\n};`;
}

export function generateJSON(colors: ExtractedColor[]): string {
  return JSON.stringify(colors.map((c) => ({ name: c.name, hex: c.hex, rgb: `rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b})`, hsl: `hsl(${c.hsl.h}, ${c.hsl.s}%, ${c.hsl.l}%)`, percentage: c.percentage })), null, 2);
}

export function generateSCSS(colors: ExtractedColor[]): string {
  return colors.map((c, i) => `$palette-${i + 1}: ${c.hex}; // ${c.name}`).join("\n");
}

export function generateTokens(colors: ExtractedColor[]): string {
  return JSON.stringify({ version: "1.0", palette: colors.map((c, i) => ({ name: c.name, value: c.hex, attributes: { category: "color", type: "palette", item: `palette-${i + 1}` } })) }, null, 2);
}

export const exportGenerators: Record<string, (colors: ExtractedColor[]) => string> = {
  css: generateCSS,
  tailwind: generateTailwind,
  json: generateJSON,
  scss: generateSCSS,
  tokens: generateTokens,
};
