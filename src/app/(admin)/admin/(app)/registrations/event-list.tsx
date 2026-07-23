import { db } from "@/lib/db";
import { events, eventRegistrations } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/rbac";
import { redirect } from "next/navigation";
import { eq, and, isNull, desc, count, sql } from "drizzle-orm";
import Link from "next/link";
import { CalendarDays, Users, UserCheck, ExternalLink, ArrowRight } from "lucide-react";

export async function EventRegistrationList() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");
  const allowed = await hasPermission("event-registrations.manage");
  if (!allowed) redirect("/admin");

  const allEvents = await db
    .select({
      id: events.id,
      title: events.title,
      slug: events.slug,
      startDate: events.startDate,
      capacity: events.capacity,
    })
    .from(events)
    .where(and(isNull(events.deletedAt), eq(events.status, "published")))
    .orderBy(desc(events.startDate));

  const eventsWithCounts = await Promise.all(
    allEvents.map(async (ev) => {
      const [countResult] = await db
        .select({ count: count() })
        .from(eventRegistrations)
        .where(
          and(eq(eventRegistrations.eventId, ev.id), eq(eventRegistrations.status, "confirmed"))
        );

      const [guestsResult] = await db
        .select({
          total: sql<number>`COALESCE(SUM(${eventRegistrations.guests}), 0)::int`,
        })
        .from(eventRegistrations)
        .where(
          and(eq(eventRegistrations.eventId, ev.id), eq(eventRegistrations.status, "confirmed"))
        );

      return {
        ...ev,
        confirmed: Number(countResult?.count ?? 0),
        totalGuests: Number(guestsResult?.total ?? 0),
      };
    })
  );

  return (
    <div className="space-y-4">
      {eventsWithCounts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-berea-border p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-berea-muted" />
          <p className="mt-4 text-sm text-berea-muted">No hay eventos publicados.</p>
        </div>
      ) : (
        eventsWithCounts.map((ev) => (
          <Link
            key={ev.id}
            href={`/admin/events/${ev.id}/registrations`}
            className="group flex items-center justify-between rounded-xl border border-berea-border bg-white p-5 transition-all hover:border-berea-gold/50 hover:shadow-sm"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-berea-navy group-hover:text-berea-gold transition-colors">
                  {ev.title}
                </h3>
                <ExternalLink className="h-3.5 w-3.5 text-berea-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-berea-muted">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {new Date(ev.startDate).toLocaleDateString("es-MX", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5" />
                  {ev.confirmed} registro(s), {ev.totalGuests} asistente(s)
                </span>
                {ev.capacity && <span className="text-xs">Capacidad: {ev.capacity}</span>}
              </div>
            </div>
            <div className="ml-4 flex h-8 w-8 items-center justify-center rounded-lg bg-berea-navy/5 text-berea-navy transition-colors group-hover:bg-berea-gold/10 group-hover:text-berea-gold">
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
