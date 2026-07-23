import { db } from "@/lib/db";
import { ministries } from "@/lib/db/schema";
import { and, isNull, eq } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock } from "@/components/public/ContentBlock";
import { EmptySection } from "@/components/public/EmptySection";
import { Card, CardDescription } from "@/components/public/Card";
import { Church, Users, MapPin, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ministerios Activos",
  description:
    "Descubre los ministerios activos de Centro Cristiano Berea y encuentra tu lugar para servir.",
};

async function getMinistries() {
  return db
    .select()
    .from(ministries)
    .where(and(eq(ministries.status, "active"), isNull(ministries.deletedAt)))
    .orderBy(ministries.displayOrder);
}

export default async function MinisteriosActivosPage() {
  const items = await getMinistries();

  return (
    <>
      <PageBanner title="Ministerios Activos" subtitle="Descubre tu lugar para servir." />

      {items.length > 0 ? (
        <ContentBlock>
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 sm:grid-cols-2">
              {items.map((m, i) => (
                <Card
                  key={m.id}
                  className={`animate-fade-up p-8 animation-delay-${Math.min((i + 1) * 100, 950)}`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-berea-navy/5">
                    <Church className="h-6 w-6 text-berea-gold/60" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-berea-navy">{m.name}</h3>
                  {m.description && <CardDescription>{m.description}</CardDescription>}
                  <div className="mt-6 space-y-2 text-sm">
                    {m.leader && (
                      <p className="flex items-center gap-2 text-berea-navy">
                        <Users className="h-4 w-4 text-berea-gold/60" />
                        <strong>{m.leader}</strong>
                      </p>
                    )}
                    {m.schedule && (
                      <p className="flex items-center gap-2 text-berea-muted">
                        <Clock className="h-4 w-4 text-berea-gold/40" />
                        {m.schedule}
                      </p>
                    )}
                    {m.location && (
                      <p className="flex items-center gap-2 text-berea-muted">
                        <MapPin className="h-4 w-4 text-berea-gold/40" />
                        {m.location}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </ContentBlock>
      ) : (
        <EmptySection
          title="Ministerios Activos"
          message="Pr\u00f3ximamente podr\u00e1s consultar aqu\u00ed los ministerios activos de la iglesia."
          icon={Church}
        />
      )}
    </>
  );
}
