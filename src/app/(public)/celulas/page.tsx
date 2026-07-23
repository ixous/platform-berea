import { db } from "@/lib/db";
import { cells } from "@/lib/db/schema";
import { and, isNull, eq } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock } from "@/components/public/ContentBlock";
import { Card } from "@/components/public/Card";
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
        <ContentBlock>
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((c, i) => (
                <Card
                  key={c.id}
                  className={`animate-fade-up p-8 animation-delay-${Math.min((i + 1) * 100, 950)}`}
                >
                  <h3 className="text-lg font-bold text-berea-navy">{c.name}</h3>
                  <div className="mt-4 space-y-3 text-sm text-berea-muted">
                    {c.type && (
                      <span className="inline-block rounded-lg bg-berea-light px-3 py-1 text-xs font-medium text-berea-navy">
                        {c.type}
                      </span>
                    )}
                    {c.leader && (
                      <p className="flex items-center gap-2">
                        <User className="h-4 w-4 text-berea-gold/60" />
                        {c.leader}
                      </p>
                    )}
                    {c.meetingDay && c.meetingTime && (
                      <p className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-berea-gold/40" />
                        {c.meetingDay} &middot; {c.meetingTime}
                      </p>
                    )}
                    {c.address && (
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-berea-gold/40" />
                        {c.address}
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
            <div className="mb-14 grid gap-8 sm:grid-cols-3">
              {cellTypes.map((t, i) => (
                <Card
                  key={t.name}
                  className={`animate-fade-up p-8 text-center animation-delay-${Math.min((i + 1) * 100, 950)}`}
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-berea-navy/5">
                    <User className="h-6 w-6 text-berea-gold/60" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-berea-navy">{t.name}</h3>
                  <p className="mt-2 text-sm text-berea-muted">{t.desc}</p>
                </Card>
              ))}
            </div>
            <p className="text-center text-sm text-berea-muted">
              Pr\u00f3ximamente se mostrar\u00e1 aqu\u00ed el listado completo de c\u00e9lulas
              activas con su ubicaci\u00f3n, horario e informaci\u00f3n de contacto.
            </p>
          </div>
        </ContentBlock>
      )}
    </>
  );
}
