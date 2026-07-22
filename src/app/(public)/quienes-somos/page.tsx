import { db } from "@/lib/db";
import { pages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PageBanner } from "@/components/public/PageBanner";
import type { Metadata } from "next";

async function getPage(slug: string) {
  const [page] = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
  return page;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Quienes Somos",
    description:
      "Conoce la identidad, misi\u00f3n y visi\u00f3n de Centro Cristiano Berea en Mexicali, Baja California.",
  };
}

export default async function QuienesSomosPage() {
  const page = await getPage("quienes-somos");
  if (!page) notFound();

  return (
    <>
      <PageBanner
        title="Quienes Somos"
        subtitle="Conoce nuestra identidad, misi\u00f3n y visi\u00f3n."
      />

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="prose prose-lg mx-auto">
            <h2 className="text-2xl font-bold text-berea-navy">Nuestra Identidad</h2>
            {page.content ? (
              <div dangerouslySetInnerHTML={{ __html: page.content }} />
            ) : (
              <div className="space-y-4 text-berea-muted">
                <p>
                  Centro Cristiano Berea es una iglesia cristiana ubicada en Mexicali, Baja
                  California, M&eacute;xico. Somos una comunidad de fe comprometida con la Palabra
                  de Dios y con el amor al pr&oacute;jimo.
                </p>
                <p>
                  Creemos en el poder transformador del Evangelio y trabajamos para que cada persona
                  pueda experimentar una relaci&oacute;n personal con Jesucristo.
                </p>
              </div>
            )}

            <h2 className="mt-12 text-2xl font-bold text-berea-navy">Misi&oacute;n</h2>
            <p className="text-berea-muted">
              Formar disc&iacute;pulos de Cristo, fortalecer familias y extender el Reino de Dios en
              nuestra comunidad y m&aacute;s all&aacute;, a trav&eacute;s de la predicaci&oacute;n
              de la Palabra, la adoraci&oacute;n genuina y el servicio amoroso.
            </p>

            <h2 className="mt-12 text-2xl font-bold text-berea-navy">Visi&oacute;n</h2>
            <p className="text-berea-muted">
              Ser una iglesia que impacta a Mexicali y al mundo con el mensaje de Cristo, formando
              l&iacute;deres comprometidos, familias s&oacute;lidas y una comunidad que refleje el
              amor de Dios en cada &aacute;rea de la vida.
            </p>

            <h2 className="mt-12 text-2xl font-bold text-berea-navy">Valores</h2>
            <ul className="space-y-2 text-berea-muted">
              <li>
                <strong className="text-berea-navy">La Palabra de Dios</strong> como fundamento de
                todo lo que hacemos.
              </li>
              <li>
                <strong className="text-berea-navy">La oraci&oacute;n</strong> como estilo de vida.
              </li>
              <li>
                <strong className="text-berea-navy">La unidad</strong> del cuerpo de Cristo.
              </li>
              <li>
                <strong className="text-berea-navy">El servicio</strong> como expresi&oacute;n de
                amor.
              </li>
              <li>
                <strong className="text-berea-navy">La excelencia</strong> para la gloria de Dios.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
