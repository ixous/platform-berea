import { db } from "@/lib/db";
import { annualVision } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock, ContentNarrow } from "@/components/public/ContentBlock";
import { EmptySection } from "@/components/public/EmptySection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { Eye, Quote } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visión Anual",
  description:
    "Conoce la visión anual de Centro Cristiano Berea y el enfoque que Dios nos ha dado para este año.",
  openGraph: {
    title: "Visión Anual | Centro Cristiano Berea",
    description:
      "Conoce la visión anual de Centro Cristiano Berea y el enfoque que Dios nos ha dado para este año.",
  },
};

async function getCurrentVision() {
  const [vision] = await db
    .select()
    .from(annualVision)
    .where(eq(annualVision.status, "published"))
    .orderBy(desc(annualVision.year))
    .limit(1);
  return vision;
}

export default async function VisionAnualPage() {
  const vision = await getCurrentVision();

  return (
    <>
      <PageBanner title="Visión Anual" subtitle="Lo que Dios nos ha encomendado este año." />

      {vision ? (
        <ContentBlock variant="gold-mist">
          <ScrollReveal animation="fade-up">
            <ContentNarrow>
              <SectionHeading
                title="Nuestra Visión"
                subtitle="Cada año Dios nos da un enfoque específico para guiar nuestro caminar como iglesia."
              />
            </ContentNarrow>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={200} className="mt-16">
            <div className="mx-auto max-w-4xl">
              <div className="relative overflow-hidden rounded-3xl border border-berea-border/30 bg-white shadow-xl">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.08),transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,162,39,0.04),transparent_50%)]" />

                <div className="relative p-10 sm:p-14 lg:p-20">
                  {vision.year && (
                    <div className="flex justify-center">
                      <span className="inline-flex items-center gap-2 rounded-full bg-berea-gold/10 px-5 py-2 text-sm font-semibold tracking-wider text-berea-gold ring-1 ring-berea-gold/10">
                        <Eye className="h-4 w-4" />
                        Visión {vision.year}
                      </span>
                    </div>
                  )}

                  <h2 className="mt-8 text-center text-balance text-3xl font-bold tracking-tight text-berea-navy sm:text-4xl lg:text-5xl">
                    {vision.name}
                  </h2>

                  {vision.verse && (
                    <div className="relative mx-auto mt-10 max-w-2xl">
                      <Quote className="absolute -left-2 -top-2 h-8 w-8 text-berea-gold/15" />
                      <blockquote className="rounded-2xl bg-gradient-to-br from-berea-navy/[0.03] to-berea-gold/[0.04] p-6 text-center text-lg leading-relaxed italic text-berea-navy/70 sm:p-8 sm:text-xl">
                        &ldquo;{vision.verse}&rdquo;
                      </blockquote>
                    </div>
                  )}

                  {vision.description && (
                    <>
                      <div className="mx-auto mt-10 h-px w-16 bg-gradient-to-r from-transparent via-berea-gold/40 to-transparent" />
                      <p className="mx-auto mt-10 max-w-3xl text-center text-lg leading-relaxed text-berea-muted">
                        {vision.description}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </ContentBlock>
      ) : (
        <EmptySection
          title="Visión Anual"
          message="Próximamente se publicará aquí la visión anual de la iglesia."
          icon={Eye}
        />
      )}
    </>
  );
}
