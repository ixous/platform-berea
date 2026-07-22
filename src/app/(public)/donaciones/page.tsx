import { PageBanner } from "@/components/public/PageBanner";
import { Heart, Banknote } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donaciones",
  description:
    "Apoya econ\u00f3micamente la obra de Centro Cristiano Berea. Tu ofrenda hace una diferencia.",
};

export default function DonacionesPage() {
  return (
    <>
      <PageBanner title="Donaciones" subtitle="Tu generosidad ayuda a extender el Reino de Dios." />

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <Heart className="mx-auto h-12 w-12 text-berea-gold" />
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-berea-navy sm:text-3xl">
              Ofrenda con un coraz\u00f3n generoso
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-berea-muted">
              Cada aportaci\u00f3n contribuye a la obra de Dios, permitiendo que el Evangelio siga
              siendo predicado, que nuestra iglesia contin\u00fae creciendo y que podamos seguir
              bendiciendo a nuestra comunidad.
            </p>
          </div>

          <div className="rounded-lg border border-berea-border bg-berea-light p-8 text-center">
            <Banknote className="mx-auto h-10 w-10 text-berea-muted" />
            <h3 className="mt-4 text-lg font-bold text-berea-navy">Informaci\u00f3n pendiente</h3>
            <p className="mt-2 text-sm text-berea-muted">
              Los datos bancarios, cuentas y m\u00e9todos de donaci\u00f3n se configurar\u00e1n
              desde el CMS cuando el equipo de Centro Cristiano Berea proporcione la
              informaci\u00f3n oficial.
            </p>
            <p className="mt-2 text-sm text-berea-muted">
              En el futuro se integrar\u00e1 Stripe para facilitar donaciones en l\u00ednea.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 rounded-md bg-berea-navy px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Cont\u00e1ctanos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
