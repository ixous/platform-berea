import { db } from "@/lib/db";
import { pages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PageBanner } from "@/components/public/PageBanner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuestra Doctrina",
  description:
    "Conoce las bases doctrinales de Centro Cristiano Berea. Nuestra fe est\u00e1 fundamentada en la Palabra de Dios.",
};

async function getPage() {
  const [page] = await db.select().from(pages).where(eq(pages.slug, "nuestra-doctrina")).limit(1);
  return page;
}

const doctrinalPoints = [
  {
    title: "La Biblia",
    desc: "Creemos que la Biblia es la Palabra de Dios, inspirada, infalible y nuestra \u00fanica regla de fe y conducta.",
  },
  {
    title: "Dios",
    desc: "Creemos en un solo Dios, eterno, omnipotente, omnisciente y omnipresente, que existe en tres personas: Padre, Hijo y Esp\u00edritu Santo.",
  },
  {
    title: "Jesucristo",
    desc: "Creemos en la deidad de Jesucristo, su nacimiento virginal, su vida sin pecado, su muerte expiatoria, su resurrecci\u00f3n corporal y su Segunda Venida.",
  },
  {
    title: "El Esp\u00edritu Santo",
    desc: "Creemos en la persona y obra del Esp\u00edritu Santo, quien convence, regenera, santifica y capacita al creyente.",
  },
  {
    title: "La Salvaci\u00f3n",
    desc: "Creemos que la salvaci\u00f3n es por gracia mediante la fe en Jesucristo, no por obras.",
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
      <PageBanner title="Nuestra Doctrina" subtitle="Los fundamentos de nuestra fe." />

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 sm:grid-cols-2">
            {doctrinalPoints.map((p) => (
              <div key={p.title} className="rounded-lg border border-berea-border bg-white p-6">
                <h3 className="text-lg font-bold text-berea-navy">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-berea-muted">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
