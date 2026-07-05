"use client";

import { motion } from "framer-motion";
import { Upload, Image as ImageIcon } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { cn } from "@/lib/utils";

export function UploadZone() {
  const { getRootProps, getInputProps, isDragActive } = useImageUpload();

  return (
    <motion.div
      {...(getRootProps() as any)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative cursor-pointer rounded-2xl border-2 border-dashed p-16 text-center transition-colors",
        isDragActive
          ? "border-foreground bg-foreground/5"
          : "border-border hover:border-muted-foreground/50"
      )}
    >
      <input {...getInputProps()} />
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        {isDragActive ? (
          <ImageIcon className="h-6 w-6 text-foreground" />
        ) : (
          <Upload className="h-6 w-6 text-muted-foreground" />
        )}
      </div>
      {isDragActive ? (
        <p className="text-lg font-medium">Drop your image here</p>
      ) : (
        <>
          <p className="text-lg font-medium">Drop an image here</p>
          <p className="mt-1 text-sm text-muted-foreground">
            or click to browse · PNG, JPG, WEBP up to 10MB
          </p>
        </>
      )}
    </motion.div>
  );
}
