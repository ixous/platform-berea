import { db } from "@/lib/db";
import { serviceMinistries } from "@/lib/db/schema";
import { and, isNull, eq } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ministerios de Servicio",
  description:
    "Conoce los ministerios de servicio de Centro Cristiano Berea. \u00c1reas donde puedes poner tus dones al servicio de Dios.",
};

async function getServiceMinistries() {
  return db
    .select()
    .from(serviceMinistries)
    .where(and(eq(serviceMinistries.status, "active"), isNull(serviceMinistries.deletedAt)))
    .orderBy(serviceMinistries.displayOrder);
}

const knownServiceMinistries = [
  "Alabanza",
  "Ni\u00f1os",
  "Varones",
  "Danza",
  "Multimedia",
  "Sonido",
  "Teatro",
  "Ujieres",
  "Intercesi\u00f3n",
  "Seguridad",
  "Maestras de Ni\u00f1os",
];

export default async function MinisteriosServicioPage() {
  const items = await getServiceMinistries();

  return (
    <>
      <PageBanner
        title="Ministerios de Servicio"
        subtitle="Donde tus dones pueden marcar la diferencia."
      />

      {items.length > 0 ? (
        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 sm:grid-cols-2">
              {items.map((m) => (
                <div key={m.id} className="rounded-lg border border-berea-border bg-white p-6">
                  <h3 className="text-xl font-bold text-berea-navy">{m.name}</h3>
                  {m.description && (
                    <p className="mt-3 text-sm leading-relaxed text-berea-muted">{m.description}</p>
                  )}
                  {m.leader && (
                    <p className="mt-3 text-sm text-berea-navy">
                      <strong>L\u00edder:</strong> {m.leader}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <p className="text-berea-muted">
                Estos son algunos de los ministerios de servicio donde puedes participar:
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {knownServiceMinistries.map((name) => (
                <div
                  key={name}
                  className="rounded-lg border border-berea-border bg-white px-5 py-4 text-center"
                >
                  <span className="text-sm font-semibold text-berea-navy">{name}</span>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-berea-muted">
              Cada ministerio ser&aacute; completamente administrable desde el CMS, donde se
              podr&aacute; a&ntilde;adir descripci&oacute;n, l&iacute;der, horario y
              fotograf&iacute;as.
            </p>
          </div>
        </section>
      )}
    </>
  );
}
