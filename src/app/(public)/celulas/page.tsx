import { db } from "@/lib/db";
import { institutionalPages, cells } from "@/lib/db/schema";
import { and, isNull, eq, asc } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock } from "@/components/public/ContentBlock";
import { EmptySection } from "@/components/public/EmptySection";
import { MediaCard } from "@/components/public/MediaCard";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { getEntityMediaMap } from "@/lib/db/media-helpers";
import { CELL_IMAGES } from "@/lib/public/symbolic-images";
import { Home } from "lucide-react";
import { CellConnectionFunnel } from "@/components/public/CellConnectionFunnel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Células",
  description:
    "Encuentra una célula cercana en Centro Cristiano Berea. Grupos pequeños para crecer en comunidad.",
  openGraph: {
    title: "Células | Centro Cristiano Berea",
    description:
      "Encuentra una célula cercana en Centro Cristiano Berea. Grupos pequeños para crecer en comunidad.",
  },
};

async function getCells() {
  return db
    .select()
    .from(cells)
    .where(and(eq(cells.status, "active"), isNull(cells.deletedAt)))
    .orderBy(asc(cells.name));
}

export default async function CelulasPage() {
  const items = await getCells();
  const mediaMap = await getEntityMediaMap(
    "cell",
    items.map((c) => c.id)
  );
  const [page] = await db
    .select()
    .from(institutionalPages)
    .where(eq(institutionalPages.slug, "celulas"))
    .limit(1);

  return (
    <>
      <PageBanner
        title={page?.bannerTitle || "Células"}
        subtitle={page?.bannerSubtitle || "Encuentra una célula cercana y crece en comunidad."}
        backgroundImage={page?.bannerImage || "/images/banner-celulas.png"}
      />

      <section className="relative -mt-10 mb-16 px-4 sm:px-6 lg:px-8 z-10">
        <div className="mx-auto max-w-4xl">
          <CellConnectionFunnel />
        </div>
      </section>

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
                const isMujeres =
                  c.slug?.toLowerCase().includes("mujeres") ||
                  c.type?.toLowerCase().includes("mujeres") ||
                  c.name?.toLowerCase().includes("mujeres");

                const imageUrl = isMujeres
                  ? "/images/mujeres.png"
                  : c.imageUrl ||
                    img?.mediaUrl ||
                    img?.thumbnailUrl ||
                    CELL_IMAGES[c.slug] ||
                    "/images/simbolicas/comunidad.png";

                return (
                  <MediaCard
                    key={c.id}
                    title={c.name}
                    description={c.description}
                    imageUrl={imageUrl}
                    category={c.type || null}
                  />
                );
              })}
            </div>
          </ScrollReveal>
        </ContentBlock>
      ) : (
        <ContentBlock variant="gold-mist">
          <EmptySection
            title="Células"
            message="Próximamente se mostrará aquí el listado completo de células activas con su ubicación, horario e información de contacto."
            icon={Home}
          />
        </ContentBlock>
      )}
    </>
  );
}
