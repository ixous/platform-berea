import { db } from "@/lib/db";
import { serviceMinistries } from "@/lib/db/schema";
import { and, isNull, eq } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock } from "@/components/public/ContentBlock";
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

        {items.length > 0 ? (
          <ScrollReveal animation="stagger" staggerItems delay={150} className="mt-16">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((m) => (
                <MediaCard
                  key={m.id}
                  variant="icon"
                  icon={HandHeart}
                  title={m.name}
                  description={m.description}
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
        ) : (
          <>
            <div className="mb-12 mt-16 text-center">
              <p className="text-berea-muted">
                Estos son algunos de los ministerios de servicio donde puedes participar:
              </p>
            </div>
            <ScrollReveal animation="stagger" staggerItems delay={150} className="mt-8">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {knownServiceMinistries.map((name) => (
                  <MediaCard key={name} variant="minimal" size="sm" title={name} />
                ))}
              </div>
            </ScrollReveal>
          </>
        )}
      </ContentBlock>
    </>
  );
}
