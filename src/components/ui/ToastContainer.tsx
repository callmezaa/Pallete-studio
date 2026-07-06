"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useToastStore } from "@/store/toast-store";
import { cn } from "@/lib/utils";

const typeStyles: Record<string, string> = {
  error: "border-red-500/20 bg-red-500/10 text-red-400",
  success: "border-green-500/20 bg-green-500/10 text-green-400",
  info: "border-white/[0.08] bg-white/[0.06] text-foreground",
};

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.95, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
            transition={{ type: "spring", duration: 0.5, bounce: 0 }}
            layout
            className={cn(
              "pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-xl",
              "min-w-[300px] max-w-[400px]",
              typeStyles[toast.type]
            )}
          >
            <span className="flex-1 text-sm">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-[background-color,transform] duration-150 hover:bg-white/[0.08] active:scale-[0.96]"
            >
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
