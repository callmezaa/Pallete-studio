export function generateLinearGradient(colors: string[], angle: number = 135): string {
  return `linear-gradient(${angle}deg, ${colors.join(", ")})`;
}

export function generateRadialGradient(colors: string[]): string {
  return `radial-gradient(circle at center, ${colors.join(", ")})`;
}

export function generateCssGradient(type: string, colors: string[], angle?: number): string {
  if (type === "radial") return generateRadialGradient(colors);
  return generateLinearGradient(colors, angle);
}

export function generateLinearCss(
  hexes: string[],
  positions: number[],
  angle = 135,
): string {
  const stops = hexes
    .map((h, i) => `${h} ${(positions[i] * 100).toFixed(0)}%`)
    .join(", ");
  return `linear-gradient(${angle}deg, ${stops})`;
}

export function generateRadialCss(hexes: string[], positions: number[]): string {
  const stops = hexes
    .map((h, i) => `${h} ${(positions[i] * 100).toFixed(0)}%`)
    .join(", ");
  return `radial-gradient(circle at center, ${stops})`;
}

function hexToRgb(hex: string) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r
    ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) }
    : { r: 0, g: 0, b: 0 };
}

export function generateMeshSvg(hexes: string[], width: number, height: number): string {
  const n = hexes.length;
  const cols = Math.ceil(Math.sqrt(n));
  const rows = Math.ceil(n / cols);
  const cellW = width / cols;
  const cellH = height / rows;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">\n`;
  svg += `<defs><filter id="m"><feGaussianBlur stdDeviation="3"/></filter></defs>\n`;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const x0 = x * cellW;
      const y0 = y * cellH;
      const x1 = Math.min(x0 + cellW, width);
      const y1 = Math.min(y0 + cellH, height);

      const idx = y * cols + x;
      const c = hexToRgb(hexes[idx % n]);
      const midX = (x0 + x1) / 2;
      const midY = (y0 + y1) / 2;

      svg += `<polygon points="${x0},${y0} ${x1},${y0} ${midX},${midY}" fill="rgb(${c.r},${c.g},${c.b})" filter="url(#m)"/>\n`;
      svg += `<polygon points="${x0},${y1} ${x1},${y1} ${midX},${midY}" fill="rgb(${c.r},${c.g},${c.b})" filter="url(#m)"/>\n`;
      svg += `<polygon points="${x0},${y0} ${x0},${y1} ${midX},${midY}" fill="rgb(${c.r},${c.g},${c.b})" filter="url(#m)"/>\n`;
      svg += `<polygon points="${x1},${y0} ${x1},${y1} ${midX},${midY}" fill="rgb(${c.r},${c.g},${c.b})" filter="url(#m)"/>\n`;
    }
  }
  svg += "</svg>";
  return svg;
}

export function generateSoftBlurSvg(hexes: string[], width: number, height: number): string {
  const cx = width / 2;
  const cy = height / 2;
  const n = hexes.length;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">\n`;
  svg += `<defs>\n`;
  svg += `<filter id="b"><feGaussianBlur stdDeviation="${Math.min(width, height) * 0.12}"/></filter>\n`;

  hexes.forEach((_, i) => {
    const a = (i / n) * Math.PI * 2;
    const r = Math.min(width, height) * 0.2;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    svg += `  <radialGradient id="g${i}" cx="50%" cy="50%" r="50%">\n`;
    svg += `    <stop offset="0%" stop-color="${hexes[i]}" stop-opacity="0.7"/>\n`;
    svg += `    <stop offset="100%" stop-color="${hexes[i]}" stop-opacity="0"/>\n`;
    svg += `  </radialGradient>\n`;
  });

  svg += `</defs>\n`;
  svg += `<rect width="${width}" height="${height}" fill="#000"/>\n`;

  hexes.forEach((_, i) => {
    const a = (i / n) * Math.PI * 2;
    const r = Math.min(width, height) * 0.2;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    svg += `<circle cx="${x}" cy="${y}" r="${Math.min(width, height) * 0.35}" fill="url(#g${i})" filter="url(#b)"/>\n`;
  });

  svg += "</svg>";
  return svg;
}

export function generateGradientOutput(
  type: string,
  hexes: string[],
  positions: number[],
  angle?: number,
): string {
  switch (type) {
    case "linear":
      return generateLinearCss(hexes, positions, angle);
    case "radial":
      return generateRadialCss(hexes, positions);
    case "mesh":
      return generateMeshSvg(hexes, 400, 300);
    case "soft-blur":
      return generateSoftBlurSvg(hexes, 400, 300);
    default:
      return generateLinearCss(hexes, positions, angle);
  }
}
