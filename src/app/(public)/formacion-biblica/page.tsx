import { db } from "@/lib/db";
import { institutionalPages, biblicalPrograms } from "@/lib/db/schema";
import { and, isNull, eq, asc } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock } from "@/components/public/ContentBlock";
import { EmptySection } from "@/components/public/EmptySection";
import { MediaCard } from "@/components/public/MediaCard";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { getEntityMediaMap } from "@/lib/db/media-helpers";
import { User, Layers, Clock, GraduationCap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Formación Bíblica",
  description: "Programas de formación y capacitación ministerial de Centro Cristiano Berea.",
  openGraph: {
    title: "Formación Bíblica | Centro Cristiano Berea",
    description: "Programas de formación y capacitación ministerial de Centro Cristiano Berea.",
  },
};

async function getPrograms() {
  return db
    .select()
    .from(biblicalPrograms)
    .where(and(eq(biblicalPrograms.status, "published"), isNull(biblicalPrograms.deletedAt)))
    .orderBy(asc(biblicalPrograms.displayOrder));
}

export default async function FormacionBiblicaPage() {
  const programs = await getPrograms();
  const mediaMap = await getEntityMediaMap(
    "biblical_program",
    programs.map((p) => p.id)
  );
  const [page] = await db
    .select()
    .from(institutionalPages)
    .where(eq(institutionalPages.slug, "formacion-biblica"))
    .limit(1);

  return (
    <>
      <PageBanner
        title={page?.bannerTitle || "Formación Bíblica"}
        subtitle={page?.bannerSubtitle || "Crece en el conocimiento de la Palabra."}
        backgroundImage={page?.bannerImage || "/images/banner-formacion-biblica.png"}
      />

      {programs.length > 0 ? (
        <ContentBlock variant="gold-mist">
          <ScrollReveal animation="fade-up">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight text-berea-navy sm:text-4xl">
                Programas de Formación
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-berea-muted">
                Capacitación ministerial y teológica para todos los niveles.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="stagger" staggerItems delay={150} className="mt-16">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((p) => {
                const img = mediaMap.get(p.id);
                return (
                  <MediaCard
                    key={p.id}
                    title={p.name}
                    description={p.description}
                    imageUrl={img?.mediaUrl || img?.thumbnailUrl}
                    category={p.modality || "Programa"}
                    meta={
                      <div className="space-y-1.5 text-xs text-berea-muted">
                        {p.instructor && (
                          <p className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-berea-gold/60" />
                            {p.instructor}
                          </p>
                        )}
                        {p.modality && (
                          <p className="flex items-center gap-1.5">
                            <Layers className="h-3.5 w-3.5 text-berea-gold/60" />
                            {p.modality}
                          </p>
                        )}
                        {p.duration && (
                          <p className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-berea-gold/60" />
                            {p.duration}
                          </p>
                        )}
                      </div>
                    }
                  />
                );
              })}
            </div>
          </ScrollReveal>
        </ContentBlock>
      ) : (
        <ContentBlock variant="gold-mist">
          <EmptySection
            title="Formación Bíblica"
            message="Próximamente podrás conocer los programas de formación y capacitación ministerial disponibles."
            icon={GraduationCap}
          />
        </ContentBlock>
      )}
    </>
  );
}
