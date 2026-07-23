import { db } from "@/lib/db";
import { pages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock, ContentNarrow } from "@/components/public/ContentBlock";
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
    openGraph: {
      title: "Quienes Somos | Centro Cristiano Berea",
      description:
        "Conoce la identidad, misi\u00f3n y visi\u00f3n de Centro Cristiano Berea en Mexicali, Baja California.",
    },
  };
}

function renderContent(content: string | null) {
  if (!content) return null;
  return content.split("\n").map((p, i) => (
    <p key={i} className="leading-relaxed text-berea-muted">
      {p}
    </p>
  ));
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

      <ContentBlock>
        <ContentNarrow>
          <h2 className="text-2xl font-bold text-berea-navy">Nuestra Identidad</h2>
          <div className="mt-4 h-1 w-10 rounded-full bg-berea-gold" />
          {page.content ? (
            <div className="mt-6 space-y-5">{renderContent(page.content)}</div>
          ) : (
            <div className="mt-6 space-y-5 text-berea-muted">
              <p>
                Centro Cristiano Berea es una iglesia cristiana ubicada en Mexicali, Baja
                California, M\u00e9xico. Somos una comunidad de fe comprometida con la Palabra de
                Dios y con el amor al pr\u00f3jimo.
              </p>
              <p>
                Creemos en el poder transformador del Evangelio y trabajamos para que cada persona
                pueda experimentar una relaci\u00f3n personal con Jesucristo.
              </p>
            </div>
          )}

          <h2 className="mt-16 text-2xl font-bold text-berea-navy">Misi\u00f3n</h2>
          <div className="mt-4 h-1 w-10 rounded-full bg-berea-gold" />
          <p className="mt-6 leading-relaxed text-berea-muted">
            Formar disc\u00edpulos de Cristo, fortalecer familias y extender el Reino de Dios en
            nuestra comunidad y m\u00e1s all\u00e1, a trav\u00e9s de la predicaci\u00f3n de la
            Palabra, la adoraci\u00f3n genuina y el servicio amoroso.
          </p>

          <h2 className="mt-16 text-2xl font-bold text-berea-navy">Visi\u00f3n</h2>
          <div className="mt-4 h-1 w-10 rounded-full bg-berea-gold" />
          <p className="mt-6 leading-relaxed text-berea-muted">
            Ser una iglesia que impacta a Mexicali y al mundo con el mensaje de Cristo, formando
            l\u00edderes comprometidos, familias s\u00f3lidas y una comunidad que refleje el amor de
            Dios en cada \u00e1rea de la vida.
          </p>

          <h2 className="mt-16 text-2xl font-bold text-berea-navy">Valores</h2>
          <div className="mt-4 h-1 w-10 rounded-full bg-berea-gold" />
          <ul className="mt-6 space-y-4">
            {[
              { bold: "La Palabra de Dios", rest: "como fundamento de todo lo que hacemos." },
              { bold: "La oraci\u00f3n", rest: "como estilo de vida." },
              { bold: "La unidad", rest: "del cuerpo de Cristo." },
              { bold: "El servicio", rest: "como expresi\u00f3n de amor." },
              { bold: "La excelencia", rest: "para la gloria de Dios." },
            ].map((v) => (
              <li key={v.bold} className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-berea-gold" />
                <span className="text-berea-muted">
                  <strong className="text-berea-navy">{v.bold}</strong> {v.rest}
                </span>
              </li>
            ))}
          </ul>
        </ContentNarrow>
      </ContentBlock>
    </>
  );
}
