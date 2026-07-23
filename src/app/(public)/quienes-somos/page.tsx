import { db } from "@/lib/db";
import { pages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock, ContentNarrow } from "@/components/public/ContentBlock";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { Heart, Target, Eye, List } from "lucide-react";
import type { Metadata } from "next";

async function getPage(slug: string) {
  const [page] = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
  return page;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Quienes Somos",
    description:
      "Conoce la identidad, misión y visión de Centro Cristiano Berea en Mexicali, Baja California.",
    openGraph: {
      title: "Quienes Somos | Centro Cristiano Berea",
      description:
        "Conoce la identidad, misión y visión de Centro Cristiano Berea en Mexicali, Baja California.",
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
        subtitle="Conoce nuestra identidad, misión y visión."
        backgroundImage="/images/banner-quienes-somos.png"
      />

      <ContentBlock variant="gold-mist">
        <ContentNarrow>
          <ScrollReveal animation="fade-up">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-berea-gold/10 to-berea-gold/5">
                <Heart className="h-5 w-5 text-berea-gold" />
              </div>
              <h2 className="text-2xl font-bold text-berea-navy">Nuestra Identidad</h2>
            </div>
            <div className="mt-4 h-0.5 w-12 rounded-full bg-gradient-to-r from-berea-gold/80 to-berea-gold" />
            {page.content ? (
              <div className="mt-6 space-y-5">{renderContent(page.content)}</div>
            ) : (
              <div className="mt-6 space-y-5 leading-relaxed text-berea-muted">
                <p>
                  Centro Cristiano Berea es una iglesia cristiana ubicada en Mexicali, Baja
                  California, México. Somos una comunidad de fe comprometida con la Palabra de Dios
                  y con el amor al prójimo.
                </p>
                <p>
                  Creemos en el poder transformador del Evangelio y trabajamos para que cada persona
                  pueda experimentar una relación personal con Jesucristo.
                </p>
              </div>
            )}
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={100}>
            <div className="mt-16 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-berea-gold/10 to-berea-gold/5">
                <Target className="h-5 w-5 text-berea-gold" />
              </div>
              <h2 className="text-2xl font-bold text-berea-navy">Misión</h2>
            </div>
            <div className="mt-4 h-0.5 w-12 rounded-full bg-gradient-to-r from-berea-gold/80 to-berea-gold" />
            <p className="mt-6 leading-relaxed text-berea-muted">
              Formar discípulos de Cristo, fortalecer familias y extender el Reino de Dios en
              nuestra comunidad y más allá, a través de la predicación de la Palabra, la adoración
              genuina y el servicio amoroso.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={200}>
            <div className="mt-16 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-berea-gold/10 to-berea-gold/5">
                <Eye className="h-5 w-5 text-berea-gold" />
              </div>
              <h2 className="text-2xl font-bold text-berea-navy">Visión</h2>
            </div>
            <div className="mt-4 h-0.5 w-12 rounded-full bg-gradient-to-r from-berea-gold/80 to-berea-gold" />
            <p className="mt-6 leading-relaxed text-berea-muted">
              Ser una iglesia que impacta a Mexicali y al mundo con el mensaje de Cristo, formando
              líderes comprometidos, familias sólidas y una comunidad que refleje el amor de Dios en
              cada área de la vida.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={300}>
            <div className="mt-16 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-berea-gold/10 to-berea-gold/5">
                <List className="h-5 w-5 text-berea-gold" />
              </div>
              <h2 className="text-2xl font-bold text-berea-navy">Valores</h2>
            </div>
            <div className="mt-4 h-0.5 w-12 rounded-full bg-gradient-to-r from-berea-gold/80 to-berea-gold" />
            <ul className="mt-6 space-y-4">
              {[
                { bold: "La Palabra de Dios", rest: "como fundamento de todo lo que hacemos." },
                { bold: "La oración", rest: "como estilo de vida." },
                { bold: "La unidad", rest: "del cuerpo de Cristo." },
                { bold: "El servicio", rest: "como expresión de amor." },
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
          </ScrollReveal>
        </ContentNarrow>
      </ContentBlock>
    </>
  );
}
