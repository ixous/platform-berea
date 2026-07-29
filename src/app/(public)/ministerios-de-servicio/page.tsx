import { db } from "@/lib/db";
import { institutionalPages, serviceMinistries } from "@/lib/db/schema";
import { and, isNull, eq, asc } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock } from "@/components/public/ContentBlock";
import { EmptySection } from "@/components/public/EmptySection";
import { MediaCard } from "@/components/public/MediaCard";
import { SectionHeading } from "@/components/public/SectionHeading";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { HandHeart, Heart, Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ministerios de Servicio",
  description:
    "Conoce los ministerios de servicio de Centro Cristiano Berea. Áreas donde puedes poner tus dones al servicio de Dios.",
  openGraph: {
    title: "Ministerios de Servicio | Centro Cristiano Berea",
    description:
      "Conoce los ministerios de servicio de Centro Cristiano Berea. Áreas donde puedes poner tus dones al servicio de Dios.",
  },
};

async function getServiceMinistries() {
  return db
    .select()
    .from(serviceMinistries)
    .where(and(eq(serviceMinistries.status, "published"), isNull(serviceMinistries.deletedAt)))
    .orderBy(asc(serviceMinistries.displayOrder));
}

export default async function MinisteriosServicioPage() {
  const items = await getServiceMinistries();
  const [page] = await db
    .select()
    .from(institutionalPages)
    .where(eq(institutionalPages.slug, "ministerios-de-servicio"))
    .limit(1);

  return (
    <>
      <PageBanner
        title={page?.bannerTitle || "Ministerios de Servicio"}
        subtitle={page?.bannerSubtitle || "Donde tus dones pueden marcar la diferencia."}
        backgroundImage={page?.bannerImage || "/images/banner-berea.png"}
      />

      {items.length > 0 ? (
        <ContentBlock variant="warm">
          <ScrollReveal animation="fade-up">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-berea-border/40 bg-white shadow-sm">
              <Heart className="h-10 w-10 text-berea-gold" />
            </div>
            <SectionHeading
              title="Encuentra tu Lugar"
              subtitle="Cada creyente tiene dones únicos. Nuestros ministerios de servicio son el espacio perfecto para ponerlos al servicio de Dios y la comunidad."
            />
          </ScrollReveal>

          <ScrollReveal animation="stagger" staggerItems delay={150} className="mt-16">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((m) => (
                <MediaCard
                  key={m.id}
                  variant="icon"
                  icon={HandHeart}
                  title={m.name}
                  description={m.description}
                  imageUrl={m.imageUrl ?? undefined}
                  imageAlt={m.name}
                  meta={
                    m.leader ? (
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-berea-gold" />
                        {m.leader}
                      </span>
                    ) : undefined
                  }
                />
              ))}
            </div>
          </ScrollReveal>
        </ContentBlock>
      ) : (
        <ContentBlock variant="warm">
          <EmptySection
            title="Ministerios de Servicio"
            message="Próximamente podrás conocer los ministerios de servicio donde puedes participar."
            icon={HandHeart}
          />
        </ContentBlock>
      )}
    </>
  );
}
