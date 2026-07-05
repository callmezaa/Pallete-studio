import { create } from "zustand";
import type { GradientType } from "@/constants";

interface UIState {
  reducedMotion: boolean;
  activePanel: string | null;
  gradientType: GradientType;
}

interface UIActions {
  setReducedMotion: (v: boolean) => void;
  setActivePanel: (panel: string | null) => void;
  setGradientType: (type: GradientType) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set) => ({
  reducedMotion: false,
  activePanel: null,
  gradientType: "linear",
  setReducedMotion: (v) => set({ reducedMotion: v }),
  setActivePanel: (panel) => set({ activePanel: panel }),
  setGradientType: (type) => set({ gradientType: type }),
}));
