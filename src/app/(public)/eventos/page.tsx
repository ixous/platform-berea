import { db } from "@/lib/db";
import { institutionalPages, events, contact } from "@/lib/db/schema";
import { and, isNull, eq, gte, lt, or, asc, desc } from "drizzle-orm";
import { PageIntro } from "@/components/public/PageIntro";
import { VisitStrip } from "@/components/public/VisitStrip";
import { BereaImage } from "@/components/public/BereaImage";
import { Reveal } from "@/components/public/Reveal";
import { getEntityMediaMap } from "@/lib/db/media-helpers";
import { EVENT_IMAGES, EVENT_FALLBACK } from "@/lib/public/symbolic-images";
import { getBereaStartOfToday, formatBereaDate, isEventToday } from "@/lib/public/event-dates";
import { CalendarDays, Clock, MapPin, Calendar, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
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
  const startOfToday = getBereaStartOfToday();

  return db
    .select()
    .from(events)
    .where(
      and(
        eq(events.status, "published"),
        isNull(events.deletedAt),
        or(
          gte(events.endDate, new Date()),
          and(isNull(events.endDate), gte(events.startDate, startOfToday))
        )
      )
    )
    .orderBy(asc(events.startDate))
    .limit(20);
}

async function getPastEvents() {
  const startOfToday = getBereaStartOfToday();

  return db
    .select()
    .from(events)
    .where(
      and(
        eq(events.status, "published"),
        isNull(events.deletedAt),
        or(
          lt(events.endDate, new Date()),
          and(isNull(events.endDate), lt(events.startDate, startOfToday))
        )
      )
    )
    .orderBy(desc(events.startDate))
    .limit(6);
}

const EVENT_POSITIONS: Record<string, string> = {
  "posada-navidena": "!object-[50%_72%]",
  "cross-fest": "!object-center",
  bautizos: "!object-center",
  bautizmos: "!object-center",
  "encuentro-mixto": "!object-[50%_25%]",
  "marcha-por-jesus": "!object-center",
};

export default async function EventosPage() {
  const [items, pastItems, [info]] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
    db.select().from(contact).limit(1),
  ]);

  const allEventIds = [...items.map((e) => e.id), ...pastItems.map((e) => e.id)];
  const mediaMap = await getEntityMediaMap("event", allEventIds);

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
        backgroundImage={page?.bannerImage || "/images/banner-eventos.png"}
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
                const today = isEventToday(new Date(event.startDate));

                return (
                  <Reveal key={event.id} delay={(i % 3) * 120}>
                    <Link
                      href={`/eventos/${event.slug}`}
                      className="site-card-glow group block overflow-hidden rounded-3xl border border-site-line bg-white transition-colors hover:border-site-gold/50"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden bg-site-ink">
                        <BereaImage
                          src={imageSrc}
                          alt={event.title}
                          fill
                          className={`transition-transform duration-[1200ms] ease-out group-hover:scale-105 ${
                            EVENT_POSITIONS[event.slug] || "object-center"
                          }`}
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
                          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-site-muted">
                            {event.description}
                          </p>
                        )}
                        <div className="mt-5 space-y-2 text-sm text-site-muted">
                          <p className="flex items-center gap-2">
                            <CalendarDays
                              className="h-4 w-4 shrink-0 text-site-gold"
                              aria-hidden="true"
                            />
                            {event.slug === "posada-navidena" ? (
                              "Fecha por confirmar"
                            ) : today ? (
                              <span className="font-semibold text-emerald-600">
                                ¡Hoy! &middot; {formatBereaDate(new Date(event.startDate))}
                              </span>
                            ) : (
                              formatBereaDate(new Date(event.startDate))
                            )}
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
                    </Link>
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
                  <h3 className="mt-6 font-display text-3xl font-extrabold tracking-[-0.02em]">
                    Próximamente
                  </h3>
                  <p className="mt-3 max-w-xl text-pretty leading-relaxed text-white/70">
                    Actualmente nos estamos preparando para nuestras siguientes actividades
                    especiales. Mientras tanto, ¡te esperamos cada semana en nuestras reuniones y
                    células!
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href="/visita"
                      className="inline-flex items-center gap-2 rounded-full bg-site-gold px-5 py-2.5 text-sm font-semibold text-site-ink transition-colors hover:bg-site-gold-soft"
                    >
                      Nuestros horarios de reunión
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/celulas"
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
                    >
                      Encontrar una célula
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          )}

          {pastItems.length > 0 && (
            <div className="mt-24 border-t border-site-line/80 pt-16">
              <Reveal>
                <div className="max-w-2xl">
                  <p className="site-gold-pulse text-xs font-bold uppercase tracking-[0.24em] text-site-gold">
                    Memoria y testimonio
                  </p>
                  <h3 className="mt-4 font-display text-balance text-[clamp(1.8rem,3.6vw,2.8rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-site-ink">
                    Eventos realizados
                  </h3>
                  <p className="mt-3 max-w-xl text-pretty text-base leading-relaxed text-site-muted">
                    Momentos especiales de fe, comunión y bendición que hemos compartido en Centro
                    Cristiano Berea.
                  </p>
                </div>
              </Reveal>

              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pastItems.map((event, i) => {
                  const img = mediaMap.get(event.id);
                  const imageSrc =
                    img?.mediaUrl ||
                    img?.thumbnailUrl ||
                    EVENT_IMAGES[event.slug] ||
                    EVENT_FALLBACK;
                  return (
                    <Reveal key={event.id} delay={(i % 3) * 100}>
                      <Link
                        href={`/eventos/${event.slug}`}
                        className="group block overflow-hidden rounded-3xl border border-site-line bg-white/70 shadow-sm transition-all hover:border-site-gold/40 hover:shadow-md"
                      >
                        <div className="relative aspect-[4/5] overflow-hidden bg-site-ink">
                          <BereaImage
                            src={imageSrc}
                            alt={event.title}
                            fill
                            className={`transition-all duration-[1200ms] ease-out group-hover:scale-105 ${
                              EVENT_POSITIONS[event.slug] || "object-center"
                            }`}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="absolute left-4 top-4 z-10">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0A1428]/85 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm">
                              <CheckCircle2 className="h-3 w-3 text-site-gold" />
                              Realizado
                            </span>
                          </div>
                          <div className="site-sheen" aria-hidden="true" />
                        </div>
                        <div className="p-6">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-site-muted">
                            {event.eventType || "Evento"}
                          </p>
                          <h4 className="mt-2 font-display text-xl font-bold leading-snug text-site-ink transition-colors group-hover:text-site-gold">
                            {event.title}
                          </h4>
                          <div className="mt-4 space-y-1.5 text-xs text-site-muted">
                            <p className="flex items-center gap-2">
                              <CalendarDays className="h-3.5 w-3.5 shrink-0 text-site-gold/70" />
                              {formatBereaDate(new Date(event.startDate))}
                            </p>
                            {event.location && (
                              <p className="flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 shrink-0 text-site-gold/70" />
                                {event.location}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    </Reveal>
                  );
                })}
              </div>
            </div>
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
