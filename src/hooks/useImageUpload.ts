"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useUploadStore } from "@/store/upload-store";
import { SUPPORTED_FORMATS, MAX_IMAGE_SIZE } from "@/constants";

export function useImageUpload() {
  const setImage = useUploadStore((s) => s.setImage);
  const setError = useUploadStore((s) => s.setError);
  const setUploading = useUploadStore((s) => s.setUploading);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setUploading(true);
      const preview = URL.createObjectURL(file);
      setImage(file, preview);
      setUploading(false);
    },
    [setImage, setError, setUploading]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: SUPPORTED_FORMATS.reduce(
      (acc, f) => ({ ...acc, [f]: [] }),
      {} as Record<string, string[]>
    ),
    maxSize: MAX_IMAGE_SIZE,
    multiple: false,
  });

  return { getRootProps, getInputProps, isDragActive };
}
