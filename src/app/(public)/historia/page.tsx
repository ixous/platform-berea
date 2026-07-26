import { db } from "@/lib/db";
import { pages, historyMilestones } from "@/lib/db/schema";
import { eq, and, isNull, asc } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock, ContentNarrow } from "@/components/public/ContentBlock";
import { MediaCard } from "@/components/public/MediaCard";
import { SectionHeading } from "@/components/public/SectionHeading";
import { SectionSeparator } from "@/components/public/SectionSeparator";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuestra Historia",
  description:
    "Conoce la historia de Centro Cristiano Berea y cómo Dios ha guiado a nuestra iglesia desde sus inicios.",
  openGraph: {
    title: "Nuestra Historia | Centro Cristiano Berea",
    description:
      "Conoce la historia de Centro Cristiano Berea y cómo Dios ha guiado a nuestra iglesia desde sus inicios.",
  },
};

async function getPage() {
  const [page] = await db.select().from(pages).where(eq(pages.slug, "nuestra-historia")).limit(1);
  return page;
}

async function getMilestones() {
  return db
    .select()
    .from(historyMilestones)
    .where(and(eq(historyMilestones.status, "published"), isNull(historyMilestones.deletedAt)))
    .orderBy(asc(historyMilestones.displayOrder));
}

export default async function HistoriaPage() {
  const [page, milestones] = await Promise.all([getPage(), getMilestones()]);

  return (
    <>
      <PageBanner
        title="Nuestra Historia"
        subtitle="Una historia de fe, crecimiento y propósito."
        backgroundImage="/images/banner-berea.png"
      />

      <ContentBlock variant="gold-mist">
        <ContentNarrow>
          <ScrollReveal animation="fade-up">
            {page?.content ? (
              <div className="space-y-6 text-center leading-relaxed text-berea-muted">
                <p className="text-lg leading-relaxed">{page.content}</p>
              </div>
            ) : (
              <div className="space-y-8 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-berea-border/40 bg-white shadow-sm">
                  <Heart className="h-10 w-10 text-berea-gold" />
                </div>
                <h2 className="text-balance text-3xl font-bold tracking-tight text-berea-navy sm:text-4xl">
                  Cómo Comenzó Todo
                </h2>
                <p className="mx-auto max-w-3xl text-pretty text-lg leading-relaxed text-berea-muted">
                  La historia de Centro Cristiano Berea es un testimonio vivo de la fidelidad de
                  Dios. Desde un pequeño grupo de creyentes hasta una comunidad vibrante que hoy
                  impacta a Mexicali, cada etapa ha sido marcada por la gracia divina y el
                  compromiso de servir a Cristo con todo el corazón.
                </p>
              </div>
            )}
          </ScrollReveal>
        </ContentNarrow>
      </ContentBlock>

      <SectionSeparator variant="wave-gold" />

      {milestones.length > 0 && (
        <ContentBlock variant="warm">
          <ScrollReveal animation="fade-up">
            <SectionHeading
              title="Nuestra Trayectoria"
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
                    <div className="hidden lg:absolute lg:left-1/2 lg:flex lg:-translate-x-1/2 lg:items-center lg:justify-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-berea-gold/30 bg-white shadow-md">
                        <span className="text-sm font-bold text-berea-gold">{m.year}</span>
                      </div>
                    </div>

                    <div className="lg:w-1/2">
                      <MediaCard
                        title={m.title}
                        description={m.description}
                        imageUrl={m.imageUrl}
                        imageAlt={m.title}
                        orientation="horizontal"
                        badge={m.year}
                      />
                    </div>
                    <div className="hidden lg:block lg:w-1/2" />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ContentBlock>
      )}

      <section className="relative overflow-hidden bg-section-navy-warm">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,162,39,0.06),transparent_50%)]" />
        </div>
        <ContentBlock className="relative">
          <ScrollReveal animation="fade-up">
            <ContentNarrow className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-lg">
                <Heart className="h-10 w-10 text-berea-gold" />
              </div>
              <h2 className="mt-8 text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Escribiendo el Próximo Capítulo
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/70">
                La historia de Berea sigue escribiéndose. Cada persona que llega, cada familia que
                se integra, cada vida que es transformada por el evangelio es un nuevo capítulo en
                esta historia de fe. Te invitamos a ser parte de lo que Dios está haciendo.
              </p>
              <div className="mt-12 flex flex-wrap justify-center gap-4">
                <Link
                  href="/quienes-somos"
                  className="group inline-flex items-center gap-2 rounded-xl bg-berea-gold px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-berea-gold/25 transition-all duration-300 hover:bg-berea-gold/90 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Conócenos
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/contacto"
                  className="group inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5"
                >
                  Contáctanos
                </Link>
              </div>
            </ContentNarrow>
          </ScrollReveal>
        </ContentBlock>
      </section>
    </>
  );
}
