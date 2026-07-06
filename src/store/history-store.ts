import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SavedPalette } from "@/types";

const MAX_PALETTES = 20;

interface HistoryState {
  palettes: SavedPalette[];
}

interface HistoryActions {
  addPalette: (palette: Omit<SavedPalette, "id" | "timestamp">) => void;
  removePalette: (id: string) => void;
  clearHistory: () => void;
}

type HistoryStore = HistoryState & HistoryActions;

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set) => ({
      palettes: [],
      addPalette: (palette) =>
        set((s) => {
          const id = crypto.randomUUID();
          const timestamp = Date.now();
          return {
            palettes: [
              { id, timestamp, ...palette },
              ...s.palettes,
            ].slice(0, MAX_PALETTES),
          };
        }),
      removePalette: (id) =>
        set((s) => ({
          palettes: s.palettes.filter((p) => p.id !== id),
        })),
      clearHistory: () => set({ palettes: [] }),
    }),
    { name: "palette-history" },
  ),
);
