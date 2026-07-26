import { db } from "@/lib/db";
import { devotionals } from "@/lib/db/schema";
import { and, isNull, eq, desc } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock } from "@/components/public/ContentBlock";
import { EmptySection } from "@/components/public/EmptySection";
import { MediaCard } from "@/components/public/MediaCard";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { getEntityMediaMap } from "@/lib/db/media-helpers";
import { BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devocionales",
  description:
    "Reflexiones bíblicas para tu crecimiento espiritual. Devocionales de Centro Cristiano Berea.",
  openGraph: {
    title: "Devocionales | Centro Cristiano Berea",
    description:
      "Reflexiones bíblicas para tu crecimiento espiritual. Devocionales de Centro Cristiano Berea.",
  },
};

async function getDevotionals() {
  return db
    .select()
    .from(devotionals)
    .where(and(eq(devotionals.status, "published"), isNull(devotionals.deletedAt)))
    .orderBy(desc(devotionals.publishedAt))
    .limit(20);
}

export default async function DevocionalesPage() {
  const items = await getDevotionals();
  const mediaMap = await getEntityMediaMap(
    "devotional",
    items.map((d) => d.id)
  );

  return (
    <>
      <PageBanner
        title="Devocionales"
        subtitle="Reflexiones bíblicas para tu crecimiento."
        backgroundImage="/images/banner-devocionales.png"
      />

      {items.length > 0 ? (
        <ContentBlock variant="gold-mist">
          <ScrollReveal animation="fade-up">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight text-berea-navy sm:text-4xl">
                Devocionales
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-berea-muted">
                Reflexiones bíblicas semanales para edificar tu vida espiritual.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="stagger" staggerItems delay={150} className="mt-16">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((d) => {
                const img = mediaMap.get(d.id);
                return (
                  <MediaCard
                    key={d.id}
                    title={d.title}
                    description={d.excerpt || d.verse}
                    imageUrl={img?.mediaUrl || img?.thumbnailUrl}
                    href={`/devocionales/${d.slug}`}
                    category="Devocional"
                    meta={<p className="text-xs text-berea-muted italic">{d.verse}</p>}
                  />
                );
              })}
            </div>
          </ScrollReveal>
        </ContentBlock>
      ) : (
        <ContentBlock variant="gold-mist">
          <EmptySection
            title="Devocionales"
            message="Próximamente podrás disfrutar de reflexiones bíblicas para tu crecimiento espiritual."
            icon={BookOpen}
          />
        </ContentBlock>
      )}
    </>
  );
}
