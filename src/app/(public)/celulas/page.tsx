import { db } from "@/lib/db";
import { cells } from "@/lib/db/schema";
import { and, isNull, eq } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock } from "@/components/public/ContentBlock";
import { MediaCard } from "@/components/public/MediaCard";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { getEntityMediaMap } from "@/lib/db/media-helpers";
import { MapPin, Clock, User } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Células",
  description:
    "Encuentra una célula cercana en Centro Cristiano Berea. Grupos pequeños para crecer en comunidad.",
};

async function getCells() {
  return db
    .select()
    .from(cells)
    .where(and(eq(cells.status, "active"), isNull(cells.deletedAt)))
    .orderBy(cells.name);
}

const cellTypes = [
  { name: "Mixtas", desc: "Grupos para hombres y mujeres que se reúnen semanalmente." },
  { name: "Mujeres", desc: "Células enfocadas en el crecimiento espiritual de las mujeres." },
  { name: "Varones", desc: "Grupos diseñados para fortalecer la fe de los varones." },
];

export default async function CelulasPage() {
  const items = await getCells();
  const mediaMap = await getEntityMediaMap(
    "cell",
    items.map((c) => c.id)
  );

  return (
    <>
      <PageBanner
        title="Células"
        subtitle="Encuentra una célula cercana y crece en comunidad."
        backgroundImage="/images/banner-celulas.png"
      />

      {items.length > 0 ? (
        <ContentBlock variant="gold-mist">
          <ScrollReveal animation="fade-up">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight text-berea-navy sm:text-4xl">
                Grupos de Crecimiento
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-berea-muted">
                Conoce las células disponibles y encuentra un grupo cerca de ti.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="stagger" staggerItems delay={150} className="mt-16">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((c) => {
                const img = mediaMap.get(c.id);
                return (
                  <MediaCard
                    key={c.id}
                    title={c.name}
                    description={c.description || null}
                    imageUrl={img?.mediaUrl || img?.thumbnailUrl}
                    category={c.type || null}
                    meta={
                      <div className="space-y-1.5 text-xs text-berea-muted">
                        {c.leader && (
                          <p className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-berea-gold/60" />
                            {c.leader}
                          </p>
                        )}
                        {c.meetingDay && c.meetingTime && (
                          <p className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-berea-gold/60" />
                            {c.meetingDay} &middot; {c.meetingTime}
                          </p>
                        )}
                        {c.address && (
                          <p className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-berea-gold/60" />
                            {c.address}
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
                Grupos de Crecimiento
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-berea-muted">
                Conoce las células disponibles y encuentra un grupo cerca de ti.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="stagger" staggerItems delay={150} className="mt-16">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {cellTypes.map((t) => (
                <MediaCard key={t.name} title={t.name} description={t.desc} category="Célula" />
              ))}
            </div>
            <p className="mt-12 text-center text-sm text-berea-muted">
              Próximamente se mostrará aquí el listado completo de células activas con su ubicación,
              horario e información de contacto.
            </p>
          </ScrollReveal>
        </ContentBlock>
      )}
    </>
  );
}
