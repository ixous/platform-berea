import { db } from "@/lib/db";
import { devotionals, events, contactSubmissions } from "@/lib/db/schema";
import { eq, and, isNull, gte, desc } from "drizzle-orm";
import Link from "next/link";
import { FileText, Calendar, MessageSquare } from "lucide-react";

async function getDrafts() {
  const items = await Promise.all([
    db
      .select({ id: devotionals.id, title: devotionals.title, updatedAt: devotionals.updatedAt })
      .from(devotionals)
      .where(and(eq(devotionals.status, "draft"), isNull(devotionals.deletedAt)))
      .orderBy(desc(devotionals.updatedAt))
      .limit(5)
      .then((r) =>
        r.map((d) => ({
          ...d,
          type: "devocional" as const,
          href: `/admin/content/devotionals/${d.id}`,
        }))
      ),
    db
      .select({ id: events.id, title: events.title, updatedAt: events.updatedAt })
      .from(events)
      .where(and(eq(events.status, "draft"), isNull(events.deletedAt)))
      .orderBy(desc(events.updatedAt))
      .limit(5)
      .then((r) =>
        r.map((e) => ({ ...e, type: "evento" as const, href: `/admin/content/events/${e.id}` }))
      ),
  ]);
  return items
    .flat()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);
}

async function getUpcomingEvents() {
  return db
    .select({ id: events.id, title: events.title, startDate: events.startDate })
    .from(events)
    .where(
      and(
        eq(events.status, "published"),
        gte(events.startDate, new Date()),
        isNull(events.deletedAt)
      )
    )
    .orderBy(events.startDate)
    .limit(5);
}

export async function AttentionRequired() {
  const [drafts, upcoming, pendingContacts] = await Promise.all([
    getDrafts(),
    getUpcomingEvents(),
    db
      .select({
        id: contactSubmissions.id,
        name: contactSubmissions.name,
        subject: contactSubmissions.subject,
        createdAt: contactSubmissions.createdAt,
      })
      .from(contactSubmissions)
      .where(eq(contactSubmissions.status, "pending"))
      .orderBy(desc(contactSubmissions.createdAt))
      .limit(5),
  ]);

  const totalDrafts = drafts.length;
  const hasItems = drafts.length > 0 || upcoming.length > 0 || pendingContacts.length > 0;

  if (!hasItems) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
        <p className="text-sm text-muted-foreground">
          Todo está al día. No hay contenido que requiera atención.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="border-b px-5 py-3.5">
        <h2 className="text-sm font-semibold">Requiere Atención</h2>
      </div>
      <div className="divide-y">
        {drafts.length > 0 && (
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 text-sm font-medium text-amber-700">
              <FileText className="h-4 w-4" />
              <span>Borradores ({totalDrafts})</span>
            </div>
            <ul className="mt-2 space-y-1">
              {drafts.map((d) => (
                <li key={d.id}>
                  <Link
                    href={d.href}
                    className="group flex items-center justify-between rounded-md px-2 py-1 text-sm transition-colors hover:bg-muted"
                  >
                    <span className="truncate text-muted-foreground group-hover:text-foreground">
                      {d.title}
                    </span>
                    <span className="ml-2 shrink-0 text-xs text-muted-foreground/50">{d.type}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {upcoming.length > 0 && (
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
              <Calendar className="h-4 w-4" />
              <span>Eventos Próximos</span>
            </div>
            <ul className="mt-2 space-y-1">
              {upcoming.map((e) => (
                <li key={e.id}>
                  <Link
                    href={`/admin/content/events/${e.id}`}
                    className="group flex items-center justify-between rounded-md px-2 py-1 text-sm transition-colors hover:bg-muted"
                  >
                    <span className="truncate text-muted-foreground group-hover:text-foreground">
                      {e.title}
                    </span>
                    <span className="ml-2 shrink-0 text-xs text-muted-foreground/50">
                      {new Date(e.startDate).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {pendingContacts.length > 0 && (
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 text-sm font-medium text-rose-700">
              <MessageSquare className="h-4 w-4" />
              <span>Mensajes sin Responder ({pendingContacts.length})</span>
            </div>
            <ul className="mt-2 space-y-1">
              {pendingContacts.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/admin/contact/${c.id}`}
                    className="group flex items-center justify-between rounded-md px-2 py-1 text-sm transition-colors hover:bg-muted"
                  >
                    <span className="truncate text-muted-foreground group-hover:text-foreground">
                      {c.subject}
                    </span>
                    <span className="ml-2 shrink-0 text-xs text-muted-foreground/50">{c.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
