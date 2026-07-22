import { db } from "@/lib/db";
import { events, devotionals, ministries, settings } from "@/lib/db/schema";
import { eq, and, isNull, gte, desc } from "drizzle-orm";
import Link from "next/link";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { EmptySection } from "@/components/public/EmptySection";
import { ArrowRight, CalendarDays, BookOpen, Church, Clock } from "lucide-react";

async function getSiteName() {
  const [setting] = await db
    .select()
    .from(settings)
    .where(and(eq(settings.key, "site_name"), isNull(settings.deletedAt)))
    .limit(1);

  if (!setting) return "Centro Cristiano Berea";

  const value = setting.value as Record<string, string>;
  return value?.es || "Centro Cristiano Berea";
}

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
  const siteName = await getSiteName();
  const [upcomingEvents, recentDevotionals, activeMinistries] = await Promise.all([
    getUpcomingEvents(),
    getRecentDevotionals(),
    getActiveMinistries(),
  ]);

  return (
    <>
      <HeroSection
        title={siteName}
        subtitle="Una iglesia comprometida con la Palabra de Dios, ubicada en Mexicali, Baja California, M&eacute;xico."
        ctaText="Con&oacute;cenos"
        ctaHref="/quienes-somos"
      />

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-berea-gold">
            Bienvenidos
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-berea-navy sm:text-4xl">
            Una familia que vive para Cristo
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-berea-muted">
            En Centro Cristiano Berea encontrar&aacute;s un lugar donde la Palabra de Dios es el
            fundamento de todo lo que hacemos. Nuestra misi&oacute;n es formar disc&iacute;pulos,
            fortalecer familias y alcanzar a nuestra comunidad con el amor de Cristo.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/quienes-somos"
              className="inline-flex items-center gap-2 rounded-md bg-berea-navy px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Quienes Somos
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 rounded-md border border-berea-border bg-white px-5 py-2.5 text-sm font-medium text-berea-navy transition-colors hover:bg-berea-light"
            >
              Ubicaci&oacute;n y contacto
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-berea-border bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Church,
                title: "Servicios",
                desc: "Domingo 10:00 AM y 12:30 PM &middot; Mi&eacute;rcoles 7:00 PM",
              },
              {
                icon: CalendarDays,
                title: "Eventos",
                desc: "Conferencias, congresos y actividades especiales.",
              },
              {
                icon: BookOpen,
                title: "Devocionales",
                desc: "Reflexiones b&iacute;blicas para tu crecimiento espiritual.",
              },
              {
                icon: Clock,
                title: "Ministerios",
                desc: "Encuentra tu lugar para servir y crecer en la fe.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <item.icon className="mx-auto h-8 w-8 text-berea-gold" />
                <h3 className="mt-3 text-base font-semibold text-berea-navy">{item.title}</h3>
                <p className="mt-2 text-sm text-berea-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {upcomingEvents.length > 0 ? (
        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              title="Pr&oacute;ximos Eventos"
              subtitle="Mantente al d&iacute;a con nuestras actividades y servicios especiales."
            />
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/eventos/${event.slug}`}
                  className="group rounded-lg border border-berea-border bg-white p-6 transition-shadow hover:shadow-md"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-berea-gold">
                    {event.eventType || "Evento"}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-berea-navy group-hover:text-berea-gold">
                    {event.title}
                  </h3>
                  <p className="mt-1 text-sm text-berea-muted">
                    {new Date(event.startDate).toLocaleDateString("es-MX", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                    {event.time && ` \u2022 ${event.time}`}
                  </p>
                  {event.location && (
                    <p className="mt-1 text-sm text-berea-muted">{event.location}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <EmptySection
          title="Eventos"
          message="Pr&oacute;ximamente podr&aacute;s consultar aqu&iacute; los eventos y actividades de la iglesia."
        />
      )}

      {activeMinistries.length > 0 ? (
        <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              title="Ministerios"
              subtitle="Descubre las diferentes &aacute;reas donde puedes servir y crecer."
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {activeMinistries.map((m) => (
                <Link
                  key={m.id}
                  href="/ministerios-activos"
                  className="group rounded-lg border border-berea-border bg-berea-light p-6 text-center transition-shadow hover:shadow-md"
                >
                  <h3 className="text-base font-semibold text-berea-navy group-hover:text-berea-gold">
                    {m.name}
                  </h3>
                  {m.description && (
                    <p className="mt-2 text-sm text-berea-muted line-clamp-2">{m.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <EmptySection
          title="Ministerios"
          message="Pr&oacute;ximamente podr&aacute;s consultar aqu&iacute; los ministerios activos de la iglesia."
        />
      )}

      {recentDevotionals.length > 0 ? (
        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              title="Devocionales"
              subtitle="Reflexiones b&iacute;blicas para edificar tu vida espiritual."
            />
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {recentDevotionals.map((d) => (
                <Link
                  key={d.id}
                  href={`/devocionales/${d.slug}`}
                  className="group rounded-lg border border-berea-border bg-white p-6 transition-shadow hover:shadow-md"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-berea-gold">
                    Devocional
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-berea-navy group-hover:text-berea-gold">
                    {d.title}
                  </h3>
                  {d.excerpt && (
                    <p className="mt-2 text-sm text-berea-muted line-clamp-3">{d.excerpt}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <EmptySection
          title="Devocionales"
          message="Pr&oacute;ximamente publicaremos devocionales para tu crecimiento espiritual."
        />
      )}

      <section className="bg-berea-navy px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Vis&iacute;tanos
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">
            Nos encantar&iacute;a recibirte en nuestra iglesia. Ven tal como eres y descubre una
            comunidad que te amar&aacute; y te apoyar&aacute; en tu caminar con Cristo.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 rounded-md bg-berea-gold px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Ubicaci&oacute;n y horarios
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
