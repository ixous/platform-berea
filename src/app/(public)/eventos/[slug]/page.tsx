import { db } from "@/lib/db";
import { events, eventRegistrations } from "@/lib/db/schema";
import { eq, and, isNull, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin, Clock, Users } from "lucide-react";
import type { Metadata } from "next";
import { EventRegistrationButton } from "./registration-button";

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

  const [countResult] = await db
    .select({
      total: sql<number>`COALESCE(SUM(${eventRegistrations.guests}), 0)::int`,
      count: sql<number>`COUNT(*)::int`,
    })
    .from(eventRegistrations)
    .where(
      and(eq(eventRegistrations.eventId, item.id), eq(eventRegistrations.status, "confirmed"))
    );

  const currentGuests = Number(countResult?.total ?? 0);
  const confirmedCount = Number(countResult?.count ?? 0);
  const isPast = new Date(item.startDate) < new Date();
  const isFull = item.capacity !== null && currentGuests >= item.capacity;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 animate-fade-up">
      <Link
        href="/eventos"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-berea-muted transition-colors hover:text-berea-navy"
      >
        <ArrowLeft className="h-4 w-4" />
        Todos los eventos
      </Link>

      <p className="mt-10 text-sm font-semibold uppercase tracking-widest text-berea-gold">
        {item.eventType || "Evento"}
      </p>
      <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-berea-navy sm:text-4xl">
        {item.title}
      </h1>

      <div className="mt-8 flex flex-wrap gap-5 rounded-xl border border-berea-border bg-white p-6">
        <div className="flex items-center gap-2.5 text-sm text-berea-navy">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-berea-navy/5">
            <CalendarDays className="h-4 w-4 text-berea-gold" />
          </div>
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
          <div className="flex items-center gap-2.5 text-sm text-berea-navy">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-berea-navy/5">
              <Clock className="h-4 w-4 text-berea-gold" />
            </div>
            <span>{item.time}</span>
          </div>
        )}
        {item.location && (
          <div className="flex items-center gap-2.5 text-sm text-berea-navy">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-berea-navy/5">
              <MapPin className="h-4 w-4 text-berea-gold" />
            </div>
            <span>{item.location}</span>
          </div>
        )}
        {item.capacity && (
          <div className="flex items-center gap-2.5 text-sm text-berea-navy">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-berea-navy/5">
              <Users className="h-4 w-4 text-berea-gold" />
            </div>
            <span>
              {confirmedCount} registrado(s) — Capacidad: {item.capacity}
            </span>
          </div>
        )}
      </div>

      {!isPast && (
        <div className="mt-8">
          <EventRegistrationButton
            eventId={item.id}
            eventTitle={item.title}
            capacity={item.capacity}
            isFull={isFull}
          />
        </div>
      )}

      {item.description && (
        <div className="mt-10 space-y-5 leading-relaxed text-berea-navy/80">
          {item.description.split("\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}

      {item.additionalInfo && (
        <div className="mt-10 rounded-xl border border-berea-border bg-berea-light p-8">
          <h2 className="text-lg font-bold text-berea-navy">Información adicional</h2>
          <div className="mt-2 h-0.5 w-8 rounded-full bg-berea-gold/30" />
          <p className="mt-4 text-sm leading-relaxed text-berea-muted">{item.additionalInfo}</p>
        </div>
      )}
    </article>
  );
}
