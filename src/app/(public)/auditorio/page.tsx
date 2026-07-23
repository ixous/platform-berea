import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock } from "@/components/public/ContentBlock";
import Link from "next/link";
import { ArrowRight, Users, MapPin, Target } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuevo Auditorio Berea",
  description:
    "Conoce el proyecto del Nuevo Auditorio Berea con capacidad para más de 3000 personas en Mexicali, Baja California.",
};

export default function AuditorioPage() {
  return (
    <>
      <PageBanner
        title="Nuevo Auditorio Berea"
        subtitle="Un nuevo espacio para la gloria de Dios."
      />

      <ContentBlock>
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-2xl bg-berea-navy p-12 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.12),transparent_60%)]" />
            <div className="relative">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10">
                <Users className="h-10 w-10 text-berea-gold" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl">
                Un espacio para más de 3,000 personas
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/70">
                Con el crecimiento que Dios ha permitido, Centro Cristiano Berea está desarrollando
                un nuevo auditorio principal que albergará a nuestra congregación y permitirá seguir
                alcanzando más vidas para Cristo.
              </p>
            </div>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {[
              { title: "Capacidad", desc: "Más de 3,000 asientos", icon: Users },
              { title: "Ubicación", desc: "Mexicali, Baja California", icon: MapPin },
              {
                title: "Propósito",
                desc: "Expandir el alcance del Evangelio",
                icon: Target,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-berea-border bg-berea-light p-8 text-center transition-shadow hover:shadow-md"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white">
                  <item.icon className="h-6 w-6 text-berea-gold" />
                </div>
                <h3 className="mt-4 text-base font-bold text-berea-navy">{item.title}</h3>
                <p className="mt-2 text-sm text-berea-muted">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-xl border border-berea-border bg-berea-light p-8">
            <p className="text-sm text-berea-muted">
              El video y contenido multimedia serán administrables desde el CMS. Esta sección se
              actualizará cuando el equipo de Centro Cristiano Berea publique el contenido oficial.
            </p>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 rounded-lg bg-berea-gold px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-berea-gold/25 transition-all duration-300 hover:-translate-y-0.5"
            >
              Contáctanos para más información
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </ContentBlock>
    </>
  );
}
