import { db } from "@/lib/db";
import { events, contact, homepageSettings, homepageSections, annualVision } from "@/lib/db/schema";
import { eq, and, isNull, gte } from "drizzle-orm";
import { HomeHero } from "@/components/public/HomeHero";
import { VisionRhema } from "@/components/public/VisionRhema";
import { VisitStrip } from "@/components/public/VisitStrip";
import { EditorialIntro } from "@/components/public/EditorialIntro";
import { ConnectWithBerea } from "@/components/public/ConnectWithBerea";
import { UpcomingEventsSection } from "@/components/public/UpcomingEventsSection";
import { HERO_PRIMARY_CTA, HERO_CLIPS, HERO_POSTER_FALLBACK } from "@/lib/public/site-navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "Sitio web oficial de Centro Cristiano Berea. Una iglesia comprometida con la Palabra de Dios, ubicada en Mexicali, Baja California, México.",
  openGraph: {
    title: "Centro Cristiano Berea | Mexicali, Baja California",
    description:
      "Sitio web oficial de Centro Cristiano Berea. Una iglesia comprometida con la Palabra de Dios.",
  },
};

async function getUpcomingEvents() {
  return db
    .select()
    .from(events)
    .where(
      and(
        eq(events.status, "published"),
        isNull(events.deletedAt),
        gte(events.startDate, new Date())
      )
    )
    .orderBy(events.startDate)
    .limit(4);
}

async function getHomepageData() {
  const [settings] = await db.select().from(homepageSettings).limit(1);
  const [info] = await db.select().from(contact).limit(1);
  const sections = await db.select().from(homepageSections);
  const [vision] = await db
    .select()
    .from(annualVision)
    .where(and(eq(annualVision.status, "published"), eq(annualVision.year, 2026)))
    .limit(1);
  return { settings, info, sections, vision };
}

type SectionRow = { sectionKey: string; visible: boolean | null };

function isSectionVisible(sections: SectionRow[], key: string): boolean {
  if (sections.length === 0) return true;
  const section = sections.find((s) => s.sectionKey === key);
  return section ? section.visible !== false : true;
}

export default async function HomePage() {
  const [upcomingEvents, { settings, info, sections, vision }] = await Promise.all([
    getUpcomingEvents(),
    getHomepageData(),
  ]);

  const schedules = (info?.schedules as { day?: string; time?: string }[] | null) ?? null;

  return (
    <>
      <HomeHero
        tagline={settings?.heroTagline || "BIENVENIDOS"}
        title={settings?.heroTitle || "Centro Cristiano Berea"}
        subtitle={
          settings?.heroSubtitle ||
          "Un lugar para conocer a Cristo, crecer en Su Palabra y servir con propósito."
        }
        primaryCta={HERO_PRIMARY_CTA}
        clips={HERO_CLIPS}
        poster={settings?.heroBackgroundImage || HERO_POSTER_FALLBACK}
        visionBadge={
          vision?.name ? `Visión ${vision.year} · ${vision.name}` : "Visión 2026 · RHEMA"
        }
      />

      <VisionRhema
        title={vision?.name || "RHEMA"}
        tagline={`Visión ${vision?.year || 2026}`}
        description={
          vision?.description ||
          "Una palabra viva, revelada y eficaz de Dios para nuestra congregación en este nuevo tiempo."
        }
      />

      <VisitStrip
        schedules={schedules}
        address={info?.address}
        mapUrl={info?.mapUrl}
        scheduleNote={info?.scheduleNote}
      />

      {isSectionVisible(sections, "welcome") && (
        <EditorialIntro
          title={settings?.welcomeTitle || "Una familia que vive para Cristo"}
          description={
            settings?.welcomeDescription ||
            "En Centro Cristiano Berea creemos que cada persona puede encontrar esperanza, propósito y una familia espiritual en Cristo. Nuestra misión es enseñar fielmente la Palabra de Dios, formar discípulos y servir a nuestra comunidad con amor."
          }
          cta={{ label: settings?.welcomeCtaText || "Conócenos", href: "/conocenos" }}
        />
      )}

      <ConnectWithBerea />

      {isSectionVisible(sections, "events") && upcomingEvents.length > 0 && (
        <UpcomingEventsSection events={upcomingEvents} />
      )}
    </>
  );
}
