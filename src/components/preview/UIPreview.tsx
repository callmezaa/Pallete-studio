"use client";
import { usePaletteStore } from "@/store/palette-store";
import { HeroPreview } from "./HeroPreview";
import { CardPreview } from "./CardPreview";
import { ButtonPreview } from "./ButtonPreview";
import { NavbarPreview } from "./NavbarPreview";
import { BadgePreview } from "./BadgePreview";
import { InputPreview } from "./InputPreview";
import { GlassCardPreview } from "./GlassCardPreview";

export function UIPreview() {
  const colors = usePaletteStore((s) => s.colors);
  if (colors.length === 0) return null;
  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold tracking-tight">UI Preview</h2>
      <div className="space-y-6">
        <HeroPreview />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <CardPreview />
          <GlassCardPreview />
          <NavbarPreview />
        </div>
        <ButtonPreview />
        <BadgePreview />
        <InputPreview />
      </div>
    </section>
  );
}
