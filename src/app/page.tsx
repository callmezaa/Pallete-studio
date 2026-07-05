"use client";

import dynamic from "next/dynamic";
import { UploadZone } from "@/components/upload/UploadZone";
import { ImagePreview } from "@/components/upload/ImagePreview";
import { Extractor } from "@/components/palette/Extractor";
import { PaletteName } from "@/components/palette/PaletteName";
import { MoodBadge } from "@/components/palette/MoodBadge";
import { GradientControls } from "@/components/gradient/GradientControls";
import { UIPreview } from "@/components/preview/UIPreview";

const GradientPreview = dynamic(() => import("@/components/gradient/GradientPreview").then((m) => m.GradientPreview), { ssr: false });
const GradientAnimation = dynamic(() => import("@/components/motion/GradientAnimation").then((m) => m.GradientAnimation), { ssr: false });
const ExportPanel = dynamic(() => import("@/components/export/ExportPanel").then((m) => m.ExportPanel), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen">
      <GradientAnimation />
      <div className="mx-auto max-w-6xl px-6 py-24">
        <section className="mb-24 text-center">
          <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
            Palette Studio
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Discover the visual identity hidden inside every image.
          </p>
        </section>
        <section className="space-y-8">
          <UploadZone />
          <ImagePreview />
          <Extractor />
          <PaletteName />
          <MoodBadge />
          <GradientPreview />
          <GradientControls />
          <UIPreview />
          <ExportPanel />
        </section>
      </div>
    </main>
  );
}
