"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { UploadZone } from "@/components/upload/UploadZone";
import { FloatingBlobs } from "./FloatingBlobs";

const ParticleField = dynamic(
  () => import("@/components/motion/ParticleField").then((m) => m.ParticleField),
  { ssr: false },
);

export function GSAPHero() {
  const badgeRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const [reduced, setReduced] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 80) setScrolled(true);
    };
    window.addEventListener("scroll", onScroll, { once: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      if (badgeRef.current) {
        const text = badgeRef.current.textContent || "";
        badgeRef.current.textContent = "";
        const chars = text.split("");
        chars.forEach((char, i) => {
          const span = document.createElement("span");
          span.textContent = char;
          span.style.opacity = "0";
          badgeRef.current!.appendChild(span);
          tl.to(span, { opacity: 1, duration: 0.02 }, i * 0.04);
        });
        tl.to({}, { duration: 0.3 });
      }

      if (titleRef.current) {
        const text = titleRef.current.textContent || "";
        titleRef.current.textContent = "";
        const chars = text.split("");
        chars.forEach((char, i) => {
          const span = document.createElement("span");
          span.textContent = char;
          span.style.opacity = "0";
          titleRef.current!.appendChild(span);
          tl.to(span, { opacity: 1, duration: 0.015 }, i * 0.025 + tl.time());
        });
      }

      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { opacity: 0, filter: "blur(12px)" },
          { opacity: 1, filter: "blur(0px)", duration: 0.6 },
          ">-0.2",
        );
      }

      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4 },
          ">-0.1",
        );
      }

      if (scrollRef.current) {
        tl.fromTo(
          scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3 },
          ">-0.1",
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden text-center"
    >
      <FloatingBlobs />
      <ParticleField />

      <div className="relative z-10 mx-auto max-w-3xl px-6">
        <span
          ref={badgeRef}
          className="mb-6 inline-block rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-[11px] font-medium tracking-[1.5px] uppercase text-white/50"
        >
          ✦ Color Extraction Studio
        </span>

        <h1
          ref={titleRef}
          className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-7xl"
          style={{
            background: "linear-gradient(135deg,#fff 20%,#c4b5fd 60%,#a78bfa 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Palette Studio
        </h1>

        <p
          ref={subtitleRef}
          className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-white/40 text-balance"
        >
          Discover the visual identity hidden inside every image.
        </p>

        <div ref={ctaRef} className="mx-auto mt-10 max-w-sm">
          <UploadZone />
        </div>
      </div>

      {!scrolled && !reduced && (
        <div
          ref={scrollRef}
          className="mt-auto flex flex-col items-center gap-2 pb-8"
        >
          <span className="text-[9px] font-medium tracking-[0.2em] uppercase text-white/15">
            Scroll
          </span>
          <div className="relative flex h-10 w-[1px] items-start justify-center overflow-hidden bg-gradient-to-b from-white/0 via-white/20 to-white/0">
            <div className="h-1 w-1 animate-[scrollDot_2.2s_ease-in-out_infinite] rounded-full bg-white/60 shadow-[0_0_6px_rgba(255,255,255,0.3)]" />
          </div>
        </div>
      )}
    </section>
  );
}
