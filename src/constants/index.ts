export const PALETTE_SIZE = 5;
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
export const SUPPORTED_FORMATS = ["image/png", "image/jpeg", "image/webp"];
export const ANIMATION_DURATION = 0.5;
export const THEME_TRANSITION_DURATION = 700;

export const COLOR_FORMATS = ["hex", "rgb", "hsl", "oklch", "css-var"] as const;
export type ColorFormat = (typeof COLOR_FORMATS)[number];

export const GRADIENT_TYPES = ["linear", "radial", "mesh", "soft-blur"] as const;
export type GradientType = (typeof GRADIENT_TYPES)[number];

export const EXPORT_FORMATS = ["css", "tailwind", "json", "scss", "tokens"] as const;
export type ExportFormat = (typeof EXPORT_FORMATS)[number];

export const MOODS = [
  "luxury", "modern", "elegant", "minimal", "cyber",
  "corporate", "nature", "vintage", "playful", "warm", "cold",
] as const;
export type Mood = (typeof MOODS)[number];
