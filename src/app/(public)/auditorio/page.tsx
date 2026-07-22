import { PageBanner } from "@/components/public/PageBanner";
import Link from "next/link";
import { ArrowRight, Users, MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuevo Auditorio Berea",
  description:
    "Conoce el proyecto del Nuevo Auditorio Berea con capacidad para m\u00e1s de 3000 personas en Mexicali, Baja California.",
};

export default function AuditorioPage() {
  return (
    <>
      <PageBanner
        title="Nuevo Auditorio Berea"
        subtitle="Un nuevo espacio para la gloria de Dios."
      />

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg border border-berea-border bg-berea-navy p-10 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/10">
              <Users className="h-10 w-10 text-berea-gold" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl">
              Un espacio para m\u00e1s de 3,000 personas
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/70">
              Con el crecimiento que Dios ha permitido, Centro Cristiano Berea est\u00e1
              desarrollando un nuevo auditorio principal que albergar\u00e1 a nuestra
              congregaci\u00f3n y permitir\u00e1 seguir alcanzando m\u00e1s vidas para Cristo.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              { title: "Capacidad", desc: "M\u00e1s de 3,000 asientos", icon: Users },
              { title: "Ubicaci\u00f3n", desc: "Mexicali, Baja California", icon: MapPin },
              { title: "Prop\u00f3sito", desc: "Expandir el alcance del Evangelio", icon: Users },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-berea-border bg-berea-light p-6 text-center"
              >
                <item.icon className="mx-auto h-8 w-8 text-berea-gold" />
                <h3 className="mt-3 text-base font-semibold text-berea-navy">{item.title}</h3>
                <p className="mt-2 text-sm text-berea-muted">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-lg border border-berea-border bg-berea-light p-6">
            <p className="text-sm text-berea-muted">
              El video y contenido multimedia ser\u00e1n administrables desde el CMS. Esta
              secci\u00f3n se actualizar\u00e1 cuando el equipo de Centro Cristiano Berea publique
              el contenido oficial.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 rounded-md bg-berea-gold px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Cont\u00e1ctanos para m\u00e1s informaci\u00f3n
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
