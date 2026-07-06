import { create } from "zustand";
import type { ExtractedColor, GradientConfig } from "@/types";
import type { ColorFormat } from "@/constants";

interface Snapshot {
  colors: ExtractedColor[];
  mood: string[];
  dominantColor: string;
  pinnedColors: string[];
}

interface PaletteState {
  colors: ExtractedColor[];
  mood: string[];
  dominantColor: string;
  gradient: GradientConfig | null;
  isExtracting: boolean;
  pinnedColors: string[];
  activeColorIndex: number | null;
  activeFormat: ColorFormat;
  undoStack: Snapshot[];
  redoStack: Snapshot[];
}

interface PaletteActions {
  setColors: (colors: ExtractedColor[]) => void;
  setMood: (mood: string[]) => void;
  setGradient: (gradient: GradientConfig) => void;
  togglePin: (hex: string) => void;
  setExtracting: (v: boolean) => void;
  clear: () => void;
  undo: () => void;
  redo: () => void;
  setActiveColorIndex: (index: number | null) => void;
  setActiveFormat: (format: ColorFormat) => void;
}

type PaletteStore = PaletteState & PaletteActions;

const MAX_STACK = 20;

function takeSnapshot(s: PaletteState): Snapshot {
  return {
    colors: s.colors,
    mood: s.mood,
    dominantColor: s.dominantColor,
    pinnedColors: s.pinnedColors,
  };
}

function pushUndo(state: PaletteState): { undoStack: Snapshot[]; redoStack: [] } {
  return {
    undoStack: [...state.undoStack.slice(-(MAX_STACK - 1)), takeSnapshot(state)],
    redoStack: [],
  };
}

export const usePaletteStore = create<PaletteStore>((set) => ({
  colors: [],
  mood: [],
  dominantColor: "",
  gradient: null,
  isExtracting: false,
  pinnedColors: [],
  activeColorIndex: null,
  activeFormat: "hex",
  undoStack: [],
  redoStack: [],

  setColors: (colors) =>
    set((s) => {
      const seen = new Set<string>();
      const deduped = colors.filter((c) => {
        if (seen.has(c.hex)) return false;
        seen.add(c.hex);
        return true;
      });
      return {
        ...pushUndo(s),
        colors: deduped,
        mood: deduped.length > 0 ? s.mood : [],
        dominantColor: deduped[0]?.hex ?? "",
      };
    }),

  setMood: (mood) => set({ mood }),

  setGradient: (gradient) => set({ gradient }),

  togglePin: (hex) =>
    set((s) => ({
      ...pushUndo(s),
      pinnedColors: s.pinnedColors.includes(hex)
        ? s.pinnedColors.filter((h) => h !== hex)
        : [...s.pinnedColors, hex],
    })),

  setExtracting: (isExtracting) => set({ isExtracting }),

  clear: () =>
    set((s) => ({
      ...pushUndo(s),
      colors: [],
      mood: [],
      dominantColor: "",
      gradient: null,
      isExtracting: false,
      pinnedColors: [],
      activeColorIndex: null,
    })),

  undo: () =>
    set((s) => {
      if (s.undoStack.length === 0) return s;
      const prev = s.undoStack[s.undoStack.length - 1];
      return {
        redoStack: [...s.redoStack.slice(-(MAX_STACK - 1)), takeSnapshot(s)],
        undoStack: s.undoStack.slice(0, -1),
        colors: prev.colors,
        mood: prev.mood,
        dominantColor: prev.dominantColor,
        pinnedColors: prev.pinnedColors,
        activeColorIndex: null,
      };
    }),

  redo: () =>
    set((s) => {
      if (s.redoStack.length === 0) return s;
      const next = s.redoStack[s.redoStack.length - 1];
      return {
        undoStack: [...s.undoStack, takeSnapshot(s)],
        redoStack: s.redoStack.slice(0, -1),
        colors: next.colors,
        mood: next.mood,
        dominantColor: next.dominantColor,
        pinnedColors: next.pinnedColors,
        activeColorIndex: null,
      };
    }),

  setActiveColorIndex: (activeColorIndex) => set({ activeColorIndex }),

  setActiveFormat: (activeFormat) => set({ activeFormat }),
}));
