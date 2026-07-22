import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { and, isNull, eq, gte } from "drizzle-orm";
import Link from "next/link";
import { PageBanner } from "@/components/public/PageBanner";
import { EmptySection } from "@/components/public/EmptySection";
import { CalendarDays, MapPin, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eventos",
  description:
    "Pr\u00f3ximos eventos y actividades de Centro Cristiano Berea en Mexicali, Baja California.",
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
    .limit(20);
}

export default async function EventosPage() {
  const items = await getUpcomingEvents();

  return (
    <>
      <PageBanner title="Eventos" subtitle="Mantente al d\u00eda con nuestras actividades." />

      {items.length > 0 ? (
        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="space-y-6">
              {items.map((e) => (
                <Link
                  key={e.id}
                  href={`/eventos/${e.slug}`}
                  className="group flex flex-col gap-4 rounded-lg border border-berea-border bg-white p-6 transition-shadow hover:shadow-md sm:flex-row sm:items-center"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-berea-navy">
                    <CalendarDays className="h-6 w-6 text-berea-gold" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-berea-navy group-hover:text-berea-gold">
                      {e.title}
                    </h3>
                    {e.description && (
                      <p className="mt-1 text-sm text-berea-muted line-clamp-2">{e.description}</p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-berea-muted">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {new Date(e.startDate).toLocaleDateString("es-MX", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      {e.time && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {e.time}
                        </span>
                      )}
                      {e.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {e.location}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <EmptySection
          title="Eventos"
          message="Pr\u00f3ximamente podr\u00e1s consultar aqu\u00ed los eventos y actividades de la iglesia."
        />
      )}
    </>
  );
}
