import { db } from "@/lib/db";
import {
  events,
  devotionals,
  ministries,
  homepageSettings,
  homepageServices,
  homepageSections,
} from "@/lib/db/schema";
import { eq, and, isNull, gte, asc } from "drizzle-orm";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { ContentBlock, ContentNarrow } from "@/components/public/ContentBlock";
import { MediaCard } from "@/components/public/MediaCard";
import { SectionSeparator } from "@/components/public/SectionSeparator";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { MINISTRY_IMAGES } from "@/lib/public/symbolic-images";
import {
  ArrowRight,
  CalendarDays,
  BookOpen,
  Church,
  Clock,
  Heart,
  Users,
  MapPin,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "Sitio web oficial de Centro Cristiano Berea. Una iglesia comprometida con la Palabra de Dios, ubicada en Mexicali, Baja California, México.",
  openGraph: {
    title: "Centro Cristiano Berea | Mexicali, Baja California",
    description:
      "Sitio web oficial de Centro Cristiano Berea. Una iglesia comprometida con la Palabra de Dios.",
  },
};

async function getHomepageData() {
  const [settings] = await db.select().from(homepageSettings).limit(1);

  const sections = await db
    .select()
    .from(homepageSections)
    .where(eq(homepageSections.visible, true))
    .orderBy(asc(homepageSections.displayOrder));

  const services = await db
    .select()
    .from(homepageServices)
    .where(and(eq(homepageServices.status, "published"), isNull(homepageServices.deletedAt)))
    .orderBy(asc(homepageServices.displayOrder));

  const featuredEvents = await db
    .select()
    .from(events)
    .where(
      and(
        eq(events.status, "published"),
        eq(events.featured, true),
        isNull(events.deletedAt),
        gte(events.startDate, new Date())
      )
    )
    .orderBy(asc(events.featuredOrder))
    .limit(6);

  const featuredMinistries = await db
    .select()
    .from(ministries)
    .where(
      and(
        eq(ministries.status, "active"),
        eq(ministries.featured, true),
        isNull(ministries.deletedAt)
      )
    )
    .orderBy(asc(ministries.featuredOrder))
    .limit(6);

  const featuredDevotionals = await db
    .select()
    .from(devotionals)
    .where(
      and(
        eq(devotionals.status, "published"),
        eq(devotionals.featured, true),
        isNull(devotionals.deletedAt)
      )
    )
    .orderBy(asc(devotionals.featuredOrder))
    .limit(6);

  return { settings, sections, services, featuredEvents, featuredMinistries, featuredDevotionals };
}

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  CalendarDays,
  BookOpen,
  Church,
};

