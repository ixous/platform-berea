"use client";

import { useMemo } from "react";
import { VisualEditorShell, VisualBlock } from "@/components/visual-editor";
import { HeroSection } from "@/components/public/HeroSection";
import { ContentBlock, ContentNarrow } from "@/components/public/ContentBlock";
import { Heart, Users, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { BlockConfig } from "@/components/visual-editor";

const BLOCKS: BlockConfig[] = [
  {
    key: "hero",
    label: "Hero",
    fields: [
      { name: "heroTagline", label: "Tagline", type: "text" },
      { name: "heroTitle", label: "Título principal", type: "text" },
      { name: "heroSubtitle", label: "Subtítulo", type: "textarea" },
      { name: "heroCtaText", label: "Texto botón principal", type: "text" },
      { name: "heroCtaHref", label: "Enlace botón principal", type: "text" },
      { name: "heroSecondaryCtaText", label: "Texto botón secundario", type: "text" },
      { name: "heroSecondaryCtaHref", label: "Enlace botón secundario", type: "text" },
      { name: "heroBackgroundImage", label: "Imagen de fondo", type: "image" },
      { name: "heroImageAlt", label: "Texto alternativo", type: "text" },
    ],
  },
  {
    key: "welcome",
    label: "Bienvenida",
    fields: [
      { name: "welcomeTitle", label: "Título", type: "text" },
      { name: "welcomeDescription", label: "Descripción", type: "textarea" },
      { name: "welcomeCtaText", label: "Texto botón", type: "text" },
      { name: "welcomeCtaHref", label: "Enlace botón", type: "text" },
      { name: "welcomeCtaSecondaryText", label: "Texto botón secundario", type: "text" },
      { name: "welcomeCtaSecondaryHref", label: "Enlace botón secundario", type: "text" },
    ],
  },
  {
    key: "cta",
    label: "CTA Final",
    fields: [
      { name: "ctaTitle", label: "Título", type: "text" },
      { name: "ctaDescription", label: "Descripción", type: "textarea" },
      { name: "ctaButtonText", label: "Texto del botón", type: "text" },
      { name: "ctaButtonHref", label: "Enlace del botón", type: "text" },
      { name: "ctaBackgroundImage", label: "Imagen de fondo", type: "image" },
    ],
  },
];

const DEFAULTS = {
  heroTagline: "BIENVENIDOS",
  heroTitle: "Centro Cristiano Berea",
  heroSubtitle: "Un lugar para conocer a Cristo, crecer en Su Palabra y servir con propósito.",
  heroCtaText: "Conócenos",
  heroCtaHref: "/quienes-somos",
  heroSecondaryCtaText: "Horarios de Servicio",
  heroSecondaryCtaHref: "/contacto",
  heroBackgroundImage: "/images/banner-berea.png",
  heroImageAlt: "",
  welcomeTitle: "Una familia que vive para Cristo",
  welcomeDescription:
    "En Centro Cristiano Berea creemos que cada persona puede encontrar esperanza, propósito y una familia espiritual en Cristo.",
  welcomeCtaText: "Quienes Somos",
  welcomeCtaHref: "/quienes-somos",
  welcomeCtaSecondaryText: "Ubicación y contacto",
  welcomeCtaSecondaryHref: "/contacto",
  ctaTitle: "Visítanos",
  ctaDescription:
    "Nos encantaría recibirte en nuestra iglesia. Ven tal como eres y descubre una comunidad que te amará y te apoyará en tu caminar con Cristo.",
  ctaButtonText: "Ubicación y horarios",
  ctaButtonHref: "/contacto",
  ctaBackgroundImage: "",
};

interface HomepageVisualClientProps {
  initialData: Record<string, string>;
  onSaveBlock: (blockKey: string, data: Record<string, string>) => Promise<void>;
}

export function HomepageVisualClient({ initialData, onSaveBlock }: HomepageVisualClientProps) {
  const mergedData = useMemo(() => ({ ...DEFAULTS, ...initialData }), [initialData]);

  const getVal = (key: string) =>
    (mergedData as Record<string, string>)[key] || (DEFAULTS as Record<string, string>)[key] || "";

  return (
    <VisualEditorShell blocks={BLOCKS} initialData={mergedData} onSaveBlock={onSaveBlock}>
      <VisualBlock blockKey="hero" label="Hero">
        <HeroSection
          tagline={getVal("heroTagline")}
          title={getVal("heroTitle")}
          subtitle={getVal("heroSubtitle")}
          ctaText={getVal("heroCtaText")}
          ctaHref={getVal("heroCtaHref")}
          secondaryCtaText={getVal("heroSecondaryCtaText")}
          secondaryCtaHref={getVal("heroSecondaryCtaHref")}
          backgroundImage={getVal("heroBackgroundImage") || undefined}
        />
      </VisualBlock>

      <VisualBlock blockKey="welcome" label="Bienvenida">
        <ContentBlock variant="gold-mist">
          <ContentNarrow className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-berea-border/40 bg-white shadow-sm">
              <Heart className="h-10 w-10 text-berea-gold" />
            </div>
            <h2 className="mt-8 text-balance text-3xl font-bold tracking-tight text-berea-navy sm:text-4xl lg:text-5xl">
              {getVal("welcomeTitle")}
            </h2>
            <p className="mx-auto mt-8 max-w-3xl text-pretty text-lg leading-relaxed text-berea-muted">
              {getVal("welcomeDescription")}
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              {getVal("welcomeCtaText") && (
                <Link
                  href={getVal("welcomeCtaHref")}
                  className="group inline-flex items-center gap-2 rounded-xl bg-berea-navy px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <Users className="h-4 w-4" />
                  {getVal("welcomeCtaText")}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              )}
              {getVal("welcomeCtaSecondaryText") && (
                <Link
                  href={getVal("welcomeCtaSecondaryHref")}
                  className="group inline-flex items-center gap-2 rounded-xl border border-berea-border bg-white px-7 py-3.5 text-sm font-semibold text-berea-navy shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <MapPin className="h-4 w-4" />
                  {getVal("welcomeCtaSecondaryText")}
                </Link>
              )}
            </div>
          </ContentNarrow>
        </ContentBlock>
      </VisualBlock>

      <VisualBlock blockKey="cta" label="CTA Final">
        <section className="relative overflow-hidden bg-section-navy-warm">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.15),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,162,39,0.06),transparent_50%)]" />
          </div>
          <ContentBlock className="relative">
            <ContentNarrow className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-lg">
                <Heart className="h-10 w-10 text-berea-gold" />
              </div>
              <h2 className="mt-8 text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {getVal("ctaTitle")}
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/70">
                {getVal("ctaDescription")}
              </p>
              <div className="mt-12 flex flex-wrap justify-center gap-4">
                {getVal("ctaButtonText") && (
                  <Link
                    href={getVal("ctaButtonHref")}
                    className="group inline-flex items-center gap-2 rounded-xl bg-berea-gold px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-berea-gold/25 transition-all duration-300 hover:bg-berea-gold/90 hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    <MapPin className="h-4 w-4" />
                    {getVal("ctaButtonText")}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                )}
              </div>
            </ContentNarrow>
          </ContentBlock>
        </section>
      </VisualBlock>
    </VisualEditorShell>
  );
}
