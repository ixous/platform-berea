import { PageBanner } from "@/components/public/PageBanner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuestra Historia",
  description:
    "Conoce la historia de Centro Cristiano Berea y c\u00f3mo Dios ha guiado a nuestra iglesia desde sus inicios.",
};

export default function HistoriaPage() {
  return (
    <>
      <PageBanner
        title="Nuestra Historia"
        subtitle="Conoce c\u00f3mo Dios ha guiado a nuestra iglesia."
      />

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-6 text-berea-muted leading-relaxed">
            <p>
              La historia de Centro Cristiano Berea es un testimonio de la fidelidad de Dios. Desde
              sus humildes inicios, la iglesia ha crecido y se ha consolidado como una comunidad de
              fe vibrante en Mexicali, Baja California.
            </p>
            <p>
              Fundada con la visi&oacute;n de ser una iglesia centrada en la Palabra, Berea ha sido
              un faro de esperanza para miles de personas que han encontrado en sus servicios un
              lugar de encuentro con Dios.
            </p>
            <p>
              A lo largo de los a&ntilde;os, la iglesia ha experimentado un crecimiento constante,
              expandiendo sus instalaciones, ministerios y alcance comunitario. Hoy, bajo un
              liderazgo comprometido, Centro Cristiano Berea contin&uacute;a avanzando con la misma
              pasi&oacute;n de sus inicios: predicar el Evangelio y hacer disc&iacute;pulos.
            </p>
            <div className="mt-8 rounded-lg border border-berea-border bg-berea-light p-6">
              <p className="text-sm text-berea-muted">
                Esta secci&oacute;n ser&aacute; completamente administrable desde el CMS. Una vez
                que el equipo de Centro Cristiano Berea proporcione el contenido hist&oacute;rico
                oficial, se actualizar&aacute; autom&aacute;ticamente.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
