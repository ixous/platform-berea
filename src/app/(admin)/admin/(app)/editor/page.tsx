import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/rbac";
import { db } from "@/lib/db";
import {
  institutionalPages,
  institutionalSections,
  pages,
  contact,
  donations,
  annualVision,
  leaders,
  ministries,
  serviceMinistries,
  cells,
  biblicalPrograms,
  devotionals,
  events,
  historyMilestones,
  homepageSettings,
  doctrines,
} from "@/lib/db/schema";
import { eq, and, isNull, asc, desc, gte } from "drizzle-orm";
import { PageHeader } from "@/components/shared/PageHeader";
import { ExternalLink } from "lucide-react";
import { EditorClient } from "./editor-client";
import type { PageEntry } from "./editor-client";

const ALL_PAGES: PageEntry[] = [
  { slug: "inicio", label: "Inicio", entityType: "homepage", category: "Principal" },
  {
    slug: "quienes-somos",
    label: "Quiénes Somos",
    entityType: "institutionalPage",
    category: "Institucional",
  },
  {
    slug: "nuestra-doctrina",
    label: "Nuestra Doctrina",
    entityType: "doctrines-list",
    category: "Institucional",
  },
  { slug: "historia", label: "Historia", entityType: "history", category: "Institucional" },
  { slug: "liderazgo", label: "Liderazgo", entityType: "leaders-list", category: "Institucional" },
  {
    slug: "ministerios-de-servicio",
    label: "Ministerios de Servicio",
    entityType: "service-ministries-list",
    category: "Ministerios",
  },
  {
    slug: "ministerios-activos",
    label: "Ministerios Activos",
    entityType: "ministries-list",
    category: "Ministerios",
  },
  { slug: "celulas", label: "Células", entityType: "cells-list", category: "Comunidad" },
  {
    slug: "formacion-biblica",
    label: "Formación Bíblica",
    entityType: "biblical-programs-list",
    category: "Comunidad",
  },
  {
    slug: "devocionales",
    label: "Devocionales",
    entityType: "devotionals-list",
    category: "Contenido",
  },
  { slug: "eventos", label: "Eventos", entityType: "events-list", category: "Contenido" },
  {
    slug: "vision-anual",
    label: "Visión Anual",
    entityType: "annual-vision",
    category: "Institucional",
  },
  { slug: "contacto", label: "Contacto", entityType: "contact", category: "Comunidad" },
  { slug: "donaciones", label: "Donaciones", entityType: "donations", category: "Principal" },
];

const CATEGORIES = ["Principal", "Institucional", "Ministerios", "Comunidad", "Contenido"];

