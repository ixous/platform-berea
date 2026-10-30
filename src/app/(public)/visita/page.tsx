import { db } from "@/lib/db";
import { contact } from "@/lib/db/schema";
import Link from "next/link";
import { PageIntro } from "@/components/public/PageIntro";
import { Clock, MapPin, Phone, MessageCircle, ArrowRight } from "lucide-react";
import { FALLBACK_CONTACT, VISIT_INTRO } from "@/lib/public/site-navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visítanos",
  description:
    "Horarios, ubicación y lo que necesitas para tu primera visita a Centro Cristiano Berea en Mexicali, Baja California.",
  openGraph: {
    title: "Visítanos | Centro Cristiano Berea",
    description:
      "Horarios, ubicación y lo que necesitas para tu primera visita a Centro Cristiano Berea.",
  },
};

type ScheduleItem = { day?: string; time?: string } | null;

export default async function VisitaPage() {
  const [info] = await db.select().from(contact).limit(1);

  const schedules = (info?.schedules as ScheduleItem[] | null) ?? FALLBACK_CONTACT.schedules;
  const address = info?.address || FALLBACK_CONTACT.address;
  const phone = info?.phone || FALLBACK_CONTACT.phone;
  const mapUrl = info?.mapUrl || FALLBACK_CONTACT.mapUrl;
  const whatsapp = info?.whatsapp || FALLBACK_CONTACT.whatsapp;
  const scheduleNote = info?.scheduleNote || FALLBACK_CONTACT.scheduleNote;

  return (
    <>
      <PageIntro title={VISIT_INTRO.title} subtitle={VISIT_INTRO.subtitle} />

      <section className="bg-site-cream">
        <div className="mx-auto w-full max-w-[76rem] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-6 sm:grid-cols-3">
            {schedules.map((s) => (
              <div
                key={`${s?.day ?? "reunion"}-${s?.time ?? ""}`}
                className="rounded-2xl border border-site-line bg-site-paper p-7"
              >
                <Clock className="h-5 w-5 text-site-gold" aria-hidden="true" />
                <p className="mt-4 font-display text-xl font-medium text-site-ink">
                  {s?.day || "Reunión"}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-site-muted">
                  {s?.time || "Horario por confirmar"}
                </p>
              </div>
            ))}
          </div>
          {scheduleNote && <p className="mt-6 text-sm italic text-site-muted">{scheduleNote}</p>}

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-site-line bg-site-paper p-8">
              <h2 className="font-display text-2xl font-medium text-site-ink">Dónde estamos</h2>
              <div className="mt-6 space-y-5 text-site-muted">
                <p className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-site-gold" aria-hidden="true" />
                  <span className="break-words">{address}</span>
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="h-5 w-5 shrink-0 text-site-gold" aria-hidden="true" />
                  <a
                    href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                    className="transition-colors hover:text-site-ink"
                  >
                    {phone}
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 shrink-0 text-site-gold" aria-hidden="true" />
                  <a
                    href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-site-ink"
                  >
                    {whatsapp}
                  </a>
                </p>
              </div>
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-site-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-site-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-gold"
              >
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Abrir en Google Maps
              </a>
            </div>

            <div className="rounded-2xl bg-site-ink p-8 text-white">
              <h2 className="font-display text-2xl font-medium">Antes de venir</h2>
              <ul className="mt-6 space-y-4">
                {VISIT_INTRO.whatToExpect.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/80">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-site-gold"
                      aria-hidden="true"
                    />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs italic text-white/45">
                Contenido propuesto del prototipo, pendiente de validación.
              </p>
              <Link
                href="/contacto"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-site-gold px-6 py-3 text-sm font-semibold text-site-ink transition-colors hover:bg-site-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-gold"
              >
                ¿Tienes dudas? Escríbenos
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
