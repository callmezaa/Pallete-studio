import { create } from "zustand";

interface ExportState { format: string; data: string | null; isExporting: boolean; }
interface ExportActions { setFormat: (format: string) => void; setData: (data: string | null) => void; setExporting: (v: boolean) => void; }
type ExportStore = ExportState & ExportActions;

export const useExportStore = create<ExportStore>((set) => ({
  format: "css",
  data: null,
  isExporting: false,
  setFormat: (format) => set({ format }),
  setData: (data) => set({ data }),
  setExporting: (isExporting) => set({ isExporting }),
}));
