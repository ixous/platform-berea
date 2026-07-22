import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin, Clock } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [item] = await db
    .select()
    .from(events)
    .where(and(eq(events.slug, slug), eq(events.status, "published"), isNull(events.deletedAt)))
    .limit(1);

  if (!item) return { title: "Evento no encontrado" };

  return { title: item.title, description: item.description || item.title };
}

export default async function EventoDetallePage({ params }: Props) {
  const { slug } = await params;
  const [item] = await db
    .select()
    .from(events)
    .where(and(eq(events.slug, slug), eq(events.status, "published"), isNull(events.deletedAt)))
    .limit(1);

  if (!item) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/eventos"
        className="inline-flex items-center gap-1 text-sm text-berea-muted transition-colors hover:text-berea-navy"
      >
        <ArrowLeft className="h-4 w-4" />
        Todos los eventos
      </Link>

      <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-berea-gold">
        {item.eventType || "Evento"}
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-berea-navy sm:text-4xl">
        {item.title}
      </h1>

      <div className="mt-6 flex flex-wrap gap-4 rounded-lg border border-berea-border bg-white p-5">
        <div className="flex items-center gap-2 text-sm text-berea-navy">
          <CalendarDays className="h-4 w-4 text-berea-gold" />
          <span>
            {new Date(item.startDate).toLocaleDateString("es-MX", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
        {item.time && (
          <div className="flex items-center gap-2 text-sm text-berea-navy">
            <Clock className="h-4 w-4 text-berea-gold" />
            <span>{item.time}</span>
          </div>
        )}
        {item.location && (
          <div className="flex items-center gap-2 text-sm text-berea-navy">
            <MapPin className="h-4 w-4 text-berea-gold" />
            <span>{item.location}</span>
          </div>
        )}
      </div>

      {item.description && (
        <div className="prose prose-lg mx-auto mt-8 max-w-none text-berea-navy/80">
          {item.description.split("\n").map((p, i) => (
            <p key={i} className="leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      )}

      {item.additionalInfo && (
        <div className="mt-8 rounded-lg border border-berea-border bg-berea-light p-6">
          <h2 className="text-lg font-bold text-berea-navy">Informaci\u00f3n adicional</h2>
          <p className="mt-2 text-sm text-berea-muted">{item.additionalInfo}</p>
        </div>
      )}
    </article>
  );
}
