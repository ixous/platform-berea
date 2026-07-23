import { db } from "@/lib/db";
import { biblicalPrograms } from "@/lib/db/schema";
import { and, isNull, eq } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock } from "@/components/public/ContentBlock";
import { Card, CardDescription } from "@/components/public/Card";
import { GraduationCap, Clock, User, Layers } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Formaci\u00f3n B\u00edblica",
  description:
    "Programas de formaci\u00f3n y capacitaci\u00f3n ministerial de Centro Cristiano Berea.",
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
    name: "Escuela de L\u00edderes",
    desc: "Programa dise\u00f1ado para formar l\u00edderes con car\u00e1cter cristiano, fundamento b\u00edblico y visi\u00f3n ministerial.",
  },
  {
    name: "Escuela de Ministerios",
    desc: "Capacitaci\u00f3n especializada para quienes desean servir en ministerios espec\u00edficos dentro de la iglesia.",
  },
  {
    name: "Universidad de Teolog\u00eda Holmes",
    desc: "Formaci\u00f3n teol\u00f3gica de nivel profesional, avalada por una instituci\u00f3n reconocida internacionalmente.",
  },
  {
    name: "Maestr\u00eda",
    desc: "Estudios avanzados para profundizar en el conocimiento teol\u00f3gico y la aplicaci\u00f3n ministerial.",
  },
];

export default async function FormacionBiblicaPage() {
  const programs = await getPrograms();

  return (
    <>
      <PageBanner
        title="Formaci\u00f3n B\u00edblica"
        subtitle="Crece en el conocimiento de la Palabra."
      />

      {programs.length > 0 ? (
        <ContentBlock>
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 sm:grid-cols-2">
              {programs.map((p, i) => (
                <Card
                  key={p.id}
                  className={`animate-fade-up p-8 animation-delay-${Math.min((i + 1) * 100, 950)}`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-berea-navy/5">
                    <GraduationCap className="h-6 w-6 text-berea-gold/60" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-berea-navy">{p.name}</h3>
                  {p.description && <CardDescription>{p.description}</CardDescription>}
                  <div className="mt-5 space-y-2 text-sm">
                    {p.instructor && (
                      <p className="flex items-center gap-2 text-berea-navy">
                        <User className="h-4 w-4 text-berea-gold/60" />
                        <strong>{p.instructor}</strong>
                      </p>
                    )}
                    {p.modality && (
                      <p className="flex items-center gap-2 text-berea-muted">
                        <Layers className="h-4 w-4 text-berea-gold/40" />
                        {p.modality}
                      </p>
                    )}
                    {p.duration && (
                      <p className="flex items-center gap-2 text-berea-muted">
                        <Clock className="h-4 w-4 text-berea-gold/40" />
                        {p.duration}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </ContentBlock>
      ) : (
        <ContentBlock>
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 sm:grid-cols-2">
              {programOverview.map((p, i) => (
                <Card
                  key={p.name}
                  className={`animate-fade-up p-8 animation-delay-${Math.min((i + 1) * 100, 950)}`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-berea-navy/5">
                    <GraduationCap className="h-6 w-6 text-berea-gold/60" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-berea-navy">{p.name}</h3>
                  <CardDescription>{p.desc}</CardDescription>
                </Card>
              ))}
            </div>
            <p className="mt-10 text-center text-sm text-berea-muted">
              Cada programa ser\u00e1 completamente administrable desde el CMS, con informaci\u00f3n
              detallada de instructores, fechas, requisitos y modalidad.
            </p>
          </div>
        </ContentBlock>
      )}
    </>
  );
}
