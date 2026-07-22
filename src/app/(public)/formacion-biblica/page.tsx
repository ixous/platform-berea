import { db } from "@/lib/db";
import { biblicalPrograms } from "@/lib/db/schema";
import { and, isNull, eq } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
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
        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 sm:grid-cols-2">
              {programs.map((p) => (
                <div key={p.id} className="rounded-lg border border-berea-border bg-white p-6">
                  <h3 className="text-xl font-bold text-berea-navy">{p.name}</h3>
                  {p.description && (
                    <p className="mt-3 text-sm leading-relaxed text-berea-muted">{p.description}</p>
                  )}
                  <div className="mt-4 space-y-1 text-sm">
                    {p.instructor && (
                      <p className="text-berea-navy">
                        <strong>Instructor:</strong> {p.instructor}
                      </p>
                    )}
                    {p.modality && (
                      <p className="text-berea-muted">
                        <strong>Modalidad:</strong> {p.modality}
                      </p>
                    )}
                    {p.duration && (
                      <p className="text-berea-muted">
                        <strong>Duraci\u00f3n:</strong> {p.duration}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-6 sm:grid-cols-2">
              {programOverview.map((p) => (
                <div key={p.name} className="rounded-lg border border-berea-border bg-white p-6">
                  <h3 className="text-lg font-bold text-berea-navy">{p.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-berea-muted">{p.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-berea-muted">
              Cada programa ser&aacute; completamente administrable desde el CMS, con
              informaci&oacute;n detallada de instructores, fechas, requisitos y modalidad.
            </p>
          </div>
        </section>
      )}
    </>
  );
}
