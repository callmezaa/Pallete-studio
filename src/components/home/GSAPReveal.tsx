"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface GSAPRevealProps {
  children: React.ReactNode;
  className?: string;
}

export function GSAPReveal({ children, className }: GSAPRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current!,
        { opacity: 0, y: 40, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current!,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={ref} className={className} style={reduced ? {} : { opacity: 0 }}>
      {children}
    </div>
  );
}
