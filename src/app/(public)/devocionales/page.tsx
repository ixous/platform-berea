import { db } from "@/lib/db";
import { devotionals } from "@/lib/db/schema";
import { and, isNull, eq, desc } from "drizzle-orm";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock } from "@/components/public/ContentBlock";
import { MediaCard } from "@/components/public/MediaCard";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { getEntityMediaMap } from "@/lib/db/media-helpers";
import type { Metadata } from "next";

interface DevotionalItem {
  title: string;
  excerpt: string | null;
  verse: string | null;
  id?: string;
  slug?: string;
}

export const metadata: Metadata = {
  title: "Devocionales",
  description:
    "Reflexiones bíblicas para tu crecimiento espiritual. Devocionales de Centro Cristiano Berea.",
};

async function getDevotionals() {
  return db
    .select()
    .from(devotionals)
    .where(and(eq(devotionals.status, "published"), isNull(devotionals.deletedAt)))
    .orderBy(desc(devotionals.publishedAt))
    .limit(20);
}

const sampleDevotionals: DevotionalItem[] = [
  {
    title: "El Fundamento de Nuestra Fe",
    excerpt:
      "La Palabra de Dios es la roca sólida sobre la cual edificamos nuestra vida espiritual. En un mundo de constantes cambios y doctrinas variables, la Biblia permanece como nuestra guía infalible y nuestra fuente de verdad eterna. Cada página nos revela el carácter de Dios, su amor por la humanidad y su plan perfecto de redención. Al meditar en las Escrituras, encontramos dirección para cada decisión, consuelo en medio de la prueba y esperanza para el futuro.",
    verse:
      "Mateo 7:24 — 'Todo aquel que oye estas palabras mías y las pone en práctica, será semejante a un hombre prudente que edificó su casa sobre la roca.'",
  },
  {
    title: "El Poder de la Oración",
    excerpt:
      "La oración no es solo una práctica religiosa; es el medio por el cual nos conectamos con el Dios vivo. Es el puente que une nuestro corazón con el corazón del Padre. A través de la oración, depositamos nuestras cargas, recibimos dirección celestial y experimentamos la paz que sobrepasa todo entendimiento. La oración persistente y sincera tiene el poder de transformar circunstancias, renovar mentes y abrir puertas que parecían cerradas.",
    verse:
      "Filipenses 4:6-7 — 'Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias.'",
  },
  {
    title: "Andando en Unidad",
    excerpt:
      "La unidad del cuerpo de Cristo no es opcional; es un mandamiento y un testimonio al mundo de que Jesús fue enviado por el Padre. Cuando los creyentes caminan en armonía, reflejan la naturaleza misma de Dios, quien es unidad en diversidad. La unidad no significa uniformidad, sino trabajar juntos con un mismo propósito, amándonos unos a otros, soportándonos en amor y edificándonos mutuamente.",
    verse:
      "Salmo 133:1 — 'Mirad cuán bueno y cuán delicioso es habitar los hermanos juntos en armonía.'",
  },
  {
    title: "El Gozo del Servicio",
    excerpt:
      "Servir a Dios y a los demás no es una carga, sino un privilegio que trae gozo y satisfacción al alma. Cuando usamos nuestros dones y talentos para bendecir a otros, experimentamos la alegría que viene de sembrar en el Reino de Dios. El servicio desinteresado nos transforma, nos hace más parecidos a Cristo y nos permite ser parte de lo que Dios está haciendo en el mundo.",
    verse:
      "1 Pedro 4:10 — 'Cada uno según el don que ha recibido, minístrelo a los otros, como buenos administradores de la multiforme gracia de Dios.'",
  },
  {
    title: "Esperanza en Tiempos Difíciles",
    excerpt:
      "Las pruebas y dificultades son parte de la vida, pero como creyentes no enfrentamos estas circunstancias sin esperanza. Nuestra esperanza no está en las circunstancias cambiantes, sino en el Dios inmutable que ha prometido nunca dejarnos ni desampararnos. En medio de la tormenta, podemos confiar que Dios está obrando para nuestro bien y que su gracia es suficiente para sostenernos.",
    verse:
      "Romanos 15:13 — 'Y el Dios de esperanza os llene de todo gozo y paz en el creer, para que abundéis en esperanza por el poder del Espíritu Santo.'",
  },
  {
    title: "Crecimiento Espiritual",
    excerpt:
      "El crecimiento espiritual es un proceso continuo que requiere disciplina, dedicación y dependencia del Espíritu Santo. Así como un árbol necesita raíces profundas para dar buen fruto, nosotros necesitamos estar firmemente plantados en la Palabra de Dios, en la oración y en la comunión con otros creyentes. Cada temporada trae nuevas oportunidades para crecer, aprender y madurar en nuestra fe.",
    verse:
      "2 Pedro 3:18 — 'Antes bien, creced en la gracia y el conocimiento de nuestro Señor y Salvador Jesucristo.'",
  },
];

export default async function DevocionalesPage() {
  const items = await getDevotionals();
  const mediaMap = await getEntityMediaMap(
    "devotional",
    items.map((d) => d.id)
  );

  const hasData = items.length > 0;
  const displayItems = hasData ? items : sampleDevotionals;

  return (
    <>
      <PageBanner
        title="Devocionales"
        subtitle="Reflexiones bíblicas para tu crecimiento."
        backgroundImage="/images/banner-devocionales.png"
      />

      <ContentBlock variant="gold-mist">
        <ScrollReveal animation="fade-up">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-berea-navy sm:text-4xl">
              Devocionales
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-berea-muted">
              Reflexiones bíblicas semanales para edificar tu vida espiritual.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="stagger" staggerItems delay={150} className="mt-16">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {displayItems.map((d: DevotionalItem) => {
              const img = hasData ? mediaMap.get(d.id!) : null;
              return (
                <MediaCard
                  key={d.title || d.id}
                  title={d.title}
                  description={d.excerpt || d.verse || null}
                  imageUrl={img?.mediaUrl || img?.thumbnailUrl}
                  href={hasData ? `/devocionales/${d.slug}` : undefined}
                  category="Devocional"
                  meta={<p className="text-xs text-berea-muted italic">{d.verse}</p>}
                />
              );
            })}
          </div>
        </ScrollReveal>
      </ContentBlock>
    </>
  );
}
