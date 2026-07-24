import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { and, isNull, eq, gte } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock } from "@/components/public/ContentBlock";
import { EmptySection } from "@/components/public/EmptySection";
import { MediaCard } from "@/components/public/MediaCard";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { getEntityMediaMap } from "@/lib/db/media-helpers";
import { CalendarDays, Clock, MapPin } from "lucide-react";
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

function formatDate(date: Date) {
  return date.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function EventosPage() {
  const items = await getUpcomingEvents();
  const mediaMap = await getEntityMediaMap(
    "event",
    items.map((e) => e.id)
  );

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
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight text-berea-navy sm:text-4xl">
                Próximos Eventos
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-berea-muted">
                Conferencias, congresos y actividades especiales para toda la familia.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="stagger" staggerItems delay={150} className="mt-16">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((event) => {
                const img = mediaMap.get(event.id);
                return (
                  <MediaCard
                    key={event.id}
                    title={event.title}
                    description={event.description || event.additionalInfo}
                    imageUrl={img?.mediaUrl || img?.thumbnailUrl}
                    href={`/eventos/${event.slug}`}
                    category={event.eventType || "Evento"}
                    meta={
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-berea-muted">
                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 text-berea-gold/60" />
                          {formatDate(new Date(event.startDate))}
                        </span>
                        {event.time && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-berea-gold/60" />
                            {event.time}
                          </span>
                        )}
                        {event.location && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-berea-gold/60" />
                            {event.location}
                          </span>
                        )}
                      </div>
                    }
                  />
                );
              })}
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
