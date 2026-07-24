import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { and, isNull, eq, gte } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock } from "@/components/public/ContentBlock";
import { MediaCard } from "@/components/public/MediaCard";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { getEntityMediaMap } from "@/lib/db/media-helpers";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import type { Metadata } from "next";

interface EventItem {
  title: string;
  description: string | null;
  eventType: string | null;
  startDate: Date | string;
  time: string | null;
  location: string | null;
  id?: string;
  slug?: string;
  additionalInfo?: string | null;
}

export const metadata: Metadata = {
  title: "Eventos",
  description:
    "Próximos eventos y actividades de Centro Cristiano Berea en Mexicali, Baja California.",
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

const sampleEvents: EventItem[] = [
  {
    title: "Noche Mexicana",
    description:
      "Una noche llena de color, sabor y tradición mexicana. Celebraremos juntos nuestras raíces con música en vivo, bailes folclóricos, antojitos mexicanos y un ambiente de convivencia familiar. Habrá platillos típicos como pozole, tamales, tacos y aguas frescas, además de juegos tradicionales y sorpresas para todas las edades. Ven con tu familia y disfruta de una velada inolvidable donde celebramos la herencia que Dios nos ha dado como pueblo. No olvides traer tu ánimo y tus ganas de pasar un rato agradable.",
    eventType: "Celebración",
    startDate: "2026-09-15",
    time: "6:00 PM",
    location: "Centro Cristiano Berea",
  },
  {
    title: "Bautizmos",
    description:
      "Un día especial para celebrar la decisión de fe de aquellos que han decidido seguir a Cristo mediante el bautismo en agua. Este servicio es un momento de profundo significado espiritual, donde testigos presenciales serán edificados al ver vidas transformadas por el poder del Evangelio. Habrá testimonios, alabanzas y un ambiente de gozo celestial. Si deseas bautizarte, aún estás a tiempo de inscribirte en el lobby de la iglesia. Invita a tus familiares y amigos a ser parte de esta celebración de fe.",
    eventType: "Servicio Especial",
    startDate: "2026-11-02",
    time: "11:00 AM",
    location: "Centro Cristiano Berea",
  },
  {
    title: "Posada Navideña",
    description:
      "Cerramos el año con una posada llena de alegría, amor y el verdadero espíritu navideño. Habrá piñatas, aguinaldos, ponche caliente, dulces típicos y un ambiente de confraternidad que recordará a grandes y pequeños el verdadero significado de la Navidad: el nacimiento de nuestro Salvador Jesucristo. Tendremos villancicos, pastorela y un mensaje especial que nos recordará que la mayor riqueza es tener a Cristo en nuestros corazones. ¡No faltes y trae a toda tu familia!",
    eventType: "Celebración",
    startDate: "2026-12-19",
    time: "6:00 PM",
    location: "Centro Cristiano Berea",
  },
];

function formatDate(date: Date) {
  return date.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function EventosPage() {
  const items = await getUpcomingEvents();
  const mediaMap = await getEntityMediaMap(
    "event",
    items.map((e) => e.id)
  );

  const hasData = items.length > 0;
  const displayItems = hasData ? items : sampleEvents;

  return (
    <>
      <PageBanner
        title="Eventos"
        subtitle="Mantente al día con nuestras actividades."
        backgroundImage="/images/banner-eventos.png"
      />

      <ContentBlock variant="warm">
        <ScrollReveal animation="fade-up">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-berea-navy sm:text-4xl">
              Próximos Eventos
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-berea-muted">
              Conferencias, congresos y actividades especiales para toda la familia.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="stagger" staggerItems delay={150} className="mt-16">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {(displayItems as EventItem[]).map((event) => {
              const img = hasData ? mediaMap.get(event.id!) : null;
              return (
                <MediaCard
                  key={event.title || event.id}
                  title={event.title}
                  description={event.description || event.additionalInfo}
                  imageUrl={img?.mediaUrl || img?.thumbnailUrl}
                  href={hasData ? `/eventos/${event.slug}` : undefined}
                  category={event.eventType || "Evento"}
                  meta={
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-berea-muted">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-berea-gold/60" />
                        {formatDate(new Date(event.startDate))}
                      </span>
                      {event.time && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-berea-gold/60" />
                          {event.time}
                        </span>
                      )}
                      {event.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-berea-gold/60" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  }
                />
              );
            })}
          </div>
        </ScrollReveal>
      </ContentBlock>
    </>
  );
}
