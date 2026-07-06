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

export async function generatePaletteStripBlob(
  colors: ExtractedColor[],
  options?: { swatchWidth?: number; swatchHeight?: number; showLabels?: boolean },
): Promise<Blob | null> {
  const { swatchWidth = 80, swatchHeight = 56, showLabels = true } = options ?? {};
  const canvas = document.createElement("canvas");
  const dpr = window.devicePixelRatio || 1;
  const pad = 16;
  const lh = showLabels ? 18 : 0;
  const tw = colors.length * swatchWidth + pad * 2;
  const th = swatchHeight + lh + pad * 2;

  canvas.width = tw * dpr;
  canvas.height = th * dpr;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, tw, th);

  colors.forEach((c, i) => {
    const x = pad + i * swatchWidth;
    const y = pad;
    const cr = 6;

    ctx.beginPath();
    ctx.moveTo(x + cr, y);
    ctx.lineTo(x + swatchWidth - cr, y);
    ctx.quadraticCurveTo(x + swatchWidth, y, x + swatchWidth, y + cr);
    ctx.lineTo(x + swatchWidth, y + swatchHeight - cr);
    ctx.quadraticCurveTo(x + swatchWidth, y + swatchHeight, x + swatchWidth - cr, y + swatchHeight);
    ctx.lineTo(x + cr, y + swatchHeight);
    ctx.quadraticCurveTo(x, y + swatchHeight, x, y + swatchHeight - cr);
    ctx.lineTo(x, y + cr);
    ctx.quadraticCurveTo(x, y, x + cr, y);
    ctx.closePath();
    ctx.fillStyle = c.hex;
    ctx.fill();

    if (showLabels) {
      ctx.fillStyle = "#ffffff";
      ctx.font = "11px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(c.hex, x + swatchWidth / 2, y + swatchHeight + 4);
    }
  });

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
}

export const exportGenerators: Record<string, (colors: ExtractedColor[]) => string> = {
  css: generateCSS,
  tailwind: generateTailwind,
  json: generateJSON,
  scss: generateSCSS,
  tokens: generateTokens,
};
