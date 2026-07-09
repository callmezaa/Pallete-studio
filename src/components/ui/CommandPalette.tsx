"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, Copy, Download, Trash2 } from "lucide-react";
import { usePaletteStore } from "@/store/palette-store";
import { useToastStore } from "@/store/toast-store";
import { exportGenerators } from "@/lib/export";
import { EXPORT_FORMATS, type ExportFormat } from "@/constants";
import { cn } from "@/lib/utils";

interface Cmd {
  id: string;
  label: string;
  category: string;
  keywords: string[];
  icon: typeof Command;
  action: () => void;
}

const categories = ["Copy", "Export", "Actions"] as const;

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const colors = usePaletteStore((s) => s.colors);
  const clear = usePaletteStore((s) => s.clear);
  const addToast = useToastStore((s) => s.addToast);

  const commands = useMemo((): Cmd[] => {
    const copy = (text: string, label: string) => async () => {
      try {
        await navigator.clipboard.writeText(text);
        addToast(`Copied as ${label}`, "success");
        onClose();
      } catch {
        addToast("Failed to copy", "error");
      }
    };

    const download = (format: ExportFormat) => () => {
      if (colors.length === 0) return;
      const data = exportGenerators[format](colors);
      const extMap: Record<string, string> = {
        css: "css",
        tailwind: "js",
        json: "json",
        scss: "scss",
        tokens: "json",
      };
      const ext = extMap[format] || "txt";
      const blob = new Blob([data], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `palette.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
      addToast(`Downloaded as ${format}`, "success");
      onClose();
    };

    const list: Cmd[] = [];

    if (colors.length > 0) {
      list.push(
        {
          id: "copy-hex",
          label: "Copy all as HEX",
          category: "Copy",
          keywords: ["copy", "hex", "colors", "all"],
          icon: Copy,
          action: copy(colors.map((c) => c.hex).join(", "), "HEX"),
        },
        {
          id: "copy-css",
          label: "Copy all as CSS",
          category: "Copy",
          keywords: ["copy", "css", "variables", "var"],
          icon: Copy,
          action: copy(exportGenerators.css(colors), "CSS"),
        },
        {
          id: "copy-json",
          label: "Copy all as JSON",
          category: "Copy",
          keywords: ["copy", "json", "data"],
          icon: Copy,
          action: copy(exportGenerators.json(colors), "JSON"),
        },
        {
          id: "copy-tailwind",
          label: "Copy all as Tailwind",
          category: "Copy",
          keywords: ["copy", "tailwind", "tailwindcss"],
          icon: Copy,
          action: copy(exportGenerators.tailwind(colors), "Tailwind"),
        },
      );

      for (const fmt of EXPORT_FORMATS) {
        list.push({
          id: `export-${fmt}`,
          label: `Export as ${fmt.charAt(0).toUpperCase() + fmt.slice(1)}`,
          category: "Export",
          keywords: ["export", "download", fmt],
          icon: Download,
          action: download(fmt),
        });
      }
    }

    list.push({
      id: "clear",
      label: "Clear palette",
      category: "Actions",
      keywords: ["clear", "reset", "delete", "remove"],
      icon: Trash2,
      action: () => {
        clear();
        addToast("Palette cleared", "info");
        onClose();
      },
    });

    return list;
  }, [colors, addToast, clear, onClose]);

  const filtered = useMemo(
    () =>
      commands.filter(
        (c) =>
          c.label.toLowerCase().includes(search.toLowerCase()) ||
          c.keywords.some((k) => k.includes(search.toLowerCase())),
      ),
    [commands, search],
  );

  useEffect(() => {
    if (open) {
      setSearch("");
      setSelected(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setSelected(0);
  }, [search]);

  useEffect(() => {
    const el = listRef.current?.children[selected] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((v) => Math.min(v + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((v) => Math.max(v - 1, 0));
      } else if (e.key === "Enter" && filtered[selected]) {
        e.preventDefault();
        filtered[selected].action();
      }
    },
    [filtered, selected],
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh]"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.96, y: -8, filter: "blur(8px)" }}
            transition={{ type: "spring", duration: 0.4, bounce: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative w-full max-w-lg overflow-hidden rounded-xl",
              "border border-white/[0.08] bg-black/80 backdrop-blur-2xl",
              "shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_20px_60px_rgba(0,0,0,0.5)]",
            )}
          >
            {/* Search */}
            <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search commands..."
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <kbd className="rounded-md bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[320px] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No results for "{search}"
                </p>
              ) : (
                categories.map((cat) => {
                  const items = filtered.filter((c) => c.category === cat);
                  if (items.length === 0) return null;
                  const idx = filtered.indexOf(items[0]);
                  return (
                    <div key={cat}>
                      <p className="px-2 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        {cat}
                      </p>
                      {items.map((cmd, i) => {
                        const globalIdx = idx + i;
                        const isSelected = globalIdx === selected;
                        return (
                          <button
                            key={cmd.id}
                            onClick={cmd.action}
                            onMouseEnter={() => setSelected(globalIdx)}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors duration-75",
                              isSelected
                                ? "bg-white/[0.08] text-foreground"
                                : "text-muted-foreground hover:text-foreground",
                            )}
                          >
                            <cmd.icon className="h-4 w-4 shrink-0" />
                            <span className="flex-1">{cmd.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
