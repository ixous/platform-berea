import { db } from "@/lib/db";
import { ministries } from "@/lib/db/schema";
import { and, isNull, eq } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock } from "@/components/public/ContentBlock";
import { EmptySection } from "@/components/public/EmptySection";
import { MediaCard } from "@/components/public/MediaCard";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { getEntityMediaMap } from "@/lib/db/media-helpers";
import { Church, Users, MapPin, Clock } from "lucide-react";
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
  const mediaMap = await getEntityMediaMap(
    "ministry",
    items.map((m) => m.id)
  );

  return (
    <>
      <PageBanner
        title="Ministerios Activos"
        subtitle="Descubre tu lugar para servir."
        backgroundImage="/images/banner-ministerios.png"
      />

      {items.length > 0 ? (
        <ContentBlock variant="gold-mist">
          <ScrollReveal animation="fade-up">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight text-berea-navy sm:text-4xl">
                Áreas de Servicio
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-berea-muted">
                Descubre las diferentes áreas donde puedes servir y crecer en la fe junto a otros.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="stagger" staggerItems delay={150} className="mt-16">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((m) => {
                const img = mediaMap.get(m.id);
                return (
                  <MediaCard
                    key={m.id}
                    title={m.name}
                    description={m.description || null}
                    imageUrl={img?.mediaUrl || img?.thumbnailUrl}
                    category="Ministerio"
                    meta={
                      <div className="space-y-1.5 text-xs text-berea-muted">
                        {m.leader && (
                          <p className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 text-berea-gold/60" />
                            {m.leader}
                          </p>
                        )}
                        {m.schedule && (
                          <p className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-berea-gold/60" />
                            {m.schedule}
                          </p>
                        )}
                        {m.location && (
                          <p className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-berea-gold/60" />
                            {m.location}
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
        <EmptySection
          title="Ministerios Activos"
          message="Próximamente podrás consultar aquí los ministerios activos de la iglesia."
          icon={Church}
        />
      )}
    </>
  );
}
