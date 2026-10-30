import { db } from "@/lib/db";
import { institutionalPages, events, contact } from "@/lib/db/schema";
import { and, isNull, eq, gte, asc } from "drizzle-orm";
import { PageIntro } from "@/components/public/PageIntro";
import { VisitStrip } from "@/components/public/VisitStrip";
import { BereaImage } from "@/components/public/BereaImage";
import { Reveal } from "@/components/public/Reveal";
import { getEntityMediaMap } from "@/lib/db/media-helpers";
import { EVENT_IMAGES, EVENT_FALLBACK } from "@/lib/public/symbolic-images";
import { CalendarDays, Clock, MapPin, Calendar } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eventos",
  description:
    "Próximos eventos y actividades de Centro Cristiano Berea en Mexicali, Baja California.",
  openGraph: {
    title: "Eventos | Centro Cristiano Berea",
    description:
      "Próximos eventos y actividades de Centro Cristiano Berea en Mexicali, Baja California.",
  },
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
    .orderBy(asc(events.startDate))
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
  const [items, [info]] = await Promise.all([
    getUpcomingEvents(),
    db.select().from(contact).limit(1),
  ]);
  const mediaMap = await getEntityMediaMap(
    "event",
    items.map((e) => e.id)
  );
  const [page] = await db
    .select()
    .from(institutionalPages)
    .where(eq(institutionalPages.slug, "eventos"))
    .limit(1);

  const schedules = (info?.schedules as { day?: string; time?: string }[] | null) ?? null;

  return (
    <>
      <PageIntro
        title={page?.bannerTitle || "Eventos"}
        subtitle={page?.bannerSubtitle || "Mantente al día con nuestras actividades."}
      />

      <section className="relative overflow-hidden bg-site-paper">
        <div className="site-aurora" aria-hidden="true" />
        <div className="site-orb site-orb-blue right-[-140px] top-[-120px]" aria-hidden="true" />

        <div className="relative mx-auto w-full max-w-[76rem] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <Reveal>
            <div className="max-w-2xl">
              <p className="site-gold-pulse text-xs font-bold uppercase tracking-[0.24em] text-site-gold">
                Agenda
              </p>
              <h2 className="mt-4 font-display text-balance text-[clamp(2.2rem,4.8vw,3.9rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-site-ink">
                Próximos eventos
              </h2>
              <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-site-muted">
                Conferencias, congresos y actividades especiales para toda la familia.
              </p>
            </div>
          </Reveal>

          {items.length > 0 ? (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((event, i) => {
                const img = mediaMap.get(event.id);
                const imageSrc =
                  img?.mediaUrl || img?.thumbnailUrl || EVENT_IMAGES[event.slug] || EVENT_FALLBACK;
                return (
                  <Reveal key={event.id} delay={(i % 3) * 120}>
                    <a
                      href={`/eventos/${event.slug}`}
                      className="site-card-glow group block overflow-hidden rounded-3xl border border-site-line bg-white transition-colors hover:border-site-gold/50"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden bg-site-ink">
                        <BereaImage
                          src={imageSrc}
                          alt={event.title}
                          fill
                          className="transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="site-sheen" aria-hidden="true" />
                      </div>
                      <div className="p-7">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-site-gold">
                          {event.eventType || "Evento"}
                        </p>
                        <h3 className="mt-3 font-display text-2xl font-extrabold leading-snug tracking-[-0.02em] text-site-ink transition-colors group-hover:text-site-gold">
                          {event.title}
                        </h3>
                        {event.description && (
                          <p className="mt-3 text-sm leading-relaxed text-site-muted">
                            {event.description}
                          </p>
                        )}
                        <div className="mt-5 space-y-2 text-sm text-site-muted">
                          <p className="flex items-center gap-2">
                            <CalendarDays
                              className="h-4 w-4 shrink-0 text-site-gold"
                              aria-hidden="true"
                            />
                            {formatDate(new Date(event.startDate))}
                          </p>
                          {event.time && (
                            <p className="flex items-center gap-2">
                              <Clock
                                className="h-4 w-4 shrink-0 text-site-gold"
                                aria-hidden="true"
                              />
                              {event.time}
                            </p>
                          )}
                          {event.location && (
                            <p className="flex items-center gap-2">
                              <MapPin
                                className="h-4 w-4 shrink-0 text-site-gold"
                                aria-hidden="true"
                              />
                              {event.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </a>
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <Reveal delay={120} className="mt-14">
              <div className="relative overflow-hidden rounded-3xl bg-site-ink p-10 text-white sm:p-14">
                <div className="site-aurora-ink" aria-hidden="true" />
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-site-gold/15">
                    <Calendar className="h-6 w-6 text-site-gold" aria-hidden="true" />
                  </div>
                  <h2 className="mt-6 font-display text-3xl font-extrabold tracking-[-0.02em]">
                    Próximamente
                  </h2>
                  <p className="mt-3 max-w-xl text-pretty leading-relaxed text-white/65">
                    En este espacio podrás conocer los eventos y actividades especiales de nuestra
                    iglesia. Mientras tanto, te invitamos a reunirte con nosotros cada semana.
                  </p>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <VisitStrip
        schedules={schedules}
        address={info?.address}
        mapUrl={info?.mapUrl}
        scheduleNote={info?.scheduleNote}
      />
    </>
  );
}
