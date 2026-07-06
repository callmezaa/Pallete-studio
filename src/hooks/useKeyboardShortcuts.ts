"use client";

import { useState, useEffect, useCallback } from "react";
import { usePaletteStore } from "@/store/palette-store";
import { useToastStore } from "@/store/toast-store";

const INPUT_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

export function useKeyboardShortcuts() {
  const [commandOpen, setCommandOpen] = useState(false);
  const colors = usePaletteStore((s) => s.colors);
  const undo = usePaletteStore((s) => s.undo);
  const redo = usePaletteStore((s) => s.redo);
  const undoLen = usePaletteStore((s) => s.undoStack.length);
  const redoLen = usePaletteStore((s) => s.redoStack.length);
  const addToast = useToastStore((s) => s.addToast);

  const copyAllHexes = useCallback(async () => {
    if (colors.length === 0) return;
    const text = colors.map((c) => c.hex).join(", ");
    try {
      await navigator.clipboard.writeText(text);
      addToast(`Copied ${colors.length} colors`, "success");
    } catch {
      addToast("Failed to copy", "error");
    }
  }, [colors, addToast]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (INPUT_TAGS.has(target.tagName) || target.isContentEditable) return;

      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;

      if (e.key === "k") {
        e.preventDefault();
        setCommandOpen((v) => !v);
        return;
      }

      if (commandOpen) return;

      if (e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          if (redoLen > 0) {
            redo();
            addToast("Redone", "success");
          } else {
            addToast("Nothing to redo", "info");
          }
        } else {
          if (undoLen > 0) {
            undo();
            addToast("Undone", "success");
          } else {
            addToast("Nothing to undo", "info");
          }
        }
        return;
      }

      if (e.key === "c") {
        e.preventDefault();
        copyAllHexes();
        return;
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [commandOpen, copyAllHexes, undo, redo, undoLen, redoLen, addToast]);

  useEffect(() => {
    if (!commandOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCommandOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [commandOpen]);

  return { commandOpen, setCommandOpen };
}
