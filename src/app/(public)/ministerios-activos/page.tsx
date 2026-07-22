import { db } from "@/lib/db";
import { ministries } from "@/lib/db/schema";
import { and, isNull, eq } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import { EmptySection } from "@/components/public/EmptySection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ministerios Activos",
  description:
    "Descubre los ministerios activos de Centro Cristiano Berea y encuentra tu lugar para servir.",
};

async function getMinistries() {
  return db
    .select()
    .from(ministries)
    .where(and(eq(ministries.status, "active"), isNull(ministries.deletedAt)))
    .orderBy(ministries.displayOrder);
}

export default async function MinisteriosActivosPage() {
  const items = await getMinistries();

  return (
    <>
      <PageBanner title="Ministerios Activos" subtitle="Descubre tu lugar para servir." />

      {items.length > 0 ? (
        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 sm:grid-cols-2">
              {items.map((m) => (
                <div key={m.id} className="rounded-lg border border-berea-border bg-white p-6">
                  <h3 className="text-xl font-bold text-berea-navy">{m.name}</h3>
                  {m.description && (
                    <p className="mt-3 text-sm leading-relaxed text-berea-muted">{m.description}</p>
                  )}
                  <div className="mt-4 space-y-1 text-sm">
                    {m.leader && (
                      <p className="text-berea-navy">
                        <strong>L\u00edder:</strong> {m.leader}
                      </p>
                    )}
                    {m.schedule && (
                      <p className="text-berea-muted">
                        <strong>Horario:</strong> {m.schedule}
                      </p>
                    )}
                    {m.location && (
                      <p className="text-berea-muted">
                        <strong>Lugar:</strong> {m.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <EmptySection
          title="Ministerios Activos"
          message="Pr\u00f3ximamente podr\u00e1s consultar aqu\u00ed los ministerios activos de la iglesia."
        />
      )}
    </>
  );
}
