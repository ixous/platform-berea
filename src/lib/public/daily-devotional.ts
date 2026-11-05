export interface DailyDevotional {
  id: string;
  title: string;
  description: string;
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

    return {
      id: clip.Id,
      title: clip.Title,
      description,
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
