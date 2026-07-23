import { db } from "@/lib/db";
import { serviceMinistries } from "@/lib/db/schema";
import { and, isNull, eq } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock } from "@/components/public/ContentBlock";
import { Card, CardDescription } from "@/components/public/Card";
import { HandHeart, Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ministerios de Servicio",
  description:
    "Conoce los ministerios de servicio de Centro Cristiano Berea. Áreas donde puedes poner tus dones al servicio de Dios.",
};

async function getServiceMinistries() {
  return db
    .select()
    .from(serviceMinistries)
    .where(and(eq(serviceMinistries.status, "active"), isNull(serviceMinistries.deletedAt)))
    .orderBy(serviceMinistries.displayOrder);
}

const knownServiceMinistries = [
  "Alabanza",
  "Niños",
  "Varones",
  "Danza",
  "Multimedia",
  "Sonido",
  "Teatro",
  "Ujieres",
  "Intercesión",
  "Seguridad",
  "Maestras de Niños",
];

export default async function MinisteriosServicioPage() {
  const items = await getServiceMinistries();

  return (
    <>
      <PageBanner
        title="Ministerios de Servicio"
        subtitle="Donde tus dones pueden marcar la diferencia."
      />

      {items.length > 0 ? (
        <ContentBlock>
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 sm:grid-cols-2">
              {items.map((m, i) => (
                <Card
                  key={m.id}
                  className={`animate-fade-up p-8 animation-delay-${Math.min((i + 1) * 100, 950)}`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-berea-navy/5">
                    <HandHeart className="h-6 w-6 text-berea-gold/60" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-berea-navy">{m.name}</h3>
                  {m.description && <CardDescription>{m.description}</CardDescription>}
                  {m.leader && (
                    <p className="mt-4 flex items-center gap-2 text-sm font-medium text-berea-navy">
                      <Users className="h-4 w-4 text-berea-gold/60" />
                      {m.leader}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </ContentBlock>
      ) : (
        <ContentBlock>
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <p className="text-berea-muted">
                Estos son algunos de los ministerios de servicio donde puedes participar:
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {knownServiceMinistries.map((name, i) => (
                <Card
                  key={name}
                  className={`animate-fade-up px-6 py-5 text-center animation-delay-${Math.min((i + 1) * 50, 950)}`}
                  padded={false}
                >
                  <span className="text-sm font-semibold text-berea-navy">{name}</span>
                </Card>
              ))}
            </div>
          </div>
        </ContentBlock>
      )}
    </>
  );
}
