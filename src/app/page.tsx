import { UploadZone } from "@/components/upload/UploadZone";
import { ImagePreview } from "@/components/upload/ImagePreview";
import { Extractor } from "@/components/palette/Extractor";
import { PaletteName } from "@/components/palette/PaletteName";
import { MoodBadge } from "@/components/palette/MoodBadge";

export default function Home() {
  return (
    <main className="min-h-screen">
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
        </section>
      </div>
    </main>
  );
}
