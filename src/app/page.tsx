"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { UploadZone } from "@/components/upload/UploadZone";
import { ImagePreview } from "@/components/upload/ImagePreview";
import { Extractor } from "@/components/palette/Extractor";
import { PaletteName } from "@/components/palette/PaletteName";
import { MoodBadge } from "@/components/palette/MoodBadge";
import { GradientPhysics } from "@/components/gradient/GradientPhysics";
import { HistoryPanel } from "@/components/palette/HistoryPanel";
import { FirstVisitTip } from "@/components/ui/FirstVisitTip";
import { UIPreview } from "@/components/preview/UIPreview";
import { ContrastPanel } from "@/components/palette/ContrastPanel";
import { DnaArt } from "@/components/palette/DnaArt";
import { RelationshipMap } from "@/components/relationship/RelationshipMap";
import { PaletteStory } from "@/components/story/PaletteStory";
import { useUploadStore } from "@/store/upload-store";
import { usePaletteStore } from "@/store/palette-store";
import { useFirstVisit } from "@/hooks/useFirstVisit";

const GradientAnimation = dynamic(() => import("@/components/motion/GradientAnimation").then((m) => m.GradientAnimation), { ssr: false });
const ParticleField = dynamic(() => import("@/components/motion/ParticleField").then((m) => m.ParticleField), { ssr: false });
const ExportPanel = dynamic(() => import("@/components/export/ExportPanel").then((m) => m.ExportPanel), { ssr: false });

function Section({ show, delay, children }: { show: boolean; delay: number; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
          transition={{ duration: 0.4, delay, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Home() {
  const preview = useUploadStore((s) => s.preview);
  const colors = usePaletteStore((s) => s.colors);
  const hasPalette = colors.length > 0;
  const { show: showTip, dismiss: dismissTip } = useFirstVisit();
  const heroWords = ["Palette", "Studio"];

  return (
    <main className="min-h-screen">
      <GradientAnimation />
      <div className="mx-auto max-w-6xl px-6 py-24">
        <section className="relative mb-16 flex min-h-[45vh] flex-col items-center justify-center overflow-hidden text-center">
          <ParticleField />
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            <h1 className="font-display text-5xl font-bold tracking-tight text-balance sm:text-6xl">
              {heroWords.map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  variants={{
                    hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
                    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
                  }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {word}{i < heroWords.length - 1 ? "\u00A0" : ""}
                </motion.span>
              ))}
            </h1>
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
                visible: { opacity: 1, y: 0, filter: "blur(0px)" },
              }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="mt-4 text-lg text-muted-foreground"
            >
              Discover the visual identity hidden inside every image.
            </motion.p>
          </motion.div>
        </section>
        <section className="space-y-8">
          <Section show delay={0.2}>
            <HistoryPanel />
          </Section>
          <Section show delay={0.25}>
            <FirstVisitTip show={showTip} onDismiss={dismissTip} />
            <UploadZone />
          </Section>
          <Section show={!!preview} delay={0.3}>
            <ImagePreview />
          </Section>
          <Section show delay={0.4}>
            <Extractor />
          </Section>
          <Section show={hasPalette} delay={0.5}>
            <PaletteName />
            <MoodBadge />
          </Section>
          <Section show={hasPalette} delay={0.55}>
            <PaletteStory />
          </Section>
          <Section show={hasPalette} delay={0.6}>
            <GradientPhysics />
          </Section>
          <Section show={hasPalette} delay={0.8}>
            <UIPreview />
          </Section>
          <Section show={hasPalette} delay={0.9}>
            <ExportPanel />
          </Section>
          <Section show={hasPalette} delay={0.95}>
            <ContrastPanel />
          </Section>
          <Section show={hasPalette} delay={1.0}>
            <DnaArt />
          </Section>
          <Section show={hasPalette && colors.length >= 2} delay={1.05}>
            <RelationshipMap />
          </Section>
        </section>
      </div>
    </main>
  );
}
