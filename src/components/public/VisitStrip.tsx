import { Clock, MapPin, ArrowUpRight } from "lucide-react";
import { FALLBACK_CONTACT } from "@/lib/public/site-navigation";
import { Reveal } from "./Reveal";

interface ScheduleItem {
  day?: string;
  time?: string;
}

interface VisitStripProps {
  schedules?: ScheduleItem[] | null;
  address?: string | null;
  mapUrl?: string | null;
  scheduleNote?: string | null;
}

export function VisitStrip({ schedules, address, mapUrl, scheduleNote }: VisitStripProps) {
  const items: ScheduleItem[] =
    Array.isArray(schedules) && schedules.length > 0
      ? schedules
      : FALLBACK_CONTACT.schedules;
  const resolvedAddress = address || FALLBACK_CONTACT.address;
  const resolvedMap = mapUrl || FALLBACK_CONTACT.mapUrl;
  const resolvedNote = scheduleNote || FALLBACK_CONTACT.scheduleNote;

  return (
    <section className="relative overflow-hidden bg-site-cream">
      <div className="site-aurora" aria-hidden="true" />
      <div className="site-orb left-[-120px] top-[-80px]" aria-hidden="true" />
      <div className="site-orb site-orb-blue bottom-[-140px] right-[-100px]" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-[76rem] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-site-gold">
            Horarios y ubicación
          </p>
          <h2 className="mt-4 font-display text-balance text-[clamp(1.9rem,4vw,3rem)] font-medium leading-tight tracking-[-0.02em] text-site-ink">
            Nos reunimos cada semana
          </h2>
        </Reveal>

        <div className="relative mt-12 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <Reveal delay={120}>
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((s) => (
                <div
                  key={`${s.day ?? "dia"}-${s.time ?? ""}`}
                  className="site-card-glow rounded-2xl border border-site-line bg-site-paper p-6 shadow-sm"
                >
                  <Clock className="h-5 w-5 text-site-gold" aria-hidden="true" />
                  <p className="mt-4 font-display text-xl font-medium text-site-ink">
                    {s.day || "Reunión"}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-site-muted">
                    {s.time || "Horario por confirmar"}
                  </p>
                </div>
              ))}
              <div className="site-card-glow rounded-2xl border border-site-line bg-site-paper p-6 shadow-sm">
                <p className="font-display text-xl font-medium text-site-ink">Ubicación</p>
                <p className="mt-1.5 text-sm leading-relaxed text-site-muted">{resolvedAddress}</p>
                <a
                  href={resolvedMap}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-site-ink underline decoration-site-gold/60 decoration-2 underline-offset-4 transition-colors hover:text-site-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-gold"
                >
                  <MapPin className="h-4 w-4 text-site-gold" aria-hidden="true" />
                  Cómo llegar
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={220}>
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-site-ink p-8 text-white sm:p-10">
              <div className="site-aurora-ink" aria-hidden="true" />
              <div className="site-orb right-[-120px] top-[-100px]" aria-hidden="true" />
              <div className="relative">
                <p className="site-gold-pulse text-xs font-semibold uppercase tracking-[0.22em] text-site-gold">
                  Para tu primera visita
                </p>
                <p className="mt-5 text-pretty text-lg leading-relaxed text-white/85">
                  Nos encantaría recibirte en nuestra iglesia. Ven tal como eres y descubre una
                  comunidad que te amará y te apoyará en tu caminar con Cristo.
                </p>
                {resolvedNote && (
                  <p className="mt-4 text-sm italic text-white/55">{resolvedNote}</p>
                )}
              </div>
              <a
                href="/visita"
                className="relative mt-8 inline-flex w-fit items-center gap-2 overflow-hidden rounded-full bg-site-gold px-6 py-3 text-sm font-semibold text-site-ink transition-colors hover:bg-site-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-gold"
              >
                <span className="site-sheen" aria-hidden="true" />
                <span className="relative z-10">Planea tu visita</span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
