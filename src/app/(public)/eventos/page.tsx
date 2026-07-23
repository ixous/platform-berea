import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { and, isNull, eq, gte } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock } from "@/components/public/ContentBlock";
import { EmptySection } from "@/components/public/EmptySection";
import { Card, CardTitle, CardDescription } from "@/components/public/Card";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { CalendarDays, MapPin, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eventos",
  description:
    "Próximos eventos y actividades de Centro Cristiano Berea en Mexicali, Baja California.",
};

async function getUpcomingEvents() {
  return db
    .select()
    .from(events)
    .where(
      and(
        eq(events.status, "published"),
        isNull(events.deletedAt),
        gte(events.startDate, new Date())
      )
    )
    .orderBy(events.startDate)
    .limit(20);
}

export default async function EventosPage() {
  const items = await getUpcomingEvents();

  return (
    <>
      <PageBanner
        title="Eventos"
        subtitle="Mantente al día con nuestras actividades."
        backgroundImage="/images/banner-eventos.png"
      />

      {items.length > 0 ? (
        <ContentBlock variant="warm">
          <ScrollReveal animation="fade-up">
            <div className="mx-auto max-w-4xl">
              <div className="space-y-6">
                {items.map((e, i) => (
                  <Card
                    key={e.id}
                    href={`/eventos/${e.slug}`}
                    className="flex-col gap-6 p-8 sm:flex-row sm:items-center"
                  >
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-berea-navy/5">
                      <CalendarDays className="h-7 w-7 text-berea-gold" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="mt-0">{e.title}</CardTitle>
                      {e.description && <CardDescription>{e.description}</CardDescription>}
                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-berea-muted">
                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 text-berea-gold/60" />
                          {new Date(e.startDate).toLocaleDateString("es-MX", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        {e.time && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-berea-gold/60" />
                            {e.time}
                          </span>
                        )}
                        {e.location && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-berea-gold/60" />
                            {e.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </ContentBlock>
      ) : (
        <EmptySection
          title="Eventos"
          message="Próximamente podrás consultar aquí los eventos y actividades de la iglesia."
          icon={CalendarDays}
        />
      )}
    </>
  );
}
