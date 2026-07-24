import { db } from "@/lib/db";
import { ministries } from "@/lib/db/schema";
import { and, isNull, eq } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock } from "@/components/public/ContentBlock";
import { MediaCard } from "@/components/public/MediaCard";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { getEntityMediaMap } from "@/lib/db/media-helpers";
import { Users, MapPin, Clock } from "lucide-react";
import type { Metadata } from "next";

interface MinistryItem {
  name: string;
  description: string | null;
  leader?: string | null;
  schedule?: string | null;
  location?: string | null;
  id?: string;
  slug?: string;
}

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

const fiveFoldMinistries: MinistryItem[] = [
  {
    name: "Apóstoles",
    description:
      "Los apóstoles son enviados por Dios para establecer fundamentos doctrinales, abrir nuevos campos ministeriales y velar por el crecimiento espiritual de la iglesia. Tienen la capacidad de levantar líderes, impartir visión y extender el Reino de Dios más allá de las fronteras locales, asegurando que cada obra esté alineada con el propósito divino.",
  },
  {
    name: "Profetas",
    description:
      "Los profetas son portavoces de Dios que traen revelación, dirección y edificación al cuerpo de Cristo. Su ministerio fortalece la fe de la congregación al confirmar la voluntad de Dios, advertir sobre peligros espirituales y preparar los corazones para los tiempos que vienen. Operan con una sensibilidad especial al Espíritu Santo.",
  },
  {
    name: "Evangelistas",
    description:
      "Los evangelistas tienen el don y la pasión de compartir el Evangelio con los perdidos. Su ministerio se enfoca en alcanzar almas para Cristo, organizar campañas evangelísticas y movilizar a la iglesia para cumplir la Gran Comisión. Son puentes entre la comunidad y la iglesia, llevando esperanza y restauración a quienes aún no conocen a Cristo.",
  },
  {
    name: "Pastores",
    description:
      "Los pastores son llamados a cuidar, guiar y pastorear el rebaño de Dios. Su corazón está puesto en el discipulado, la consejería y el acompañamiento espiritual de cada miembro. Se dedican a velar por la salud espiritual de la congregación, asegurando que cada persona crezca en su fe, encuentre propósito y sea edificada en amor.",
  },
  {
    name: "Maestros",
    description:
      "Los maestros tienen la capacidad de explicar y aplicar la Palabra de Dios con claridad y profundidad. Su ministerio consiste en formar discípulos mediante la enseñanza sistemática de la Biblia, preparando a los creyentes para defender su fe, crecer en conocimiento y enseñar a otros. Son fundamentales para la edificación doctrinal de la iglesia.",
  },
];

export default async function MinisteriosActivosPage() {
  const items = await getMinistries();
  const mediaMap = await getEntityMediaMap(
    "ministry",
    items.map((m) => m.id)
  );

  const hasCmsData = items.length > 0;
  const displayItems = hasCmsData ? items : fiveFoldMinistries;

  return (
    <>
      <PageBanner
        title="Ministerios Activos"
        subtitle="Descubre tu lugar para servir."
        backgroundImage="/images/banner-ministerios.png"
      />

      <ContentBlock variant="gold-mist">
        <ScrollReveal animation="fade-up">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-berea-navy sm:text-4xl">
              Los Cinco Ministerios
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-berea-muted">
              Cristo dio estos ministerios para equipar al pueblo de Dios, edificar el cuerpo de
              Cristo y llevarnos a la madurez espiritual. Cada uno es un regalo divino para la
              iglesia.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="stagger" staggerItems delay={150} className="mt-16">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {displayItems.map((m: MinistryItem) => {
              const img = hasCmsData ? mediaMap.get(m.id!) : null;
              return (
                <MediaCard
                  key={m.name || m.id}
                  title={m.name}
                  description={m.description || null}
                  imageUrl={img?.mediaUrl || img?.thumbnailUrl}
                  category="Ministerio"
                  meta={
                    hasCmsData ? (
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
                    ) : undefined
                  }
                />
              );
            })}
          </div>
        </ScrollReveal>
      </ContentBlock>
    </>
  );
}
