"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, GripVertical, Pin, PinOff } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useLongPress } from "@/hooks/useLongPress";
import { usePaletteStore } from "@/store/palette-store";
import { useToastStore } from "@/store/toast-store";
import { formatColor } from "@/lib/colors";
import { FormatToggle } from "./FormatToggle";
import { cn } from "@/lib/utils";
import type { ExtractedColor } from "@/types";

interface ColorCardProps {
  color: ExtractedColor;
}

export function ColorCard({ color }: ColorCardProps) {
  const { copied, copy } = useCopyToClipboard();
  const togglePin = usePaletteStore((s) => s.togglePin);
  const pinnedColors = usePaletteStore((s) => s.pinnedColors);
  const activeFormat = usePaletteStore((s) => s.activeFormat);
  const addToast = useToastStore((s) => s.addToast);
  const isPinned = pinnedColors.includes(color.hex);
  const formattedValue = formatColor(color, activeFormat);
  const copyId = `${color.hex}-${activeFormat}`;
  const [pressing, setPressing] = useState(false);
  const longPress = useLongPress(() => {
    copy(formattedValue, copyId);
    addToast("Copied", "success");
  }, 500);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setPressing(true);
      longPress.onPointerDown(e);
    },
    [longPress],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => longPress.onPointerMove(e),
    [longPress],
  );

  const handlePointerUp = useCallback(
    () => {
      setPressing(false);
      longPress.onPointerUp();
    },
    [longPress],
  );

  const handlePointerLeave = useCallback(
    () => {
      setPressing(false);
      longPress.onPointerLeave();
    },
    [longPress],
  );

  return (
    <div
      onDoubleClick={() => togglePin(color.hex)}
      className={cn(
        "group/card relative overflow-hidden rounded-xl",
        "bg-white/[0.03] backdrop-blur-xl",
        "transition-[scale,box-shadow] duration-300 ease-out",
        "hover:scale-[1.02]",
        "active:scale-[0.96]",
        "cursor-grab active:cursor-grabbing touch-manipulation",
        isPinned
          ? "shadow-[0_0_0_1px_rgba(255,255,255,0.15),0_4px_12px_-4px_rgba(0,0,0,0.4),0_8px_24px_0_rgba(0,0,0,0.3)]"
          : "shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_1px_2px_-1px_rgba(0,0,0,0.3),0_2px_4px_0_rgba(0,0,0,0.2)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_4px_12px_-4px_rgba(0,0,0,0.4),0_8px_24px_0_rgba(0,0,0,0.3)]"
      )}
    >
      <div
        className={cn(
          "relative h-32 w-full overflow-hidden",
          "transition-[scale,box-shadow] duration-150",
          pressing && "scale-[0.97] shadow-[inset_0_0_0_2px_rgba(255,255,255,0.15)]",
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      >
        <div
          className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-105"
          style={{ backgroundColor: color.hex }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Floating copy button */}
        <div className="absolute right-3 top-3 z-10 opacity-0 translate-y-1 transition-[opacity,transform] duration-200 ease-out group-hover:opacity-100 group-hover:translate-y-0">
          <AnimatePresence initial={false} mode="wait">
            {copied === copyId ? (
              <motion.div
                key="check"
                initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 text-green-400 backdrop-blur-sm"
              >
                <Check className="h-4 w-4" />
              </motion.div>
            ) : (
              <motion.button
                key="copy"
                initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                onClick={() => copy(formattedValue, copyId)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.08] text-white/80 backdrop-blur-sm transition-[background-color,scale] duration-150 ease-out hover:bg-white/[0.15] active:scale-[0.96]"
                aria-label={`Copy ${formattedValue}`}
              >
                <Copy className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Pin badge */}
        <AnimatePresence initial={false}>
          {isPinned && (
            <motion.div
              key="pin"
              initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
              className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-white/[0.12] px-2 py-1 text-[10px] font-medium text-white/90 backdrop-blur-sm"
            >
              <Pin className="h-3 w-3" />
              Pinned
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-2 right-2 z-10 opacity-0 transition-opacity duration-200 ease-out group-hover/card:opacity-40">
          <GripVertical className="h-4 w-4 text-white/60" />
        </div>
      </div>
      <div className="p-4">
        <FormatToggle color={color} />
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => copy(formattedValue, copyId)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-[background-color,color] duration-150 ease-out",
              copied === copyId
                ? "bg-green-500/20 text-green-500"
                : "bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08] hover:text-foreground"
            )}
            aria-label={`Copy ${formattedValue}`}
          >
            {copied === copyId ? (
              <><Check className="h-3.5 w-3.5" /> Copied</>
            ) : (
              "Copy"
            )}
          </button>
          <button
            onClick={() => togglePin(color.hex)}
            className={cn(
              "flex items-center justify-center rounded-lg px-3 py-2 transition-[background-color,color] duration-150 ease-out",
              isPinned
                ? "bg-white/10 text-foreground"
                : "bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08]"
            )}
            aria-label={isPinned ? "Unpin color" : "Pin color"}
          >
            {isPinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
