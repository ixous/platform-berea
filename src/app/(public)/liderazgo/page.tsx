import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock, ContentNarrow } from "@/components/public/ContentBlock";
import { EmptySection } from "@/components/public/EmptySection";
import { MediaCard } from "@/components/public/MediaCard";
import { SectionHeading } from "@/components/public/SectionHeading";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { Users, Heart } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liderazgo",
  description:
    "Conoce a los pastores y líderes que guían a Centro Cristiano Berea en Mexicali, Baja California.",
  openGraph: {
    title: "Liderazgo | Centro Cristiano Berea",
    description: "Conoce a los pastores y líderes que guían a Centro Cristiano Berea.",
  },
};

async function getLeaders() {
  return db
    .select({ id: users.id, name: users.name, email: users.email })
    .from(users)
    .where(and(eq(users.status, "active"), isNull(users.deletedAt)))
    .limit(12);
}

export default async function LiderazgoPage() {
  const leaders = await getLeaders();

  return (
    <>
      <PageBanner title="Liderazgo" subtitle="Conoce a quienes guían nuestra iglesia." />

      {leaders.length > 0 ? (
        <>
          <ContentBlock variant="gold-mist">
            <ContentNarrow>
              <ScrollReveal animation="fade-up">
                <div className="text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-berea-border/40 bg-white shadow-sm">
                    <Heart className="h-10 w-10 text-berea-gold" />
                  </div>
                  <SectionHeading
                    title="Nuestro Equipo Pastoral"
                    subtitle="Hombres y mujeres llamados por Dios para servir y guiar a nuestra congregación."
                  />
                </div>
              </ScrollReveal>
            </ContentNarrow>
          </ContentBlock>

          <ContentBlock variant="warm">
            <ScrollReveal animation="stagger" staggerItems delay={100}>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {leaders.map((leader) => (
                  <MediaCard
                    key={leader.id}
                    variant="profile"
                    title={leader.name || ""}
                    description="Líder"
                  />
                ))}
              </div>
            </ScrollReveal>
          </ContentBlock>
        </>
      ) : (
        <EmptySection
          title="Liderazgo"
          message="Próximamente podrás conocer a los pastores y líderes de nuestra iglesia."
          icon={Users}
        />
      )}
    </>
  );
}
