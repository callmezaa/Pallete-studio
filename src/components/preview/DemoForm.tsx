"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePaletteStore } from "@/store/palette-store";
import { textColorForBg } from "@/lib/contrast";
import { useToastStore } from "@/store/toast-store";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Eye, EyeOff, Mail, Send } from "lucide-react";

const options = ["Design", "Development", "Marketing", "Other"];

export function DemoForm() {
  const colors = usePaletteStore((s) => s.colors);
  const activeIndex = usePaletteStore((s) => s.activeColorIndex);
  const accent = activeIndex !== null ? colors[activeIndex]?.hex : colors[0]?.hex;
  const textOnAccent = textColorForBg(accent);
  const addToast = useToastStore((s) => s.addToast);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [category, setCategory] = useState("");
  const [open, setOpen] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    addToast("Demo form submitted", "success");
  };

  if (colors.length === 0) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "rounded-xl p-5",
        "bg-white/[0.03] shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]",
      )}
    >
      <h4 className="mb-4 text-xs font-semibold tracking-tight text-foreground/80 text-balance">
        Demo Form
      </h4>

      <div className="space-y-3.5">
        {/* Email */}
        <div>
          <label className="mb-1.5 block text-[10px] sm:text-xs font-medium text-muted-foreground/50">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/30" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={cn(
                "w-full rounded-lg border bg-white/[0.03] py-2.5 pl-9 pr-3 text-xs outline-none transition-all duration-150",
                "placeholder:text-muted-foreground/25",
              )}
              style={{
                borderColor: email ? accent + "50" : "rgba(255,255,255,0.08)",
                boxShadow: email ? `0 0 0 2px ${accent}15` : "none",
                color: "rgba(255,255,255,0.85)",
              }}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="mb-1.5 block text-[10px] sm:text-xs font-medium text-muted-foreground/50">
            Password
          </label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] py-2.5 pl-3 pr-9 text-xs outline-none transition-all duration-150 focus:border-white/20"
              style={{ color: "rgba(255,255,255,0.85)" }}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/30 transition-colors hover:text-muted-foreground/60"
            >
              {showPw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Select */}
        <div className="relative">
          <label className="mb-1.5 block text-[10px] sm:text-xs font-medium text-muted-foreground/50">
            Category
          </label>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex w-full items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-xs transition-all duration-150"
            style={{ color: category ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.25)" }}
          >
            {category || "Select category"}
            <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", open && "rotate-180")} />
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-lg border border-white/[0.08] bg-[#1a1a2e] backdrop-blur-xl"
              >
                {options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => { setCategory(opt); setOpen(false); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs transition-colors hover:bg-white/[0.04]"
                    style={{
                      color: opt === category ? accent : "rgba(255,255,255,0.6)",
                    }}
                  >
                    {opt === category && <Check className="h-3 w-3" style={{ color: accent }} />}
                    <span className={opt === category ? "" : "ml-5"}>{opt}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground/60">Subscribe to newsletter</span>
          <button
            type="button"
            onClick={() => setToggled(!toggled)}
            className={cn(
              "relative h-5 w-9 rounded-full transition-colors duration-200",
              "active:scale-[0.96]",
            )}
            style={{ backgroundColor: toggled ? accent : "rgba(255,255,255,0.1)" }}
          >
            <motion.div
              animate={{ x: toggled ? 16 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-[3px] h-3.5 w-3.5 rounded-full bg-white shadow-sm"
            />
          </button>
        </div>
      </div>

      {/* Submit */}
      <AnimatePresence mode="popLayout">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-5 flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-medium"
            style={{ backgroundColor: accent + "15", color: accent }}
          >
            <Check className="h-3.5 w-3.5" />
            Submitted
          </motion.div>
        ) : (
          <motion.button
            key="submit"
            type="submit"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              "mt-5 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-medium transition-all duration-150",
              "active:scale-[0.97]",
            )}
            style={{ backgroundColor: accent, color: textOnAccent }}
          >
            <Send className="h-3.5 w-3.5" />
            Send Message
          </motion.button>
        )}
      </AnimatePresence>
    </form>
  );
}
