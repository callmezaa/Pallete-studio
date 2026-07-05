export interface WorkerResult {
  hex: string;
  percentage: number;
}

export function extractColorsFromImageData(
  imageData: ImageData,
  colorCount: number = 5
): WorkerResult[] {
  const data = imageData.data;
  const pixels: { r: number; g: number; b: number }[] = [];

  for (let i = 0; i < data.length; i += 4) {
    pixels.push({ r: data[i], g: data[i + 1], b: data[i + 2] });
  }

  const buckets = quantize(pixels, colorCount);
  const total = pixels.length;
  return buckets.map((bucket) => ({
    hex: rgbToHex(bucket.color),
    percentage: Math.round((bucket.count / total) * 10000) / 100,
  }));
}

interface Bucket {
  color: { r: number; g: number; b: number };
  count: number;
}

function quantize(pixels: { r: number; g: number; b: number }[], maxColors: number): Bucket[] {
  if (pixels.length === 0) return [];
  let buckets: { r: number; g: number; b: number }[][] = [pixels];

  while (buckets.length < maxColors) {
    const largestIdx = buckets.reduce((maxIdx, bucket, i) =>
      bucket.length > buckets[maxIdx].length ? i : maxIdx, 0);
    const largest = buckets[largestIdx];
    if (largest.length < 2) break;
    const range = findLargestChannelRange(largest);
    const sorted = [...largest].sort((a, b) => {
      const av = a[range.channel as keyof typeof a];
      const bv = b[range.channel as keyof typeof b];
      return av - bv;
    });
    const mid = Math.floor(sorted.length / 2);
    buckets[largestIdx] = sorted.slice(0, mid);
    buckets.push(sorted.slice(mid));
  }

  return buckets.map((bucket) => ({
    color: averageColor(bucket),
    count: bucket.length,
  }));
}

function findLargestChannelRange(pixels: { r: number; g: number; b: number }[]): { channel: "r" | "g" | "b"; range: number } {
  const rMin = Math.min(...pixels.map((p) => p.r));
  const rMax = Math.max(...pixels.map((p) => p.r));
  const gMin = Math.min(...pixels.map((p) => p.g));
  const gMax = Math.max(...pixels.map((p) => p.g));
  const bMin = Math.min(...pixels.map((p) => p.b));
  const bMax = Math.max(...pixels.map((p) => p.b));
  const rRange = rMax - rMin, gRange = gMax - gMin, bRange = bMax - bMin;
  if (rRange >= gRange && rRange >= bRange) return { channel: "r", range: rRange };
  if (gRange >= rRange && gRange >= bRange) return { channel: "g", range: gRange };
  return { channel: "b", range: bRange };
}

function averageColor(pixels: { r: number; g: number; b: number }[]): { r: number; g: number; b: number } {
  const total = pixels.length;
  const sum = pixels.reduce(
    (acc, p) => ({ r: acc.r + p.r, g: acc.g + p.g, b: acc.b + p.b }),
    { r: 0, g: 0, b: 0 }
  );
  return { r: Math.round(sum.r / total), g: Math.round(sum.g / total), b: Math.round(sum.b / total) };
}

function rgbToHex(color: { r: number; g: number; b: number }): string {
  return `#${[color.r, color.g, color.b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}
