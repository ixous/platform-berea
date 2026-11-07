import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { BereaImage } from "./BereaImage";
import { Reveal } from "./Reveal";
import { EVENT_IMAGES, EVENT_FALLBACK } from "@/lib/public/symbolic-images";
import { formatBereaDate, isEventToday } from "@/lib/public/event-dates";

interface EventRow {
  id: string;
  title: string;
  slug: string;
  startDate: Date;
  time: string | null;
  location: string | null;
  eventType: string | null;
}

const EVENT_POSITIONS: Record<string, string> = {
  "posada-navidena": "!object-[50%_72%]",
  "cross-fest": "!object-center",
  bautizos: "!object-center",
  bautizmos: "!object-center",
  "encuentro-mixto": "!object-[50%_25%]",
  "marcha-por-jesus": "!object-center",
  "noche-mexicana": "!object-center",
};

export function UpcomingEventsSection({ events }: { events: EventRow[] }) {
  if (events.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-site-paper">
      <div className="site-aurora" aria-hidden="true" />
      <div className="site-orb site-orb-blue left-[-120px] top-[-120px]" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-[76rem] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="site-gold-pulse text-xs font-semibold uppercase tracking-[0.22em] text-site-gold">
                Lo que viene
              </p>
              <h2 className="mt-5 font-display text-balance text-[clamp(2.2rem,4.8vw,3.9rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-site-ink">
                Próximos eventos
              </h2>
            </div>
            <Link
              href="/eventos"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-site-ink underline decoration-site-gold/60 decoration-2 underline-offset-4 transition-colors hover:text-site-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-gold"
            >
              Ver todos los eventos
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </Reveal>

        <div
          className={`mt-12 grid gap-5 ${
            events.length === 4
              ? "sm:grid-cols-2 lg:grid-cols-4"
              : events.length === 2
                ? "sm:grid-cols-2"
                : "sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {events.map((event, i) => {
            const imageSrc = EVENT_IMAGES[event.slug] || EVENT_FALLBACK;
            const isPosada = event.slug === "posada-navidena";
            const today = isEventToday(new Date(event.startDate));

            return (
              <Reveal key={event.id} delay={i * 120}>
                <Link
                  href={`/eventos/${event.slug}`}
                  className="site-card-glow group flex h-full flex-col overflow-hidden rounded-2xl border border-site-line bg-white shadow-sm transition-colors hover:border-site-gold/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-gold"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-site-ink">
                    <BereaImage
                      src={imageSrc}
                      alt={event.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className={`transition-transform duration-[1200ms] ease-out group-hover:scale-105 ${
                        EVENT_POSITIONS[event.slug] || "object-center"
                      }`}
                    />
                    <div className="site-sheen" aria-hidden="true" />
                  </div>
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-site-gold">
                      {event.eventType || "Evento"}
                    </p>
                    <h3 className="mt-3 font-display text-xl font-extrabold leading-snug text-site-ink transition-colors group-hover:text-site-gold">
                      {event.title}
                    </h3>
                    <div className="mt-auto pt-6 text-sm text-site-muted">
                      <p className="flex items-center gap-2">
                        <CalendarDays className="h-3.5 w-3.5 text-site-gold" aria-hidden="true" />
                        {isPosada ? (
                          "Fecha por confirmar"
                        ) : today ? (
                          <span className="font-semibold text-emerald-600">
                            ¡Hoy! &middot; {formatBereaDate(new Date(event.startDate))}
                          </span>
                        ) : (
                          formatBereaDate(new Date(event.startDate))
                        )}
                      </p>
                      {event.location && (
                        <p className="mt-2 flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-site-gold" aria-hidden="true" />
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
    </section>
  );
}
