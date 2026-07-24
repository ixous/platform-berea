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
  title: "Nuestra Doctrina",
  description:
    "Conoce las bases doctrinales de Centro Cristiano Berea. Nuestra fe está fundamentada en la Palabra de Dios.",
};

async function getPage() {
  const [page] = await db.select().from(pages).where(eq(pages.slug, "nuestra-doctrina")).limit(1);
  return page;
}

const doctrinalPoints = [
  {
    title: "La Biblia",
    desc: "Creemos que la Biblia es la Palabra de Dios, inspirada, infalible y nuestra única regla de fe y conducta.",
  },
  {
    title: "Dios",
    desc: "Creemos en un solo Dios, eterno, omnipotente, omnisciente y omnipresente, que existe en tres personas: Padre, Hijo y Espíritu Santo.",
  },
  {
    title: "Jesucristo",
    desc: "Creemos en la deidad de Jesucristo, su nacimiento virginal, su vida sin pecado, su muerte expiatoria, su resurrección corporal y su Segunda Venida.",
  },
  {
    title: "El Espíritu Santo",
    desc: "Creemos en la persona y obra del Espíritu Santo, quien convence, regenera, santifica y capacita al creyente.",
  },
  {
    title: "La Salvación",
    desc: "Creemos que la salvación es por gracia mediante la fe en Jesucristo, no por obras.",
  },
  {
    title: "La Iglesia",
    desc: "Creemos que la Iglesia es el cuerpo de Cristo, llamada a adorar, edificar y proclamar el Evangelio.",
  },
];

export default async function DoctrinaPage() {
  const page = await getPage();
  if (!page) notFound();

  return (
    <>
      <PageBanner
        title="Nuestra Doctrina"
        subtitle="Los fundamentos de nuestra fe."
        backgroundImage="/images/banner-doctrina.png"
      />

      <ContentBlock variant="gold-mist">
        <ScrollReveal animation="fade-up">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-berea-navy sm:text-4xl">
              Puntos Doctrinales
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-berea-muted">
              Nuestra fe está fundamentada en la Palabra de Dios. Estos son los pilares que nos
              sostienen como iglesia.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="stagger" staggerItems delay={150} className="mt-16">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {doctrinalPoints.map((p) => (
              <MediaCard key={p.title} title={p.title} description={p.desc} />
            ))}
          </div>
        </ScrollReveal>
      </ContentBlock>
    </>
  );
}
