import { db } from "@/lib/db";
import { events, devotionals, ministries } from "@/lib/db/schema";
import { eq, and, isNull, gte, desc } from "drizzle-orm";
import Link from "next/link";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { ContentBlock } from "@/components/public/ContentBlock";
import { EmptySection } from "@/components/public/EmptySection";
import { Card, CardCategory, CardTitle, CardDescription, CardMeta } from "@/components/public/Card";
import { ArrowRight, CalendarDays, BookOpen, Church, Clock, Heart } from "lucide-react";
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
        backgroundImage="/images/banner_berea.png"
      />

      <ContentBlock>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-berea-gold">
            Bienvenidos
          </p>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-berea-navy sm:text-4xl">
            Una familia que vive para Cristo
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-berea-muted">
            En Centro Cristiano Berea creemos que cada persona puede encontrar esperanza, propósito
            y una familia espiritual en Cristo. Nuestra misión es enseñar fielmente la Palabra de
            Dios, formar discípulos y servir a nuestra comunidad con amor.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/quienes-somos"
              className="inline-flex items-center gap-2 rounded-lg bg-berea-navy px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Quienes Somos
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 rounded-lg border border-berea-border bg-white px-6 py-3 text-sm font-semibold text-berea-navy shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              Ubicación y contacto
            </Link>
          </div>
        </div>
      </ContentBlock>

      <section className="border-y border-berea-border bg-white">
        <ContentBlock>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Church,
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
                icon: Clock,
                title: "Ministerios",
                desc: "Encuentra tu lugar para servir y crecer en la fe junto a otros.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center animate-fade-up">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-berea-navy/5">
                  <item.icon className="h-7 w-7 text-berea-gold" />
                </div>
                <h3 className="mt-4 text-base font-bold text-berea-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-berea-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </ContentBlock>
      </section>

      <ContentBlock>
        <SectionHeading
          title="Próximos Eventos"
          subtitle="Mantente al día con nuestras actividades y servicios especiales."
        />
        {upcomingEvents.length > 0 ? (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event, i) => (
              <Card
                key={event.id}
                href={`/eventos/${event.slug}`}
                className={`animate-fade-up animation-delay-${Math.min((i + 1) * 100, 950)}`}
              >
                <CardCategory>{event.eventType || "Evento"}</CardCategory>
                <CardTitle>{event.title}</CardTitle>
                <CardMeta>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5 text-berea-gold" />
                    {new Date(event.startDate).toLocaleDateString("es-MX", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  {event.time && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-berea-gold" />
                      {event.time}
                    </span>
                  )}
                </CardMeta>
                {event.location && (
                  <p className="mt-1 text-xs text-berea-muted">{event.location}</p>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <EmptySection
            title="Próximos Eventos"
            message="Próximamente podrás consultar aquí los eventos y actividades de la iglesia."
            icon={CalendarDays}
          />
        )}
      </ContentBlock>

      <section className="bg-white">
        <ContentBlock>
          <SectionHeading
            title="Ministerios"
            subtitle="Descubre las diferentes áreas donde puedes servir y crecer."
          />
          {activeMinistries.length > 0 ? (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {activeMinistries.map((m, i) => (
                <Card
                  key={m.id}
                  href="/ministerios-activos"
                  className={`animate-fade-up animation-delay-${Math.min((i + 1) * 100, 950)}`}
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-berea-navy/5">
                    <Church className="h-6 w-6 text-berea-gold/60" />
                  </div>
                  <CardTitle className="text-center">{m.name}</CardTitle>
                  {m.description && (
                    <CardDescription className="text-center">{m.description}</CardDescription>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <EmptySection
              title="Ministerios"
              message="Próximamente podrás consultar aquí los ministerios activos de la iglesia."
              icon={Church}
            />
          )}
        </ContentBlock>
      </section>

      <ContentBlock>
        <SectionHeading
          title="Devocionales"
          subtitle="Reflexiones bíblicas para edificar tu vida espiritual."
        />
        {recentDevotionals.length > 0 ? (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {recentDevotionals.map((d, i) => (
              <Card
                key={d.id}
                href={`/devocionales/${d.slug}`}
                className={`animate-fade-up animation-delay-${Math.min((i + 1) * 100, 950)}`}
              >
                <CardCategory>Devocional</CardCategory>
                <CardTitle>{d.title}</CardTitle>
                {d.excerpt && <CardDescription>{d.excerpt}</CardDescription>}
                {d.verse && (
                  <p className="mt-3 text-xs italic text-berea-gold/70 line-clamp-2">{d.verse}</p>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <EmptySection
            title="Devocionales"
            message="Próximamente publicaremos devocionales para tu crecimiento espiritual."
            icon={BookOpen}
          />
        )}
      </ContentBlock>

      <section className="relative overflow-hidden bg-berea-navy">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
        <ContentBlock className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
              <Heart className="h-8 w-8 text-berea-gold" />
            </div>
            <h2 className="mt-6 text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Visítanos
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-lg text-white/70">
              Nos encantaría recibirte en nuestra iglesia. Ven tal como eres y descubre una
              comunidad que te amará y te apoyará en tu caminar con Cristo.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 rounded-lg bg-berea-gold px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-berea-gold/25 transition-all duration-300 hover:bg-berea-gold/90 hover:-translate-y-0.5 hover:shadow-xl"
              >
                Ubicación y horarios
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </ContentBlock>
      </section>
    </>
  );
}