export default async function HomePage() {
  const { settings, sections, services, featuredEvents, featuredMinistries, featuredDevotionals } =
    await getHomepageData();

  const sectionVisible = (key: string) => sections.some((s) => s.sectionKey === key);

  return (
    <>
      <HeroSection
        tagline={settings?.heroTagline || "BIENVENIDOS"}
        title={settings?.heroTitle || "Centro Cristiano Berea"}
        subtitle={
          settings?.heroSubtitle ||
          "Un lugar para conocer a Cristo, crecer en Su Palabra y servir con propósito."
        }
        ctaText={settings?.heroCtaText || "Conócenos"}
        ctaHref={settings?.heroCtaHref || "/quienes-somos"}
        secondaryCtaText={settings?.heroSecondaryCtaText || "Horarios de Servicio"}
        secondaryCtaHref={settings?.heroSecondaryCtaHref || "/contacto"}
        backgroundImage={settings?.heroBackgroundImage || "/images/banner-berea.png"}
      />

      {sectionVisible("welcome") && (
        <ContentBlock variant="gold-mist">
          <ScrollReveal animation="fade-up">
            <ContentNarrow className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-berea-border/40 bg-white shadow-sm">
                <Heart className="h-10 w-10 text-berea-gold" />
              </div>
              <h2 className="mt-8 text-balance text-3xl font-bold tracking-tight text-berea-navy sm:text-4xl lg:text-5xl">
                {settings?.welcomeTitle || "Una familia que vive para Cristo"}
              </h2>
              <p className="mx-auto mt-8 max-w-3xl text-pretty text-lg leading-relaxed text-berea-muted">
                {settings?.welcomeDescription ||
                  "En Centro Cristiano Berea creemos que cada persona puede encontrar esperanza, propósito y una familia espiritual en Cristo."}
              </p>
              <div className="mt-12 flex flex-wrap justify-center gap-4">
                {settings?.welcomeCtaText && settings?.welcomeCtaHref ? (
                  <Link
                    href={settings.welcomeCtaHref}
                    className="group inline-flex items-center gap-2 rounded-xl bg-berea-navy px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <Users className="h-4 w-4" />
                    {settings.welcomeCtaText}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                ) : (
                  <Link
                    href="/quienes-somos"
                    className="group inline-flex items-center gap-2 rounded-xl bg-berea-navy px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <Users className="h-4 w-4" />
                    Quienes Somos
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                )}
                {settings?.welcomeCtaSecondaryText && settings?.welcomeCtaSecondaryHref ? (
                  <Link
                    href={settings.welcomeCtaSecondaryHref}
                    className="group inline-flex items-center gap-2 rounded-xl border border-berea-border bg-white px-7 py-3.5 text-sm font-semibold text-berea-navy shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <MapPin className="h-4 w-4" />
                    {settings.welcomeCtaSecondaryText}
                  </Link>
                ) : (
                  <Link
                    href="/contacto"
                    className="group inline-flex items-center gap-2 rounded-xl border border-berea-border bg-white px-7 py-3.5 text-sm font-semibold text-berea-navy shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <MapPin className="h-4 w-4" />
                    Ubicación y contacto
                  </Link>
                )}
              </div>
            </ContentNarrow>
          </ScrollReveal>
        </ContentBlock>
      )}

      {sectionVisible("services") && services.length > 0 && (
        <>
          <SectionSeparator variant="wave-gold" />
          <ContentBlock variant="warm">
            <ScrollReveal animation="stagger" staggerItems delay={100}>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {services.map((svc) => (
                  <MediaCard
                    key={svc.id}
                    variant="icon"
                    icon={iconMap[svc.icon ?? ""] || Sparkles}
                    title={svc.title}
                    description={
                      svc.description ||
                      (svc.day && svc.time ? `${svc.day} ${svc.time}` : undefined)
                    }
                  >
                    {svc.day && svc.time && (
                      <p className="mt-8 text-xs text-berea-muted">
                        {svc.day} &middot; {svc.time}
                      </p>
                    )}
                  </MediaCard>
                ))}
              </div>
            </ScrollReveal>
          </ContentBlock>
        </>
      )}

      {sectionVisible("events") && featuredEvents.length > 0 && (
        <>
          <SectionSeparator variant="curve-gold" />
          <ContentBlock variant="light">
            <ScrollReveal animation="fade-up">
              <SectionHeading
                title={sections.find((s) => s.sectionKey === "events")?.title || "Próximos Eventos"}
                subtitle={
                  sections.find((s) => s.sectionKey === "events")?.subtitle ||
                  "Mantente al día con nuestras actividades."
                }
              />
            </ScrollReveal>
            <ScrollReveal animation="stagger" staggerItems delay={150} className="mt-16">
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {featuredEvents.map((event) => (
                  <MediaCard
                    key={event.id}
                    variant="minimal"
                    title={event.title}
                    category={event.eventType || "Evento"}
                    href={`/eventos/${event.slug}`}
                    meta={
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 text-berea-gold" />
                          {new Date(event.startDate).toLocaleDateString("es-MX", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        {event.time && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-berea-gold" />
                            {event.time}
                          </span>
                        )}
                      </div>
                    }
                  >
                    {event.location && <p className="text-xs text-berea-muted">{event.location}</p>}
                  </MediaCard>
                ))}
              </div>
            </ScrollReveal>
          </ContentBlock>
        </>
      )}

      {sectionVisible("ministries") && featuredMinistries.length > 0 && (
        <>
          <SectionSeparator variant="wave" />
          <ContentBlock variant="gold-mist">
            <ScrollReveal animation="fade-up">
              <SectionHeading
                title={sections.find((s) => s.sectionKey === "ministries")?.title || "Ministerios"}
                subtitle={
                  sections.find((s) => s.sectionKey === "ministries")?.subtitle ||
                  "Descubre las diferentes áreas donde puedes servir."
                }
              />
            </ScrollReveal>
            <ScrollReveal animation="stagger" staggerItems delay={150} className="mt-16">
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {featuredMinistries.map((m) => (
                  <MediaCard
                    key={m.id}
                    variant="icon"
                    icon={Church}
                    title={m.name}
                    description={m.description}
                    imageUrl={MINISTRY_IMAGES[m.slug]}
                    imageAlt={m.name}
                    href="/ministerios-activos"
                  />
                ))}
              </div>
            </ScrollReveal>
          </ContentBlock>
        </>
      )}

      {sectionVisible("devotionals") && featuredDevotionals.length > 0 && (
        <>
          <SectionSeparator variant="curve" />
          <ContentBlock variant="warm">
            <ScrollReveal animation="fade-up">
              <SectionHeading
                title={
                  sections.find((s) => s.sectionKey === "devotionals")?.title || "Devocionales"
                }
                subtitle={
                  sections.find((s) => s.sectionKey === "devotionals")?.subtitle ||
                  "Reflexiones bíblicas para edificar tu vida espiritual."
                }
              />
            </ScrollReveal>
            <ScrollReveal animation="stagger" staggerItems delay={150} className="mt-16">
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {featuredDevotionals.map((d) => (
                  <MediaCard
                    key={d.id}
                    variant="minimal"
                    title={d.title}
                    category="Devocional"
                    description={d.excerpt}
                    href={`/devocionales/${d.slug}`}
                  >
                    {d.verse && (
                      <p className="mt-4 text-xs italic text-berea-gold/70 line-clamp-2">
                        {d.verse}
                      </p>
                    )}
                  </MediaCard>
                ))}
              </div>
            </ScrollReveal>
          </ContentBlock>
        </>
      )}

      {sectionVisible("cta") && (
        <section className="relative overflow-hidden bg-section-navy-warm">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.15),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,162,39,0.06),transparent_50%)]" />
          </div>
          <ContentBlock variant="navy-warm" className="relative">
            <ScrollReveal animation="fade-up">
              <ContentNarrow className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-lg">
                  <Heart className="h-10 w-10 text-berea-gold" />
                </div>
                <h2 className="mt-8 text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {settings?.ctaTitle || "Visítanos"}
                </h2>
                <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/70">
                  {settings?.ctaDescription ||
                    "Nos encantaría recibirte en nuestra iglesia. Ven tal como eres y descubre una comunidad que te amará y te apoyará en tu caminar con Cristo."}
                </p>
                <div className="mt-12 flex flex-wrap justify-center gap-4">
                  {settings?.ctaButtonText && settings?.ctaButtonHref ? (
                    <Link
                      href={settings.ctaButtonHref}
                      className="group inline-flex items-center gap-2 rounded-xl bg-berea-gold px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-berea-gold/25 transition-all duration-300 hover:bg-berea-gold/90 hover:-translate-y-0.5 hover:shadow-xl"
                    >
                      <MapPin className="h-4 w-4" />
                      {settings.ctaButtonText}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </Link>
                  ) : (
                    <Link
                      href="/contacto"
                      className="group inline-flex items-center gap-2 rounded-xl bg-berea-gold px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-berea-gold/25 transition-all duration-300 hover:bg-berea-gold/90 hover:-translate-y-0.5 hover:shadow-xl"
                    >
                      <MapPin className="h-4 w-4" />
                      Ubicación y horarios
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </Link>
                  )}
                </div>
              </ContentNarrow>
            </ScrollReveal>
          </ContentBlock>
        </section>
      )}
    </>
  );
}
