import { db } from "@/lib/db";
import { institutionalPages, institutionalSections } from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock } from "@/components/public/ContentBlock";
import { MediaCard } from "@/components/public/MediaCard";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { EmptySection } from "@/components/public/EmptySection";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const [page] = await db
    .select()
    .from(institutionalPages)
    .where(eq(institutionalPages.slug, "quienes-somos"))
    .limit(1);
  if (!page) return { title: "Quienes Somos" };
  return {
    title: page.metaTitle || "Quienes Somos",
    description:
      page.metaDescription || "Conoce la identidad, misión y visión de Centro Cristiano Berea.",
    openGraph: {
      title: page.metaTitle
        ? `${page.metaTitle} | Centro Cristiano Berea`
        : "Quienes Somos | Centro Cristiano Berea",
      description:
        page.metaDescription || "Conoce la identidad, misión y visión de Centro Cristiano Berea.",
    },
  };
}

export default async function QuienesSomosPage() {
  const [page] = await db
    .select()
    .from(institutionalPages)
    .where(eq(institutionalPages.slug, "quienes-somos"))
    .limit(1);
  if (!page || !page.published) notFound();

  const sections = await db
    .select()
    .from(institutionalSections)
    .where(
      and(
        eq(institutionalSections.pageSlug, "quienes-somos"),
        eq(institutionalSections.visible, true),
        eq(institutionalSections.status, "published")
      )
    )
    .orderBy(asc(institutionalSections.displayOrder));

  if (sections.length === 0) {
    return (
      <>
        <PageBanner
          title={page.bannerTitle || "Quienes Somos"}
          subtitle={page.bannerSubtitle || "Conoce nuestra identidad, misión y visión."}
          backgroundImage={page.bannerImage || "/images/banner-quienes-somos.png"}
        />
        <ContentBlock variant="gold-mist">
          <EmptySection
            title="Quienes Somos"
            message="Próximamente estaremos compartiendo información sobre nuestra iglesia."
          />
        </ContentBlock>
      </>
    );
  }

  return (
    <>
      <PageBanner
        title={page.bannerTitle || "Quienes Somos"}
        subtitle={page.bannerSubtitle || "Conoce nuestra identidad, misión y visión."}
        backgroundImage={page.bannerImage || "/images/banner-quienes-somos.png"}
      />

      <ContentBlock variant="gold-mist">
        <ScrollReveal animation="stagger" staggerItems delay={150} className="mt-16">
          <div className="grid gap-8 sm:grid-cols-2">
            {sections.map((section) => (
              <MediaCard
                key={section.id}
                title={section.title || ""}
                description={section.content || ""}
              />
            ))}
          </div>
        </ScrollReveal>
      </ContentBlock>
    </>
  );
}
