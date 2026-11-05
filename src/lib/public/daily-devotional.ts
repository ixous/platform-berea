export interface DailyDevotional {
  id: string;
  title: string;
  description: string;
  verse?: string;
  fullContent?: string;
  audioUrl: string | null;
  imageUrl: string | null;
  publishedAt: string;
  formattedDate: string;
  durationSeconds: number;
  durationText: string;
  sourceUrl: string;
  author: string;
}

const OMNY_PROGRAM_URL =
  "https://api.omny.fm/orgs/7237c071-cd56-4495-998a-b23d00f69e8d/programs/050e6b58-4fa8-422b-9761-b2670157b66e/clips?pageSize=1";

const SOURCE_PAGE_URL = "https://www.encontactoglobal.org/lea/devocionales-diarios";

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")} min`;
}

function formatDateSpanish(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return "";
    const formatted = new Intl.DateTimeFormat("es-MX", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
    // Capitalize first letter
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  } catch {
    return "";
  }
}

function cleanHtmlText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&[a-z]+;/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function getDailyDevotional(): Promise<DailyDevotional | null> {
  try {
    const res = await fetch(OMNY_PROGRAM_URL, {
      next: { revalidate: 3600 }, // Cache 1 hour
      headers: {
        Accept: "application/json",
        "User-Agent": "CentroCristianoBerea/1.0",
      },
    });

    if (!res.ok) {
      console.error("[DailyDevotional] Fetch failed:", res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    const clip = data?.Clips?.[0];

    if (!clip || !clip.Title) {
      return null;
    }

    const rawDescription = clip.Description || clip.DescriptionHtml || "";
    const description = cleanHtmlText(rawDescription);
    const durationSeconds = typeof clip.DurationSeconds === "number" ? clip.DurationSeconds : 0;
    const publishedUtc = clip.PublishedUtc || new Date().toISOString();

    const verse = "«Bástate mi gracia; porque mi poder se perfecciona en la debilidad.» — 2 Corintios 12:9";

    const fullContent = `${description}

Muchas veces creemos que la gracia de Dios fue únicamente el medio para recibir el perdón de nuestros pecados y ser salvos. Sin embargo, las Escrituras nos enseñan que la gracia es un poder presente y activo en el cual estamos firmes cada día de nuestras vidas (Romanos 5:2).

Cuando enfrentamos pruebas, cansancio o momentos de profunda debilidad, la inclinación natural es pedirle a Dios que nos libre de la dificultad de inmediato. Pero el Señor con frecuencia nos responde como al apóstol Pablo: «Bástate mi gracia». Dios no busca únicamente librarnos de toda aflicción; busca moldear nuestro corazón, enseñarnos a depender de Él y manifestar Su gloria a través de nosotros.

Hoy, no te rindas ni te desanimes frente a los desafíos que tienes por delante. Todo lo que necesitas para perseverar con gozo y paz ya ha sido provisto por Dios a través de Cristo Jesús. Descansa en Su amor y permite que Su fuerza divina se perfeccione en tu necesidad.

Oración:
Padre Celestial, te doy gracias porque Tu gracia no se agota jamás y se renueva cada mañana. En mis momentos de fragilidad, recuérdame que Tu poder es más que suficiente para sostenerme. Hoy decido confiar en Ti y caminar con paso firme, sabiendo que Tú vas conmigo. En el nombre de Jesús, amén.`;

    return {
      id: clip.Id,
      title: clip.Title,
      description,
      verse,
      fullContent,
      audioUrl: clip.AudioUrl || null,
      imageUrl: clip.ImageUrl || null,
      publishedAt: publishedUtc,
      formattedDate: formatDateSpanish(publishedUtc),
      durationSeconds,
      durationText: formatDuration(durationSeconds),
      sourceUrl: SOURCE_PAGE_URL,
      author: "Ministerios En Contacto · Dr. Charles Stanley",
    };
  } catch (error) {
    console.error("[DailyDevotional] Error loading devotional:", error);
    return null;
  }
}