async function fetchPageData(slug: string, entityType: string) {
  switch (entityType) {
    case "homepage": {
      const [settings] = await db.select().from(homepageSettings).limit(1);
      return { banner: null, settings: settings ?? {} };
    }
    case "institutionalPage": {
      const [inst] = await db
        .select()
        .from(institutionalPages)
        .where(eq(institutionalPages.slug, slug))
        .limit(1);
      if (!inst) return { banner: null, error: "Página no encontrada" };
      const sections = await db
        .select()
        .from(institutionalSections)
        .where(
          and(
            eq(institutionalSections.pageSlug, slug),
            eq(institutionalSections.status, "published")
          )
        )
        .orderBy(asc(institutionalSections.displayOrder));
      return {
        banner: {
          title: inst.bannerTitle || "",
          subtitle: inst.bannerSubtitle || "",
          backgroundImage: inst.bannerImage || "",
        },
        page: inst,
        sections,
      };
    }
    case "history": {
      const [page] = await db
        .select()
        .from(pages)
        .where(eq(pages.slug, "nuestra-historia"))
        .limit(1);
      const milestones = await db
        .select()
        .from(historyMilestones)
        .where(and(eq(historyMilestones.status, "published"), isNull(historyMilestones.deletedAt)))
        .orderBy(asc(historyMilestones.displayOrder));
      const hBanner = await fetchInstitutionalBanner("nuestra-historia");
      return {
        banner: hBanner || {
          title: "Nuestra Historia",
          subtitle: "Una historia de fe, crecimiento y propósito.",
          backgroundImage: "/images/banner-berea.png",
        },
        content: page?.content || "",
        milestones,
      };
    }
    case "doctrines-list": {
      const items = await db
        .select()
        .from(doctrines)
        .where(eq(doctrines.status, "published"))
        .orderBy(asc(doctrines.displayOrder));
      const dBanner = await fetchInstitutionalBanner("nuestra-doctrina");
      return {
        banner: dBanner || {
          title: "Nuestra Doctrina",
          subtitle: "Fundamentos bíblicos de nuestra fe.",
          backgroundImage: "/images/banner-doctrina.png",
        },
        items,
        entityTypeSlug: "doctrines",
      };
    }
    case "leaders-list": {
      const items = await db
        .select()
        .from(leaders)
        .where(and(eq(leaders.status, "published"), isNull(leaders.deletedAt)))
        .orderBy(asc(leaders.displayOrder));
      const [inst] = await db
        .select()
        .from(institutionalPages)
        .where(eq(institutionalPages.slug, "liderazgo"))
        .limit(1);
      return {
        banner: {
          title: inst?.bannerTitle || "Liderazgo",
          subtitle: inst?.bannerSubtitle || "Conoce a quienes guían nuestra iglesia.",
          backgroundImage: inst?.bannerImage || null,
        },
        items: items.map((i) => ({ ...i, imageUrl: i.imageUrl ?? null })),
        entityTypeSlug: "leaders",
      };
    }
    case "ministries-list": {
      const items = await db
        .select()
        .from(ministries)
        .where(and(eq(ministries.status, "active"), isNull(ministries.deletedAt)))
        .orderBy(asc(ministries.displayOrder));
      const mBanner = await fetchInstitutionalBanner("ministerios-activos");
      return {
        banner: mBanner || {
          title: "Ministerios Activos",
          subtitle: "Descubre tu lugar para servir.",
          backgroundImage: "/images/banner-ministerios.png",
        },
        items,
        entityTypeSlug: "ministries",
      };
    }
    case "service-ministries-list": {
      const items = await db
        .select()
        .from(serviceMinistries)
        .where(and(eq(serviceMinistries.status, "published"), isNull(serviceMinistries.deletedAt)))
        .orderBy(asc(serviceMinistries.displayOrder));
      const smBanner = await fetchInstitutionalBanner("ministerios-de-servicio");
      return {
        banner: smBanner || {
          title: "Ministerios de Servicio",
          subtitle: "Donde tus dones pueden marcar la diferencia.",
          backgroundImage: "/images/banner-berea.png",
        },
        items,
        entityTypeSlug: "serviceMinistries",
      };
    }
    case "cells-list": {
      const items = await db
        .select()
        .from(cells)
        .where(and(eq(cells.status, "active"), isNull(cells.deletedAt)))
        .orderBy(asc(cells.name));
      const cBanner = await fetchInstitutionalBanner("celulas");
      return {
        banner: cBanner || {
          title: "Células",
          subtitle: "Encuentra una célula cercana y crece en comunidad.",
          backgroundImage: "/images/banner-celulas.png",
        },
        items,
        entityTypeSlug: "cells",
      };
    }
    case "biblical-programs-list": {
      const items = await db
        .select()
        .from(biblicalPrograms)
        .where(and(eq(biblicalPrograms.status, "published"), isNull(biblicalPrograms.deletedAt)))
        .orderBy(asc(biblicalPrograms.displayOrder));
      const bpBanner = await fetchInstitutionalBanner("formacion-biblica");
      return {
        banner: bpBanner || {
          title: "Formación Bíblica",
          subtitle: "Crece en el conocimiento de la Palabra.",
          backgroundImage: "/images/banner-formacion-biblica.png",
        },
        items,
        entityTypeSlug: "biblicalPrograms",
      };
    }
    case "devotionals-list": {
      const items = await db
        .select()
        .from(devotionals)
        .where(and(eq(devotionals.status, "published"), isNull(devotionals.deletedAt)))
        .orderBy(desc(devotionals.publishedAt))
        .limit(20);
      const dVBanner = await fetchInstitutionalBanner("devocionales");
      return {
        banner: dVBanner || {
          title: "Devocionales",
          subtitle: "Reflexiones bíblicas para tu crecimiento.",
          backgroundImage: "/images/banner-devocionales.png",
        },
        items,
        entityTypeSlug: "devotionals",
      };
    }
    case "events-list": {
      const items = await db
        .select()
        .from(events)
        .where(
          and(
            eq(events.status, "published"),
            isNull(events.deletedAt),
            gte(events.startDate, new Date())
          )
        )
        .orderBy(asc(events.startDate))
        .limit(20);
      const eBanner = await fetchInstitutionalBanner("eventos");
      return {
        banner: eBanner || {
          title: "Eventos",
          subtitle: "Mantente al día con nuestras actividades.",
          backgroundImage: "/images/banner-eventos.png",
        },
        items,
        entityTypeSlug: "events",
      };
    }
    case "annual-vision": {
      const [vision] = await db
        .select()
        .from(annualVision)
        .where(eq(annualVision.status, "published"))
        .orderBy(desc(annualVision.year))
        .limit(1);
      const avBanner = await fetchInstitutionalBanner("vision-anual");
      return {
        banner: avBanner || {
          title: "Visión Anual",
          subtitle: "Lo que Dios nos ha encomendado este año.",
          backgroundImage: null,
        },
        vision: vision ?? null,
      };
    }
    case "contact": {
      const [info] = await db.select().from(contact).limit(1);
      return {
        banner: await fetchInstitutionalBanner("contacto"),
        info: info ?? null,
      };
    }
    case "donations": {
      const [info] = await db
        .select()
        .from(donations)
        .where(eq(donations.status, "active"))
        .limit(1);
      return {
        banner: await fetchInstitutionalBanner("donaciones"),
        info: info ?? null,
      };
    }
    default:
      return { banner: null, error: "Tipo de página desconocido" };
  }
}

