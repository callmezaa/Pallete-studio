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
