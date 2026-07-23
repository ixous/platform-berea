import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock } from "@/components/public/ContentBlock";
import { EmptySection } from "@/components/public/EmptySection";
import { Card } from "@/components/public/Card";
import { Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liderazgo",
  description:
    "Conoce a los pastores y l\u00edderes que gu\u00edan a Centro Cristiano Berea en Mexicali, Baja California.",
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
      <PageBanner title="Liderazgo" subtitle="Conoce a quienes gu\u00edan nuestra iglesia." />

      {leaders.length > 0 ? (
        <ContentBlock>
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {leaders.map((leader, i) => (
                <Card
                  key={leader.id}
                  className={`animate-fade-up p-8 text-center animation-delay-${Math.min((i + 1) * 100, 950)}`}
                >
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-berea-navy/10 to-berea-gold/10">
                    <span className="text-4xl font-bold text-berea-navy/25">
                      {leader.name?.charAt(0) || "?"}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-berea-navy">{leader.name}</h3>
                  <p className="mt-1 text-sm text-berea-muted">L\u00edder</p>
                </Card>
              ))}
            </div>
          </div>
        </ContentBlock>
      ) : (
        <EmptySection
          title="Liderazgo"
          message="Pr\u00f3ximamente podr\u00e1s conocer a los pastores y l\u00edderes de nuestra iglesia."
          icon={Users}
        />
      )}
    </>
  );
}
