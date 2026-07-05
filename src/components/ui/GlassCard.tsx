"use client";

import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div className={cn("rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl", className)}>
      {children}
    </div>
  );
}
