import { create } from "zustand";
import type { ExtractedColor, GradientConfig } from "@/types";

interface PaletteState {
  colors: ExtractedColor[];
  mood: string[];
  dominantColor: string;
  gradient: GradientConfig | null;
  isExtracting: boolean;
  pinnedColors: string[];
}

interface PaletteActions {
  setColors: (colors: ExtractedColor[]) => void;
  setMood: (mood: string[]) => void;
  setGradient: (gradient: GradientConfig) => void;
  togglePin: (hex: string) => void;
  setExtracting: (v: boolean) => void;
  clear: () => void;
}

type PaletteStore = PaletteState & PaletteActions;

export const usePaletteStore = create<PaletteStore>((set) => ({
  colors: [],
  mood: [],
  dominantColor: "",
  gradient: null,
  isExtracting: false,
  pinnedColors: [],
  setColors: (colors) =>
    set({ colors, dominantColor: colors[0]?.hex ?? "" }),
  setMood: (mood) => set({ mood }),
  setGradient: (gradient) => set({ gradient }),
  togglePin: (hex) =>
    set((s) => ({
      pinnedColors: s.pinnedColors.includes(hex)
        ? s.pinnedColors.filter((h) => h !== hex)
        : [...s.pinnedColors, hex],
    })),
  setExtracting: (isExtracting) => set({ isExtracting }),
  clear: () =>
    set({
      colors: [],
      mood: [],
      dominantColor: "",
      gradient: null,
      isExtracting: false,
    }),
}));
