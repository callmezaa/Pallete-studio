"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollHint() {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const fadeStart = 0;
      const fadeEnd = 200;
      const newOpacity = Math.max(0, 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart));
      setOpacity(newOpacity);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (opacity <= 0) return null;

  return (
    <div
      className="flex items-center justify-center pt-4 pb-2 transition-opacity duration-100"
      style={{ opacity }}
    >
      <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-widest uppercase text-muted-foreground/25">
        Scroll to explore
        <ChevronDown className="h-3 w-3 animate-bounce" />
      </div>
    </div>
  );
}
