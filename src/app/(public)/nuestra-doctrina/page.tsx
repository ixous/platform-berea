import { db } from "@/lib/db";
import { institutionalPages, doctrines } from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock, ContentNarrow } from "@/components/public/ContentBlock";
import { MediaCard } from "@/components/public/MediaCard";
import { SectionHeading } from "@/components/public/SectionHeading";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { EmptySection } from "@/components/public/EmptySection";
import { Book, Infinity, Heart, Wind, ShieldCheck, Church } from "lucide-react";
import type { Metadata } from "next";

const icons = [Book, Infinity, Heart, Wind, ShieldCheck, Church];

export async function generateMetadata(): Promise<Metadata> {
  const [page] = await db
    .select()
    .from(institutionalPages)
    .where(eq(institutionalPages.slug, "nuestra-doctrina"))
    .limit(1);
  if (!page) return { title: "Nuestra Doctrina" };
  return {
    title: page.metaTitle || "Nuestra Doctrina",
    description: page.metaDescription || "Conoce las bases doctrinales de Centro Cristiano Berea.",
    openGraph: {
      title: page.metaTitle
        ? `${page.metaTitle} | Centro Cristiano Berea`
        : "Nuestra Doctrina | Centro Cristiano Berea",
      description:
        page.metaDescription || "Conoce las bases doctrinales de Centro Cristiano Berea.",
    },
  };
}

export default async function DoctrinaPage() {
  const [page] = await db
    .select()
    .from(institutionalPages)
    .where(eq(institutionalPages.slug, "nuestra-doctrina"))
    .limit(1);
  if (!page || !page.published) notFound();

  const doctrinalPoints = await db
    .select()
    .from(doctrines)
    .where(and(eq(doctrines.status, "published")))
    .orderBy(asc(doctrines.displayOrder));

  if (doctrinalPoints.length === 0) {
    return (
      <>
        <PageBanner
          title={page.bannerTitle || "Nuestra Doctrina"}
          subtitle={page.bannerSubtitle || "Los fundamentos de nuestra fe."}
          backgroundImage={page.bannerImage || "/images/banner-doctrina.png"}
        />
        <ContentBlock variant="gold-mist">
          <EmptySection
            title="Nuestra Doctrina"
            message="Próximamente estaremos compartiendo nuestras bases doctrinales."
          />
        </ContentBlock>
      </>
    );
  }

  return (
    <>
      <PageBanner
        title={page.bannerTitle || "Nuestra Doctrina"}
        subtitle={page.bannerSubtitle || "Los fundamentos de nuestra fe."}
        backgroundImage={page.bannerImage || "/images/banner-doctrina.png"}
      />

      <ContentBlock variant="gold-mist">
        <ContentNarrow>
          <ScrollReveal animation="fade-up">
            <SectionHeading
              title="Puntos Doctrinales"
              subtitle="Nuestra fe está fundamentada en la Palabra de Dios. Estos son los pilares que nos sostienen como iglesia."
            />
          </ScrollReveal>
        </ContentNarrow>

        <ScrollReveal animation="stagger" staggerItems delay={120} className="mt-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {doctrinalPoints.map((p, i) => (
              <MediaCard
                key={p.id}
                variant="icon"
                icon={icons[i % icons.length]}
                title={p.title}
                description={p.subtitle || p.content || ""}
              />
            ))}
          </div>
        </ScrollReveal>
      </ContentBlock>
    </>
  );
}
