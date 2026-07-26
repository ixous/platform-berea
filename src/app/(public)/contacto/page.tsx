import { db } from "@/lib/db";
import { contact, institutionalPages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock } from "@/components/public/ContentBlock";
import { ContactForm } from "@/components/public/ContactForm";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { EmptySection } from "@/components/public/EmptySection";
import { MapPin, Clock, Phone, Mail, Globe, Camera, Music, Video } from "lucide-react";
import type { Metadata } from "next";

const socialIcons: Record<string, typeof Globe> = {
  facebook: Globe,
  instagram: Camera,
  youtube: Video,
  tiktok: Music,
  spotify: Music,
  website: Globe,
};

function SocialIcon({ platform }: { platform: string }) {
  const Icon = socialIcons[platform] || Globe;
  return <Icon className="h-4 w-4" />;
}

export async function generateMetadata(): Promise<Metadata> {
  const [page] = await db
    .select()
    .from(institutionalPages)
    .where(eq(institutionalPages.slug, "contacto"))
    .limit(1);
  if (!page) return { title: "Contacto" };
  return {
    title: page.metaTitle || "Contacto",
    description:
      page.metaDescription ||
      "Contáctanos. Información de contacto, ubicación y horarios de Centro Cristiano Berea.",
    openGraph: {
      title: page.metaTitle
        ? `${page.metaTitle} | Centro Cristiano Berea`
        : "Contacto | Centro Cristiano Berea",
      description:
        page.metaDescription || "Contáctanos. Información de contacto, ubicación y horarios.",
    },
  };
}

export default async function ContactoPage() {
  const [page] = await db
    .select()
    .from(institutionalPages)
    .where(eq(institutionalPages.slug, "contacto"))
    .limit(1);

  const [info] = await db.select().from(contact).limit(1);

  if (!page || !page.published) {
    return <EmptySection title="Contacto" message="Información de contacto no disponible." />;
  }

  const schedules = (info?.schedules as { day?: string; time?: string }[] | null) ?? [];
  const socialMedia =
    (info?.socialMedia as { platform?: string; url?: string; label?: string }[] | null) ?? [];
  // coordinates available as info?.coordinates if needed for map

  return (
    <>
      <PageBanner
        title={page.bannerTitle || "Contacto"}
        subtitle={page.bannerSubtitle || "Nos encantaría saber de ti."}
        backgroundImage={page.bannerImage || "/images/banner-contacto.png"}
      />

      <ContentBlock variant="warm">
        <ScrollReveal animation="fade-up">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-16 lg:grid-cols-2">
              <div>
                <h2 className="text-balance text-3xl font-bold tracking-tight text-berea-navy sm:text-4xl">
                  {info?.churchName || "Información de contacto"}
                </h2>
                <div className="mt-4 h-1 w-10 rounded-full bg-berea-gold" />

                <div className="mt-8 space-y-6">
                  {info?.address && (
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-berea-navy/5">
                        <MapPin className="h-5 w-5 text-berea-gold" />
                      </div>
                      <div>
                        <p className="font-semibold text-berea-navy">Dirección</p>
                        <p className="mt-0.5 text-sm text-berea-muted">{info.address}</p>
                      </div>
                    </div>
                  )}
                  {info?.phone && (
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-berea-navy/5">
                        <Phone className="h-5 w-5 text-berea-gold" />
                      </div>
                      <div>
                        <p className="font-semibold text-berea-navy">Teléfono</p>
                        <p className="mt-0.5 text-sm text-berea-muted">{info.phone}</p>
                      </div>
                    </div>
                  )}
                  {info?.email && (
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-berea-navy/5">
                        <Mail className="h-5 w-5 text-berea-gold" />
                      </div>
                      <div>
                        <p className="font-semibold text-berea-navy">Correo electrónico</p>
                        <p className="mt-0.5 text-sm text-berea-muted">{info.email}</p>
                      </div>
                    </div>
                  )}
                  {info?.whatsapp && (
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-berea-navy/5">
                        <svg
                          className="h-5 w-5 text-berea-gold"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-berea-navy">WhatsApp</p>
                        <a
                          href={`https://wa.me/${info.whatsapp.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-0.5 text-sm text-berea-gold transition-colors hover:text-berea-gold/80"
                        >
                          {info.whatsapp}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {socialMedia.length > 0 && (
                  <div className="mt-10">
                    <h3 className="text-lg font-bold text-berea-navy">Síguenos</h3>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {socialMedia.map((s, i) =>
                        s.url ? (
                          <a
                            key={i}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border border-berea-border bg-white px-4 py-2 text-sm text-berea-muted transition-all hover:border-berea-gold/30 hover:text-berea-gold hover:shadow-sm"
                          >
                            <SocialIcon platform={s.platform || ""} />
                            {s.label || s.platform}
                          </a>
                        ) : null
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-balance text-3xl font-bold tracking-tight text-berea-navy sm:text-4xl">
                  Horarios
                </h2>
                <div className="mt-4 h-1 w-10 rounded-full bg-berea-gold" />

                {schedules.length > 0 ? (
                  <div className="mt-8 space-y-4">
                    {schedules.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 rounded-xl border border-berea-border bg-white p-5 transition-shadow hover:shadow-md"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-berea-navy/5">
                          <Clock className="h-5 w-5 text-berea-gold" />
                        </div>
                        <div>
                          <p className="font-semibold text-berea-navy">{h.day}</p>
                          <p className="text-sm text-berea-muted">{h.time}</p>
                        </div>
                      </div>
                    ))}
                    {info?.scheduleNote && (
                      <p className="text-xs italic text-berea-muted">{info.scheduleNote}</p>
                    )}
                  </div>
                ) : (
                  <p className="mt-8 text-sm text-berea-muted">Horarios no disponibles.</p>
                )}

                {info?.mapUrl && (
                  <div className="mt-8">
                    <a
                      href={info.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-berea-navy px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    >
                      <MapPin className="h-4 w-4" />
                      Ver en Google Maps
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div
              className="mt-20 rounded-2xl border border-berea-border bg-white p-10 shadow-sm"
              id="contact-form"
            >
              <h2 className="text-2xl font-bold tracking-tight text-berea-navy">
                {info?.ctaTitle || "Envíanos un mensaje"}
              </h2>
              {info?.ctaDescription && (
                <p className="mt-2 text-sm text-berea-muted">{info.ctaDescription}</p>
              )}
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </ContentBlock>
    </>
  );
}
