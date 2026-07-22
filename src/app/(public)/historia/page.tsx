import { db } from "@/lib/db";
import { pages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuestra Historia",
  description:
    "Conoce la historia de Centro Cristiano Berea y c\u00f3mo Dios ha guiado a nuestra iglesia desde sus inicios.",
  openGraph: {
    title: "Nuestra Historia | Centro Cristiano Berea",
    description:
      "Conoce la historia de Centro Cristiano Berea y c\u00f3mo Dios ha guiado a nuestra iglesia desde sus inicios.",
  },
};

async function getPage() {
  const [page] = await db.select().from(pages).where(eq(pages.slug, "nuestra-historia")).limit(1);
  return page;
}

function renderContent(content: string | null) {
  if (!content) return null;
  return content.split("\n").map((p, i) => (
    <p key={i} className="leading-relaxed">
      {p}
    </p>
  ));
}

export default async function HistoriaPage() {
  const page = await getPage();

  return (
    <>
      <PageBanner
        title="Nuestra Historia"
        subtitle="Conoce c\u00f3mo Dios ha guiado a nuestra iglesia."
      />

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {page?.content ? (
            <div className="space-y-6 text-berea-muted leading-relaxed">
              {renderContent(page.content)}
            </div>
          ) : (
            <div className="space-y-6 text-berea-muted leading-relaxed">
              <p>
                La historia de Centro Cristiano Berea es un testimonio de la fidelidad de Dios.
                Desde sus humildes inicios, la iglesia ha crecido y se ha consolidado como una
                comunidad de fe vibrante en Mexicali, Baja California.
              </p>
              <p>
                Fundada con la visi&oacute;n de ser una iglesia centrada en la Palabra, Berea ha
                sido un faro de esperanza para miles de personas que han encontrado en sus servicios
                un lugar de encuentro con Dios.
              </p>
              <p>
                A lo largo de los a&ntilde;os, la iglesia ha experimentado un crecimiento constante,
                expandiendo sus instalaciones, ministerios y alcance comunitario.
              </p>
            </div>
          )}
          <div className="mt-8 rounded-lg border border-berea-border bg-berea-light p-6">
            <p className="text-sm text-berea-muted">
              Esta secci&oacute;n es administrable desde el CMS. Una vez que el equipo de Centro
              Cristiano Berea proporcione el contenido hist&oacute;rico oficial, se
              actualizar&aacute; autom&aacute;ticamente.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