async function fetchInstitutionalBanner(slug: string) {
  const [inst] = await db
    .select()
    .from(institutionalPages)
    .where(eq(institutionalPages.slug, slug))
    .limit(1);
  return inst
    ? {
        title: inst.bannerTitle || "",
        subtitle: inst.bannerSubtitle || "",
        backgroundImage: inst.bannerImage || "",
      }
    : null;
}

export default async function EditorPage(props: { searchParams: Promise<{ page?: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const allowed = await hasPermission("homepage.manage");
  if (!allowed) redirect("/admin");

  const { page: rawPage } = await props.searchParams;
  const selectedSlug = rawPage || "inicio";
  const pageEntry = ALL_PAGES.find((p) => p.slug === selectedSlug) || ALL_PAGES[0];

  const pageData = await fetchPageData(pageEntry.slug, pageEntry.entityType);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Editor Visual"
          description="Selecciona una página y edita su contenido visualmente."
        />
        {pageEntry.slug !== "inicio" && (
          <Link
            href={`/${pageEntry.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" />
            Ver sitio
          </Link>
        )}
        {pageEntry.slug === "inicio" && (
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" />
            Ver sitio
          </Link>
        )}
      </div>

      <EditorClient
        pages={ALL_PAGES}
        categories={CATEGORIES}
        selectedSlug={selectedSlug}
        selectedEntityType={pageEntry.entityType}
        pageData={pageData as Record<string, unknown>}
      />
    </div>
  );
}
