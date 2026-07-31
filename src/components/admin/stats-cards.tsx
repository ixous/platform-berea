import { db } from "@/lib/db";
import {
  pages,
  devotionals,
  events,
  ministries,
  serviceMinistries,
  biblicalPrograms,
  cells,
  contactSubmissions,
  eventRegistrations,
  media,
} from "@/lib/db/schema";
import { eq, and, isNull, gte, sql } from "drizzle-orm";
import {
  FileText,
  CheckCircle2,
  CalendarCheck,
  MessageSquare,
  ClipboardList,
  ImageIcon,
  type LucideIcon,
} from "lucide-react";

interface Stat {
  label: string;
  value: number;
  icon: LucideIcon;
  accent: string;
}

async function getStats() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const run = (q: Promise<{ value: number }[]>) => q.then((r) => r[0]?.value ?? 0);

  const [
    draftPages,
    draftDevos,
    draftEvents,
    draftPrograms,
    publishedPages,
    publishedDevos,
    publishedEvents,
    publishedPrograms,
    activeMinistries,
    activeService,
    activeCells,
    upcomingEvents,
    pendingContacts,
    recentRegistrations,
    recentMedia,
  ] = await Promise.all([
    run(
      db
        .select({ value: sql<number>`COUNT(*)::int` })
        .from(pages)
        .where(eq(pages.status, "draft"))
    ),
    run(
      db
        .select({ value: sql<number>`COUNT(*)::int` })
        .from(devotionals)
        .where(and(eq(devotionals.status, "draft"), isNull(devotionals.deletedAt)))
    ),
    run(
      db
        .select({ value: sql<number>`COUNT(*)::int` })
        .from(events)
        .where(and(eq(events.status, "draft"), isNull(events.deletedAt)))
    ),
    run(
      db
        .select({ value: sql<number>`COUNT(*)::int` })
        .from(biblicalPrograms)
        .where(and(eq(biblicalPrograms.status, "draft"), isNull(biblicalPrograms.deletedAt)))
    ),
    run(
      db
        .select({ value: sql<number>`COUNT(*)::int` })
        .from(pages)
        .where(eq(pages.status, "published"))
    ),
    run(
      db
        .select({ value: sql<number>`COUNT(*)::int` })
        .from(devotionals)
        .where(and(eq(devotionals.status, "published"), isNull(devotionals.deletedAt)))
    ),
    run(
      db
        .select({ value: sql<number>`COUNT(*)::int` })
        .from(events)
        .where(and(eq(events.status, "published"), isNull(events.deletedAt)))
    ),
    run(
      db
        .select({ value: sql<number>`COUNT(*)::int` })
        .from(biblicalPrograms)
        .where(and(eq(biblicalPrograms.status, "published"), isNull(biblicalPrograms.deletedAt)))
    ),
    run(
      db
        .select({ value: sql<number>`COUNT(*)::int` })
        .from(ministries)
        .where(and(eq(ministries.status, "active"), isNull(ministries.deletedAt)))
    ),
    run(
      db
        .select({ value: sql<number>`COUNT(*)::int` })
        .from(serviceMinistries)
        .where(and(eq(serviceMinistries.status, "active"), isNull(serviceMinistries.deletedAt)))
    ),
    run(
      db
        .select({ value: sql<number>`COUNT(*)::int` })
        .from(cells)
        .where(and(eq(cells.status, "active"), isNull(cells.deletedAt)))
    ),
    run(
      db
        .select({ value: sql<number>`COUNT(*)::int` })
        .from(events)
        .where(
          and(eq(events.status, "published"), gte(events.startDate, now), isNull(events.deletedAt))
        )
    ),
    run(
      db
        .select({ value: sql<number>`COUNT(*)::int` })
        .from(contactSubmissions)
        .where(eq(contactSubmissions.status, "pending"))
    ),
    run(
      db
        .select({ value: sql<number>`COUNT(*)::int` })
        .from(eventRegistrations)
        .where(gte(eventRegistrations.createdAt, sevenDaysAgo))
    ),
    run(
      db
        .select({ value: sql<number>`COUNT(*)::int` })
        .from(media)
        .where(and(gte(media.createdAt, sevenDaysAgo), isNull(media.deletedAt)))
    ),
  ]);

  return {
    drafts: draftPages + draftDevos + draftEvents + draftPrograms,
    published:
      publishedPages +
      publishedDevos +
      publishedEvents +
      publishedPrograms +
      activeMinistries +
      activeService +
      activeCells,
    upcomingEvents,
    pendingContacts,
    recentRegistrations,
    recentMedia,
  };
}

function StatCard({ label, value, icon: Icon, accent }: Stat) {
  return (
    <div className="rounded-xl border bg-card shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start gap-4 p-5">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold tabular-nums tracking-tight">{value}</p>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}

export async function StatsCards() {
  const stats = await getStats();

  const cards: Stat[] = [
    {
      label: "Borradores",
      value: stats.drafts,
      icon: FileText,
      accent: "bg-amber-100 text-amber-700",
    },
    {
      label: "Publicados",
      value: stats.published,
      icon: CheckCircle2,
      accent: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Eventos Próximos",
      value: stats.upcomingEvents,
      icon: CalendarCheck,
      accent: "bg-blue-100 text-blue-700",
    },
    {
      label: "Mensajes Pendientes",
      value: stats.pendingContacts,
      icon: MessageSquare,
      accent: "bg-rose-100 text-rose-700",
    },
    {
      label: "Registros (7d)",
      value: stats.recentRegistrations,
      icon: ClipboardList,
      accent: "bg-violet-100 text-violet-700",
    },
    {
      label: "Archivos (7d)",
      value: stats.recentMedia,
      icon: ImageIcon,
      accent: "bg-sky-100 text-sky-700",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
