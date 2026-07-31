import { db } from "@/lib/db";
import { institutionalPages, institutionalSections, historyMilestones } from "@/lib/db/schema";
import { eq, and, asc, isNull } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock, ContentNarrow } from "@/components/public/ContentBlock";
import { MediaCard } from "@/components/public/MediaCard";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { SectionHeading } from "@/components/public/SectionHeading";
import { SectionSeparator } from "@/components/public/SectionSeparator";
import { EmptySection } from "@/components/public/EmptySection";
import { Heart } from "lucide-react";
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

  const milestones = await db
    .select()
    .from(historyMilestones)
    .where(and(eq(historyMilestones.status, "published"), isNull(historyMilestones.deletedAt)))
    .orderBy(asc(historyMilestones.displayOrder));

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
                imageUrl={section.imageUrl ?? null}
              />
            ))}
          </div>
        </ScrollReveal>
      </ContentBlock>

      {milestones.length > 0 && (
        <>
          <SectionSeparator variant="wave-gold" />
          <ContentBlock variant="warm">
            <ScrollReveal animation="fade-up">
              <SectionHeading
                title="Nuestra Historia"
                subtitle="Cada etapa ha sido un peldaño en el plan de Dios para nuestra iglesia."
              />
            </ScrollReveal>

            <div className="relative mx-auto mt-20 max-w-6xl">
              <div className="absolute left-8 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-berea-gold/20 to-transparent lg:block" />

              <div className="space-y-16 lg:space-y-24">
                {milestones.map((m, i) => (
                  <ScrollReveal key={m.id} animation="fade-up" delay={i * 100}>
                    <div
                      className={`relative flex flex-col items-start gap-6 lg:flex-row ${
                        i % 2 === 1 ? "lg:flex-row-reverse" : ""
                      }`}
                    >
                      <div className="hidden lg:absolute lg:left-1/2 lg:z-10 lg:flex lg:-translate-x-1/2 lg:items-center lg:justify-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-berea-gold/30 bg-white shadow-md">
                          <span className="text-sm font-bold text-berea-gold">{m.year}</span>
                        </div>
                      </div>

                      <div className={`lg:w-1/2 ${i % 2 === 1 ? "lg:pl-8" : "lg:pr-8"}`}>
                        <MediaCard
                          title={m.title}
                          description={m.description}
                          imageUrl={m.imageUrl}
                          imageAlt={m.title}
                          orientation="horizontal"
                          badge={m.year}
                        />
                      </div>
                      <div
                        className={`hidden lg:block lg:w-1/2 ${i % 2 === 1 ? "lg:pr-8" : "lg:pl-8"}`}
                      />
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ContentBlock>

          <section className="relative overflow-hidden bg-section-navy-warm">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.15),transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,162,39,0.06),transparent_50%)]" />
            </div>
            <ContentBlock variant="navy-warm" className="relative">
              <ScrollReveal animation="fade-up">
                <ContentNarrow className="text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-lg">
                    <Heart className="h-10 w-10 text-berea-gold" />
                  </div>
                  <h2 className="mt-8 text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                    Escribiendo el Próximo Capítulo
                  </h2>
                  <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/70">
                    La historia de Berea sigue escribiéndose. Cada persona que llega, cada familia
                    que se integra, cada vida que es transformada por el evangelio es un nuevo
                    capítulo en esta historia de fe. Te invitamos a ser parte de lo que Dios está
                    haciendo.
                  </p>
                </ContentNarrow>
              </ScrollReveal>
            </ContentBlock>
          </section>
        </>
      )}
    </>
  );
}
