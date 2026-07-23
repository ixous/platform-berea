import { db } from "@/lib/db";
import { devotionals } from "@/lib/db/schema";
import { and, isNull, eq, desc } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock } from "@/components/public/ContentBlock";
import { EmptySection } from "@/components/public/EmptySection";
import { Card, CardCategory, CardTitle, CardDescription } from "@/components/public/Card";
import { BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devocionales",
  description:
    "Reflexiones bíblicas para tu crecimiento espiritual. Devocionales de Centro Cristiano Berea.",
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

  return (
    <>
      <PageBanner
        title="Devocionales"
        subtitle="Reflexiones bíblicas para tu crecimiento."
        backgroundImage="/images/banner-devocionales.png"
      />

      {items.length > 0 ? (
        <ContentBlock>
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 sm:grid-cols-2">
              {items.map((d, i) => (
                <Card
                  key={d.id}
                  href={`/devocionales/${d.slug}`}
                  className={`animate-fade-up animation-delay-${Math.min((i + 1) * 50, 950)}`}
                >
                  <CardCategory>Devocional</CardCategory>
                  <CardTitle>{d.title}</CardTitle>
                  {d.verse && (
                    <p className="mt-3 text-sm italic text-berea-gold/70 line-clamp-2">{d.verse}</p>
                  )}
                  {d.excerpt && <CardDescription>{d.excerpt}</CardDescription>}
                  {d.publishedAt && (
                    <p className="mt-4 text-xs text-berea-muted">
                      {new Date(d.publishedAt).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </ContentBlock>
      ) : (
        <EmptySection
          title="Devocionales"
          message="Próximamente publicaremos devocionales para tu crecimiento espiritual."
          icon={BookOpen}
        />
      )}
    </>
  );
}
