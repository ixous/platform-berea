import { db } from "@/lib/db";
import { cells } from "@/lib/db/schema";
import { and, isNull, eq } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import { MapPin, Clock, User } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "C\u00e9lulas",
  description:
    "Encuentra una c\u00e9lula cercana en Centro Cristiano Berea. Grupos peque\u00f1os para crecer en comunidad.",
};

async function getCells() {
  return db
    .select()
    .from(cells)
    .where(and(eq(cells.status, "active"), isNull(cells.deletedAt)))
    .orderBy(cells.name);
}

const cellTypes = [
  { name: "Mixtas", desc: "Grupos para hombres y mujeres que se re\u00fanen semanalmente." },
  { name: "Mujeres", desc: "C\u00e9lulas enfocadas en el crecimiento espiritual de las mujeres." },
  { name: "Varones", desc: "Grupos dise\u00f1ados para fortalecer la fe de los varones." },
];

export default async function CelulasPage() {
  const items = await getCells();

  return (
    <>
      <PageBanner
        title="C\u00e9lulas"
        subtitle="Encuentra una c\u00e9lula cercana y crece en comunidad."
      />

      {items.length > 0 ? (
        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((c) => (
                <div key={c.id} className="rounded-lg border border-berea-border bg-white p-6">
                  <h3 className="text-lg font-bold text-berea-navy">{c.name}</h3>
                  <div className="mt-3 space-y-2 text-sm text-berea-muted">
                    {c.type && (
                      <p className="flex items-center gap-1.5">
                        <span className="rounded bg-berea-light px-2 py-0.5 text-xs font-medium">
                          {c.type}
                        </span>
                      </p>
                    )}
                    {c.leader && (
                      <p className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        {c.leader}
                      </p>
                    )}
                    {c.meetingDay && c.meetingTime && (
                      <p className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {c.meetingDay} &middot; {c.meetingTime}
                      </p>
                    )}
                    {c.address && (
                      <p className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {c.address}
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
            <div className="mb-12 grid gap-6 sm:grid-cols-3">
              {cellTypes.map((t) => (
                <div
                  key={t.name}
                  className="rounded-lg border border-berea-border bg-white p-6 text-center"
                >
                  <h3 className="text-lg font-bold text-berea-navy">{t.name}</h3>
                  <p className="mt-2 text-sm text-berea-muted">{t.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-berea-muted">
              Pr\u00f3ximamente se mostrar\u00e1 aqu\u00ed el listado completo de c\u00e9lulas
              activas con su ubicaci\u00f3n, horario e informaci\u00f3n de contacto.
            </p>
          </div>
        </section>
      )}
    </>
  );
}
