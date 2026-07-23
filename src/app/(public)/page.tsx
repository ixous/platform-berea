import { db } from "@/lib/db";
import { events, devotionals, ministries } from "@/lib/db/schema";
import { eq, and, isNull, gte, desc } from "drizzle-orm";
import Link from "next/link";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { ContentBlock, ContentNarrow } from "@/components/public/ContentBlock";
import { EmptySection } from "@/components/public/EmptySection";
import { Card, CardCategory, CardTitle, CardDescription, CardMeta } from "@/components/public/Card";
import { SectionSeparator } from "@/components/public/SectionSeparator";
import { ScrollReveal } from "@/components/public/ScrollReveal";
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
    .limit(3);
}

async function getRecentDevotionals() {
  return db
    .select()
    .from(devotionals)
    .where(and(eq(devotionals.status, "published"), isNull(devotionals.deletedAt)))
    .orderBy(desc(devotionals.publishedAt))
    .limit(3);
}

async function getActiveMinistries() {
  return db
    .select()
    .from(ministries)
    .where(and(eq(ministries.status, "active"), isNull(ministries.deletedAt)))
    .orderBy(ministries.displayOrder)
    .limit(4);
}

export default async function HomePage() {
  const [upcomingEvents, recentDevotionals, activeMinistries] = await Promise.all([
    getUpcomingEvents(),
    getRecentDevotionals(),
    getActiveMinistries(),
  ]);

  return (
    <>
      <HeroSection
        tagline="BIENVENIDOS"
        title="Centro Cristiano Berea"
        subtitle="Un lugar para conocer a Cristo, crecer en Su Palabra y servir con propósito."
        ctaText="Conócenos"
        ctaHref="/quienes-somos"
        secondaryCtaText="Horarios de Servicio"
        secondaryCtaHref="/contacto"
        backgroundImage="/images/banner-berea.png"
      />

      <ContentBlock variant="gold-mist">
        <ScrollReveal animation="fade-up">
          <ContentNarrow className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-berea-border/40 bg-white shadow-sm">
              <Heart className="h-10 w-10 text-berea-gold" />
            </div>
            <h2 className="mt-8 text-balance text-3xl font-bold tracking-tight text-berea-navy sm:text-4xl lg:text-5xl">
              Una familia que vive para Cristo
            </h2>
            <p className="mx-auto mt-8 max-w-3xl text-pretty text-lg leading-relaxed text-berea-muted">
              En Centro Cristiano Berea creemos que cada persona puede encontrar esperanza,
              propósito y una familia espiritual en Cristo. Nuestra misión es enseñar fielmente la
              Palabra de Dios, formar discípulos y servir a nuestra comunidad con amor.
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Link
                href="/quienes-somos"
                className="group inline-flex items-center gap-2 rounded-xl bg-berea-navy px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Users className="h-4 w-4" />
                Quienes Somos
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/contacto"
                className="group inline-flex items-center gap-2 rounded-xl border border-berea-border bg-white px-7 py-3.5 text-sm font-semibold text-berea-navy shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <MapPin className="h-4 w-4" />
                Ubicación y contacto
              </Link>
            </div>
          </ContentNarrow>
        </ScrollReveal>
      </ContentBlock>

      <SectionSeparator variant="wave-gold" />

      <ContentBlock variant="warm">
        <ScrollReveal animation="stagger" staggerItems delay={100}>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Sparkles,
                title: "Servicios",
                desc: "Domingo 11:00 AM · Miércoles Escuela de Líderes 8:00 PM · Jueves Escuela de Ministerios 8:00 PM",
              },
              {
                icon: CalendarDays,
                title: "Eventos",
                desc: "Conferencias, congresos y actividades especiales para toda la familia.",
              },
              {
                icon: BookOpen,
                title: "Devocionales",
                desc: "Reflexiones bíblicas semanales para tu crecimiento espiritual.",
              },
              {
                icon: Church,
                title: "Ministerios",
                desc: "Encuentra tu lugar para servir y crecer en la fe junto a otros.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-berea-border/60 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-berea-gold/10 to-berea-gold/5">
                  <item.icon className="h-8 w-8 text-berea-gold" />
                </div>
                <h3 className="mt-6 text-lg font-bold text-berea-navy">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-berea-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </ContentBlock>

      <SectionSeparator variant="curve-gold" />

      {upcomingEvents.length > 0 ? (
        <ContentBlock variant="light">
          <ScrollReveal animation="fade-up">
            <SectionHeading
              title="Próximos Eventos"
              subtitle="Mantente al día con nuestras actividades y servicios especiales."
            />
          </ScrollReveal>
          <ScrollReveal animation="stagger" staggerItems delay={150} className="mt-16">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => (
                <Card key={event.id} href={`/eventos/${event.slug}`}>
                  <CardCategory>{event.eventType || "Evento"}</CardCategory>
                  <CardTitle>{event.title}</CardTitle>
                  <CardMeta>
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
                  </CardMeta>
                  {event.location && (
                    <p className="mt-2 text-xs text-berea-muted">{event.location}</p>
                  )}
                </Card>
              ))}
            </div>
          </ScrollReveal>
        </ContentBlock>
      ) : (
        <EmptySection
          title="Próximos Eventos"
          message="Próximamente podrás consultar aquí los eventos y actividades de la iglesia."
          icon={CalendarDays}
        />
      )}

      <SectionSeparator variant="wave" />

      {activeMinistries.length > 0 ? (
        <ContentBlock variant="gold-mist">
          <ScrollReveal animation="fade-up">
            <SectionHeading
              title="Ministerios"
              subtitle="Descubre las diferentes áreas donde puedes servir y crecer."
            />
          </ScrollReveal>
          <ScrollReveal animation="stagger" staggerItems delay={150} className="mt-16">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {activeMinistries.map((m) => (
                <Card key={m.id} href="/ministerios-activos">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-berea-gold/10 to-berea-gold/5">
                    <Church className="h-7 w-7 text-berea-gold/70" />
                  </div>
                  <CardTitle className="text-center">{m.name}</CardTitle>
                  {m.description && (
                    <CardDescription className="text-center">{m.description}</CardDescription>
                  )}
                </Card>
              ))}
            </div>
          </ScrollReveal>
        </ContentBlock>
      ) : (
        <EmptySection
          title="Ministerios"
          message="Próximamente podrás consultar aquí los ministerios activos de la iglesia."
          icon={Church}
          variant="navy"
        />
      )}

      <SectionSeparator variant="curve" />

      {recentDevotionals.length > 0 ? (
        <ContentBlock variant="warm">
          <ScrollReveal animation="fade-up">
            <SectionHeading
              title="Devocionales"
              subtitle="Reflexiones bíblicas para edificar tu vida espiritual."
            />
          </ScrollReveal>
          <ScrollReveal animation="stagger" staggerItems delay={150} className="mt-16">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {recentDevotionals.map((d) => (
                <Card key={d.id} href={`/devocionales/${d.slug}`}>
                  <CardCategory>Devocional</CardCategory>
                  <CardTitle>{d.title}</CardTitle>
                  {d.excerpt && <CardDescription>{d.excerpt}</CardDescription>}
                  {d.verse && (
                    <p className="mt-4 text-xs italic text-berea-gold/70 line-clamp-2">{d.verse}</p>
                  )}
                </Card>
              ))}
            </div>
          </ScrollReveal>
        </ContentBlock>
      ) : (
        <EmptySection
          title="Devocionales"
          message="Próximamente publicaremos devocionales para tu crecimiento espiritual."
          icon={BookOpen}
        />
      )}

      <section className="relative overflow-hidden bg-section-navy-warm">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,162,39,0.06),transparent_50%)]" />
        </div>
        <ContentBlock className="relative">
          <ScrollReveal animation="fade-up">
            <ContentNarrow className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-lg">
                <Heart className="h-10 w-10 text-berea-gold" />
              </div>
              <h2 className="mt-8 text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Visítanos
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/70">
                Nos encantaría recibirte en nuestra iglesia. Ven tal como eres y descubre una
                comunidad que te amará y te apoyará en tu caminar con Cristo.
              </p>
              <div className="mt-12 flex flex-wrap justify-center gap-4">
                <Link
                  href="/contacto"
                  className="group inline-flex items-center gap-2 rounded-xl bg-berea-gold px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-berea-gold/25 transition-all duration-300 hover:bg-berea-gold/90 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <MapPin className="h-4 w-4" />
                  Ubicación y horarios
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </ContentNarrow>
          </ScrollReveal>
        </ContentBlock>
      </section>
    </>
  );
}
