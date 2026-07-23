import { db } from "@/lib/db";
import { annualVision } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock } from "@/components/public/ContentBlock";
import { EmptySection } from "@/components/public/EmptySection";
import { Eye } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visi\u00f3n Anual",
  description:
    "Conoce la visi\u00f3n anual de Centro Cristiano Berea y el enfoque que Dios nos ha dado para este a\u00f1o.",
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
      <PageBanner
        title="Visi\u00f3n Anual"
        subtitle="Lo que Dios nos ha encomendado este a\u00f1o."
      />

      {vision ? (
        <ContentBlock>
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-berea-border bg-white p-12 text-center">
              {vision.year && (
                <span className="inline-block rounded-full bg-berea-navy/5 px-4 py-1.5 text-sm font-semibold tracking-wider text-berea-gold">
                  Visi\u00f3n {vision.year}
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
        </ContentBlock>
      ) : (
        <EmptySection
          title="Visi\u00f3n Anual"
          message="Pr\u00f3ximamente se publicar\u00e1 aqu\u00ed la visi\u00f3n anual de la iglesia."
          icon={Eye}
        />
      )}
    </>
  );
}
