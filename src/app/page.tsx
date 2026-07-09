"use client";

import dynamic from "next/dynamic";
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
import { GSAPHero } from "@/components/home/GSAPHero";
import { GSAPReveal } from "@/components/home/GSAPReveal";
import { FeaturedPalette } from "@/components/home/FeaturedPalette";
import { PageFooter } from "@/components/ui/PageFooter";
import { useUploadStore } from "@/store/upload-store";
import { usePaletteStore } from "@/store/palette-store";
import { useFirstVisit } from "@/hooks/useFirstVisit";

const GradientAnimation = dynamic(() => import("@/components/motion/GradientAnimation").then((m) => m.GradientAnimation), { ssr: false });
const ExportPanel = dynamic(() => import("@/components/export/ExportPanel").then((m) => m.ExportPanel), { ssr: false });

export default function Home() {
  const preview = useUploadStore((s) => s.preview);
  const colors = usePaletteStore((s) => s.colors);
  const hasPalette = colors.length > 0;
  const { show: showTip, dismiss: dismissTip } = useFirstVisit();

  return (
    <main className="min-h-screen">
      <GradientAnimation />
      <GSAPHero />

      <div className="mx-auto max-w-6xl px-6 pb-24">
        <div className="space-y-8">
          <GSAPReveal>
            <FeaturedPalette />
          </GSAPReveal>

          <GSAPReveal>
            <FirstVisitTip show={showTip} onDismiss={dismissTip} />
          </GSAPReveal>

          <GSAPReveal>
            <HistoryPanel />
          </GSAPReveal>

          {preview && (
            <GSAPReveal>
              <ImagePreview />
            </GSAPReveal>
          )}

          <GSAPReveal>
            <Extractor />
          </GSAPReveal>

          {hasPalette && (
            <>
              <GSAPReveal>
                <PaletteName />
                <MoodBadge />
              </GSAPReveal>

              <GSAPReveal>
                <PaletteStory />
              </GSAPReveal>

              <GSAPReveal>
                <GradientPhysics />
              </GSAPReveal>

              <GSAPReveal>
                <UIPreview />
              </GSAPReveal>

              <GSAPReveal>
                <div id="export-panel">
                  <ExportPanel />
                </div>
              </GSAPReveal>

              <GSAPReveal>
                <ContrastPanel />
              </GSAPReveal>

              <GSAPReveal>
                <DnaArt />
              </GSAPReveal>

              {colors.length >= 2 && (
                <GSAPReveal>
                  <RelationshipMap />
                </GSAPReveal>
              )}
            </>
          )}
        </div>

        <GSAPReveal>
          <div className="mt-16">
            <PageFooter />
          </div>
        </GSAPReveal>
      </div>
    </main>
  );
}
