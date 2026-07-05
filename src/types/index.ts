export interface WorkerResult {
  hex: string;
  percentage: number;
}

export interface ExtractedColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  oklch: { l: number; c: number; h: number };
  cssVar: string;
  percentage: number;
  name: string;
}

export interface Palette {
  colors: ExtractedColor[];
  mood: string[];
  dominantColor: string;
  gradient: GradientConfig;
}

export interface GradientConfig {
  type: "linear" | "radial" | "mesh" | "soft-blur";
  colors: string[];
  angle?: number;
}

export interface UploadState {
  file: File | null;
  preview: string | null;
  isUploading: boolean;
  error: string | null;
}

export interface UIState {
  reducedMotion: boolean;
  activePanel: string | null;
  theme: "dark" | "light";
}

export interface ExportState {
  format: string;
  data: string | null;
  isExporting: boolean;
}
