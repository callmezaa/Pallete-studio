"use client";
import { usePaletteStore } from "@/store/palette-store";
import { GSAPReveal } from "@/components/home/GSAPReveal";
import { ColorPaletteBar } from "./ColorPaletteBar";
import { HeroPreview } from "./HeroPreview";
import { CardPreview } from "./CardPreview";
import { ButtonPreview } from "./ButtonPreview";
import { NavbarPreview } from "./NavbarPreview";
import { BadgePreview } from "./BadgePreview";
import { InputPreview } from "./InputPreview";
import { GlassCardPreview } from "./GlassCardPreview";
import { ThemeToggleCard } from "./ThemeToggleCard";
import { DemoDashboard } from "./DemoDashboard";
import { ProgressPreview } from "./ProgressPreview";
import { DemoForm } from "./DemoForm";

export function UIPreview() {
  const colors = usePaletteStore((s) => s.colors);
  if (colors.length === 0) return null;

  return (
    <section className="space-y-16">
      {/* Overview */}
      <GSAPReveal>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-balance">
              UI Preview
            </h2>
            <p className="mt-1 text-sm text-muted-foreground/60">
              Live previews styled with your extracted palette
            </p>
          </div>
          <ColorPaletteBar />
        </div>
        <HeroPreview />
      </GSAPReveal>

      {/* Components */}
      <GSAPReveal>
        <h3 className="mb-5 text-base font-semibold tracking-tight text-foreground/70 text-balance">
          Components
        </h3>
        <div className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <CardPreview />
            <GlassCardPreview />
            <NavbarPreview />
          </div>
          <div>
            <ButtonPreview />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <BadgePreview />
            <InputPreview />
          </div>
        </div>
      </GSAPReveal>

      {/* Interactive Demos */}
      <GSAPReveal>
        <h3 className="mb-5 text-base font-semibold tracking-tight text-foreground/70 text-balance">
          Interactive Demos
        </h3>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <ThemeToggleCard />
          <ProgressPreview />
          <DemoForm />
        </div>
        <div className="mt-5">
          <DemoDashboard />
        </div>
      </GSAPReveal>
    </section>
  );
}
