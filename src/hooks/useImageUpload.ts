"use client";

import { useCallback, useEffect } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { useUploadStore } from "@/store/upload-store";
import { useToastStore } from "@/store/toast-store";
import { SUPPORTED_FORMATS, MAX_IMAGE_SIZE } from "@/constants";

export function useImageUpload() {
  const setImage = useUploadStore((s) => s.setImage);
  const setUploading = useUploadStore((s) => s.setUploading);
  const addToast = useToastStore((s) => s.addToast);

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejections: FileRejection[]) => {
      if (rejections.length > 0) {
        const msg = rejections[0].errors[0];
        if (msg.code === "file-too-large") addToast("Image must be under 10 MB", "error");
        else if (msg.code === "file-invalid-type") addToast("Only PNG, JPEG, WebP, and GIF images are supported", "error");
        else addToast(msg.message, "error");
        return;
      }
      const file = acceptedFiles[0];
      if (!file) return;

      setUploading(true);
      const preview = URL.createObjectURL(file);
      setImage(file, preview);
      setUploading(false);
    },
    [setImage, setUploading, addToast]
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

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            if (file.size > MAX_IMAGE_SIZE) {
              addToast("Image must be under 10 MB", "error");
              return;
            }
            const ext = `.${file.name?.split(".").pop()?.toLowerCase() || ""}`;
            if (!SUPPORTED_FORMATS.some((f) => f === file.type || f === ext)) {
              addToast("Only PNG, JPEG, WebP, and GIF images are supported", "error");
              return;
            }
            onDrop([file], []);
          }
          break;
        }
      }
    };
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [onDrop, addToast]);

  return { getRootProps, getInputProps, isDragActive };
}
