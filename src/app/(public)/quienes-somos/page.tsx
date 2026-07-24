import { db } from "@/lib/db";
import { pages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock } from "@/components/public/ContentBlock";
import { MediaCard } from "@/components/public/MediaCard";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quienes Somos",
  description:
    "Conoce la identidad, misión y visión de Centro Cristiano Berea en Mexicali, Baja California.",
  openGraph: {
    title: "Quienes Somos | Centro Cristiano Berea",
    description:
      "Conoce la identidad, misión y visión de Centro Cristiano Berea en Mexicali, Baja California.",
  },
};

async function getPage(slug: string) {
  const [page] = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
  return page;
}

export default async function QuienesSomosPage() {
  const page = await getPage("quienes-somos");
  if (!page) notFound();

  const coreCards = [
    {
      title: "Nuestra Identidad",
      description: page.content
        ? page.content
        : "Centro Cristiano Berea es una iglesia cristiana ubicada en Mexicali, Baja California, México. Somos una comunidad de fe comprometida con la Palabra de Dios y con el amor al prójimo. Creemos en el poder transformador del Evangelio y trabajamos para que cada persona pueda experimentar una relación personal con Jesucristo.",
    },
    {
      title: "Misión",
      description:
        "Formar discípulos de Cristo, fortalecer familias y extender el Reino de Dios en nuestra comunidad y más allá, a través de la predicación de la Palabra, la adoración genuina y el servicio amoroso. Cada miembro de nuestra congregación es equipado para cumplir el propósito que Dios ha diseñado para su vida.",
    },
    {
      title: "Visión",
      description:
        "Ser una iglesia que impacta a Mexicali y al mundo con el mensaje de Cristo, formando líderes comprometidos, familias sólidas y una comunidad que refleje el amor de Dios en cada área de la vida. Anhelamos ver vidas transformadas, hogares restaurados y una ciudad alcanzada por el Evangelio.",
    },
    {
      title: "Valores",
      description:
        "La Palabra de Dios como fundamento de todo lo que hacemos. La oración como estilo de vida. La unidad del cuerpo de Cristo. El servicio como expresión de amor. La excelencia para la gloria de Dios. Estos valores nos guían en cada decisión y nos mantienen firmes en nuestra identidad como iglesia.",
    },
  ];

  return (
    <>
      <PageBanner
        title="Quienes Somos"
        subtitle="Conoce nuestra identidad, misión y visión."
        backgroundImage="/images/banner-quienes-somos.png"
      />

      <ContentBlock variant="gold-mist">
        <ScrollReveal animation="fade-up">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-berea-navy sm:text-4xl">
              Una Iglesia con Propósito
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-berea-muted">
              Centro Cristiano Berea es una familia espiritual comprometida con la Palabra de Dios,
              el amor al prójimo y la transformación de nuestra comunidad.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="stagger" staggerItems delay={150} className="mt-16">
          <div className="grid gap-8 sm:grid-cols-2">
            {coreCards.map((card) => (
              <MediaCard key={card.title} title={card.title} description={card.description} />
            ))}
          </div>
        </ScrollReveal>
      </ContentBlock>
    </>
  );
}
