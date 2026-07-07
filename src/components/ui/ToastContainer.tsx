"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useToastStore } from "@/store/toast-store";
import { cn } from "@/lib/utils";

const typeStyles: Record<string, string> = {
  error: "border-white/[0.06] bg-white/[0.04] text-red-400",
  success: "border-white/[0.06] bg-white/[0.04] text-foreground",
  info: "border-white/[0.06] bg-white/[0.04] text-foreground",
};

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-1.5">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 12, scale: 0.95, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
            transition={{ type: "spring", duration: 0.4, bounce: 0 }}
            layout
            className={cn(
              "pointer-events-auto flex items-center gap-2 rounded-xl border px-3 py-2.5 shadow-lg backdrop-blur-xl",
              "min-w-[240px] max-w-[360px]",
              typeStyles[toast.type]
            )}
          >
            <span className="flex-1 text-xs">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-[background-color,transform] duration-150 hover:bg-white/[0.08] active:scale-[0.96]"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
