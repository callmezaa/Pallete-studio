import { create } from "zustand";
import type { UploadState } from "@/types";

interface UploadActions {
  setImage: (file: File, preview: string) => void;
  clearImage: () => void;
  setError: (error: string | null) => void;
  setUploading: (isUploading: boolean) => void;
}

type UploadStore = UploadState & UploadActions;

export const useUploadStore = create<UploadStore>((set) => ({
  file: null,
  preview: null,
  isUploading: false,
  error: null,
  setImage: (file, preview) => set({ file, preview, error: null }),
  clearImage: () => set({ file: null, preview: null, error: null }),
  setError: (error) => set({ error }),
  setUploading: (isUploading) => set({ isUploading }),
}));
