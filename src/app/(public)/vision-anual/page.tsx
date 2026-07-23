import { db } from "@/lib/db";
import { annualVision } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock } from "@/components/public/ContentBlock";
import { EmptySection } from "@/components/public/EmptySection";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { Eye } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visión Anual",
  description:
    "Conoce la visión anual de Centro Cristiano Berea y el enfoque que Dios nos ha dado para este año.",
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
            <div className="mx-auto max-w-3xl">
              <div className="relative overflow-hidden rounded-2xl border border-berea-border/40 bg-gradient-to-br from-white via-white to-berea-light/50 p-12 text-center shadow-lg shadow-berea-navy/5">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.08),transparent_60%)] pointer-events-none" />
                {vision.year && (
                  <span className="inline-block rounded-full bg-berea-navy/5 px-4 py-1.5 text-sm font-semibold tracking-wider text-berea-gold">
                    Visión {vision.year}
                  </span>
                )}
                <h2 className="mt-6 text-balance text-3xl font-bold tracking-tight text-berea-navy sm:text-4xl">
                  {vision.name}
                </h2>
                {vision.verse && (
                  <blockquote className="mx-auto mt-8 max-w-lg rounded-xl border-l-4 border-berea-gold bg-berea-light p-6 text-left italic text-berea-muted">
                    {vision.verse}
                  </blockquote>
                )}
                {vision.description && (
                  <div className="mx-auto mt-8 h-0.5 w-20 rounded-full bg-berea-gold/30" />
                )}
                {vision.description && (
                  <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-berea-muted">
                    {vision.description}
                  </p>
                )}
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
