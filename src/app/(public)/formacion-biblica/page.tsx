import { db } from "@/lib/db";
import { biblicalPrograms } from "@/lib/db/schema";
import { and, isNull, eq } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock } from "@/components/public/ContentBlock";
import { MediaCard } from "@/components/public/MediaCard";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { getEntityMediaMap } from "@/lib/db/media-helpers";
import { User, Layers, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Formación Bíblica",
  description: "Programas de formación y capacitación ministerial de Centro Cristiano Berea.",
};

async function getPrograms() {
  return db
    .select()
    .from(biblicalPrograms)
    .where(and(eq(biblicalPrograms.status, "published"), isNull(biblicalPrograms.deletedAt)))
    .orderBy(biblicalPrograms.displayOrder);
}

const programOverview = [
  {
    name: "Escuela de Líderes",
    desc: "Programa diseñado para formar líderes con carácter cristiano, fundamento bíblico y visión ministerial.",
  },
  {
    name: "Escuela de Ministerios",
    desc: "Capacitación especializada para quienes desean servir en ministerios específicos dentro de la iglesia.",
  },
  {
    name: "Universidad de Teología Holmes",
    desc: "Formación teológica de nivel profesional, avalada por una institución reconocida internacionalmente.",
  },
  {
    name: "Maestría",
    desc: "Estudios avanzados para profundizar en el conocimiento teológico y la aplicación ministerial.",
  },
];

export default async function FormacionBiblicaPage() {
  const programs = await getPrograms();
  const mediaMap = await getEntityMediaMap(
    "biblical_program",
    programs.map((p) => p.id)
  );

  return (
    <>
      <PageBanner
        title="Formación Bíblica"
        subtitle="Crece en el conocimiento de la Palabra."
        backgroundImage="/images/banner-formacion-biblica.png"
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
                    description={p.description || null}
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
              {programOverview.map((p) => (
                <MediaCard key={p.name} title={p.name} description={p.desc} category="Programa" />
              ))}
            </div>
          </ScrollReveal>
        </ContentBlock>
      )}
    </>
  );
}
