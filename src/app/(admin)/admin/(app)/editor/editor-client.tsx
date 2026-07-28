"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { VisualEditorShell, VisualBlock, type BlockConfig } from "@/components/visual-editor";
import { useVisualEditor } from "@/components/visual-editor/VisualEditorContext";

import type { BlockField } from "@/components/visual-editor/VisualEditorContext";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock, ContentNarrow } from "@/components/public/ContentBlock";
import { MediaCard } from "@/components/public/MediaCard";
import {
  Heart,
  Sparkles,
  Church,
  Users,
  MapPin,
  CalendarDays,
  BookOpen,
  Phone,
  Mail,
  Home,
  GraduationCap,
  HandHeart,
  Eye,
  Quote,
  ArrowRight,
} from "lucide-react";
import {
  saveInstitutionalPageBanner,
  savePageIntro,
  saveContactInfo,
  saveDonationInfo,
  saveAnnualVision,
  saveEntityBlock,
} from "@/lib/cms/editor-actions";

export interface PageEntry {
  slug: string;
  label: string;
  entityType: string;
  category: string;
}

interface EntityItem {
  id: string;
  title?: string;
  name?: string;
  description?: string | null;
  imageUrl?: string | null;
  [key: string]: unknown;
}

const BANNER_BLOCK = (): BlockConfig => ({
  key: "banner",
  label: "Banner",
  fields: [
    { name: "title", label: "Título del banner", type: "text" },
    { name: "subtitle", label: "Subtítulo del banner", type: "textarea" },
    { name: "backgroundImage", label: "Imagen de fondo", type: "image" },
  ],
});

const ENTITY_EDIT_FIELDS: Record<string, BlockField[]> = {
  leaders: [
    { name: "name", label: "Nombre", type: "text" },
    { name: "position", label: "Cargo", type: "text" },
    { name: "biography", label: "Biografía", type: "textarea" },
    { name: "imageUrl", label: "Fotografía", type: "image" },
  ],
  devotionals: [
    { name: "title", label: "Título", type: "text" },
    { name: "excerpt", label: "Extracto", type: "textarea" },
    { name: "verse", label: "Versículo", type: "textarea" },
  ],
  events: [
    { name: "title", label: "Título", type: "text" },
    { name: "description", label: "Descripción", type: "textarea" },
    { name: "time", label: "Hora", type: "text" },
    { name: "location", label: "Ubicación", type: "text" },
  ],
  ministries: [
    { name: "name", label: "Nombre", type: "text" },
    { name: "description", label: "Descripción", type: "textarea" },
    { name: "leader", label: "Líder", type: "text" },
    { name: "schedule", label: "Horario", type: "text" },
  ],
  serviceMinistries: [
    { name: "name", label: "Nombre", type: "text" },
    { name: "description", label: "Descripción", type: "textarea" },
    { name: "leader", label: "Líder", type: "text" },
    { name: "imageUrl", label: "Imagen", type: "image" },
  ],
  cells: [
    { name: "name", label: "Nombre", type: "text" },
    { name: "leader", label: "Líder", type: "text" },
    { name: "address", label: "Dirección", type: "text" },
    { name: "description", label: "Descripción", type: "textarea" },
  ],
  biblicalPrograms: [
    { name: "name", label: "Nombre", type: "text" },
    { name: "description", label: "Descripción", type: "textarea" },
    { name: "instructor", label: "Instructor", type: "text" },
  ],
  historyMilestones: [
    { name: "title", label: "Título", type: "text" },
    { name: "year", label: "Año", type: "text" },
    { name: "description", label: "Descripción", type: "textarea" },
    { name: "imageUrl", label: "Imagen", type: "image" },
  ],
  doctrines: [
    { name: "title", label: "Título", type: "text" },
    { name: "subtitle", label: "Subtítulo", type: "text" },
    { name: "content", label: "Contenido", type: "textarea" },
    { name: "imageUrl", label: "Imagen", type: "image" },
  ],
  institutionalSections: [
    { name: "title", label: "Título", type: "text" },
    { name: "content", label: "Contenido", type: "textarea" },
    { name: "imageUrl", label: "Imagen", type: "image" },
    { name: "buttonText", label: "Texto del botón", type: "text" },
    { name: "buttonHref", label: "Enlace del botón", type: "text" },
  ],
};

function renderBanner(blockKey: string, getVal: (key: string) => string) {
  return (
    <VisualBlock blockKey={blockKey} label="Banner">
      <PageBanner
        title={getVal("title") || "Página"}
        subtitle={getVal("subtitle") || undefined}
        backgroundImage={getVal("backgroundImage") || null}
      />
    </VisualBlock>
  );
}

// ─── Homepage ──────────────────────────────────────

const HOMEPAGE_BLOCKS: BlockConfig[] = [
  {
    key: "hero",
    label: "Hero",
    fields: [
      { name: "heroTagline", label: "Tagline", type: "text" },
      { name: "heroTitle", label: "Título principal", type: "text" },
      { name: "heroSubtitle", label: "Subtítulo", type: "textarea" },
      { name: "heroCtaText", label: "Texto botón principal", type: "text" },
      { name: "heroCtaHref", label: "Enlace botón principal", type: "text" },
      { name: "heroSecondaryCtaText", label: "Texto botón secundario", type: "text" },
      { name: "heroSecondaryCtaHref", label: "Enlace botón secundario", type: "text" },
      { name: "heroBackgroundImage", label: "Imagen de fondo", type: "image" },
    ],
  },
  {
    key: "welcome",
    label: "Bienvenida",
    fields: [
      { name: "welcomeTitle", label: "Título", type: "text" },
      { name: "welcomeDescription", label: "Descripción", type: "textarea" },
      { name: "welcomeCtaText", label: "Texto botón", type: "text" },
      { name: "welcomeCtaHref", label: "Enlace botón", type: "text" },
    ],
  },
  {
    key: "cta",
    label: "CTA Final",
    fields: [
      { name: "ctaTitle", label: "Título", type: "text" },
      { name: "ctaDescription", label: "Descripción", type: "textarea" },
      { name: "ctaButtonText", label: "Texto del botón", type: "text" },
      { name: "ctaButtonHref", label: "Enlace del botón", type: "text" },
      { name: "ctaBackgroundImage", label: "Imagen de fondo", type: "image" },
    ],
  },
];

const HP_DEFAULTS: Record<string, string> = {
  heroTagline: "BIENVENIDOS",
  heroTitle: "Centro Cristiano Berea",
  heroSubtitle: "Un lugar para conocer a Cristo, crecer en Su Palabra y servir con propósito.",
  heroCtaText: "Conócenos",
  heroCtaHref: "/quienes-somos",
  heroSecondaryCtaText: "Horarios de Servicio",
  heroSecondaryCtaHref: "/contacto",
  heroBackgroundImage: "/images/banner-berea.png",
  heroImageAlt: "",
  welcomeTitle: "Una familia que vive para Cristo",
  welcomeDescription:
    "En Centro Cristiano Berea creemos que cada persona puede encontrar esperanza, propósito y una familia espiritual en Cristo.",
  welcomeCtaText: "Quienes Somos",
  welcomeCtaHref: "/quienes-somos",
  ctaTitle: "Visítanos",
  ctaDescription:
    "Nos encantaría recibirte en nuestra iglesia. Ven tal como eres y descubre una comunidad que te amará y te apoyará en tu caminar con Cristo.",
  ctaButtonText: "Ubicación y horarios",
  ctaButtonHref: "/contacto",
};

function renderHomepage(getVal: (key: string) => string) {
  return (
    <>
      <VisualBlock blockKey="hero" label="Hero">
        <section className="relative flex min-h-[460px] items-center justify-center overflow-hidden bg-berea-navy sm:min-h-[560px]">
          {getVal("heroBackgroundImage") && (
            <>
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getVal("heroBackgroundImage")}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            </>
          )}
          <div className="relative z-10 mx-auto max-w-5xl px-4 py-24 text-center sm:px-6">
            {getVal("heroTagline") && (
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-berea-gold">
                {getVal("heroTagline")}
              </p>
            )}
            <h1 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-7xl">
              {getVal("heroTitle")}
            </h1>
            {getVal("heroSubtitle") && (
              <p className="mx-auto mt-8 max-w-3xl text-lg text-white/70">
                {getVal("heroSubtitle")}
              </p>
            )}
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              {getVal("heroCtaText") && (
                <span className="inline-flex items-center gap-2 rounded-lg bg-berea-gold px-7 py-3.5 text-base font-semibold text-white">
                  {getVal("heroCtaText")}
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
              {getVal("heroSecondaryCtaText") && (
                <span className="inline-flex items-center gap-2 rounded-lg border-2 border-white/20 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-sm">
                  {getVal("heroSecondaryCtaText")}
                </span>
              )}
            </div>
          </div>
        </section>
      </VisualBlock>

      <VisualBlock blockKey="welcome" label="Bienvenida">
        <ContentBlock variant="gold-mist">
          <ContentNarrow className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-berea-border/40 bg-white shadow-sm">
              <Heart className="h-10 w-10 text-berea-gold" />
            </div>
            <h2 className="mt-8 text-balance text-3xl font-bold tracking-tight text-berea-navy sm:text-4xl lg:text-5xl">
              {getVal("welcomeTitle")}
            </h2>
            <p className="mx-auto mt-8 max-w-3xl text-pretty text-lg leading-relaxed text-berea-muted">
              {getVal("welcomeDescription")}
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              {getVal("welcomeCtaText") && (
                <span className="inline-flex items-center gap-2 rounded-xl bg-berea-navy px-7 py-3.5 text-sm font-semibold text-white">
                  <Users className="h-4 w-4" />
                  {getVal("welcomeCtaText")}
                </span>
              )}
            </div>
          </ContentNarrow>
        </ContentBlock>
      </VisualBlock>

      <VisualBlock blockKey="cta" label="CTA Final">
        <section className="relative overflow-hidden bg-section-navy-warm">
          <ContentBlock className="relative">
            <ContentNarrow className="text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {getVal("ctaTitle")}
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
                {getVal("ctaDescription")}
              </p>
              <div className="mt-12 flex flex-wrap justify-center gap-4">
                {getVal("ctaButtonText") && (
                  <span className="inline-flex items-center gap-2 rounded-xl bg-berea-gold px-7 py-3.5 text-sm font-semibold text-white">
                    {getVal("ctaButtonText")}
                  </span>
                )}
              </div>
            </ContentNarrow>
          </ContentBlock>
        </section>
      </VisualBlock>
    </>
  );
}

// ─── Institutional Page (Quienes Somos style) ──────

function renderInstitutionalPage(getVal: (key: string) => string, sections: EntityItem[]) {
  return (
    <>
      {renderBanner("banner", getVal)}
      {sections.length > 0 && (
        <ContentBlock variant="gold-mist">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => {
              const blockKey = `entity:institutionalSections:${section.id}`;
              return (
                <VisualBlock key={blockKey} blockKey={blockKey} label={section.title || "Sección"}>
                  <MediaCard
                    title={section.title ?? ""}
                    description={String(section.content ?? "")}
                    imageUrl={section.imageUrl ?? null}
                  />
                </VisualBlock>
              );
            })}
          </div>
        </ContentBlock>
      )}
    </>
  );
}

// ─── History ────────────────────────────────────────

function renderHistory(getVal: (key: string) => string, milestones: EntityItem[]) {
  return (
    <>
      {renderBanner("banner", getVal)}
      <VisualBlock blockKey="intro" label="Introducción">
        <ContentBlock variant="gold-mist">
          <ContentNarrow className="text-center">
            <p className="text-lg leading-relaxed text-berea-muted">{getVal("content")}</p>
          </ContentNarrow>
        </ContentBlock>
      </VisualBlock>
      {milestones.length > 0 && (
        <ContentBlock variant="gold-mist">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {milestones.map((item) => {
              const blockKey = `entity:historyMilestones:${item.id}`;
              return (
                <VisualBlock key={blockKey} blockKey={blockKey} label={item.title || ""}>
                  <MediaCard
                    title={item.title ?? ""}
                    description={item.description ?? ""}
                    imageUrl={item.imageUrl ?? null}
                  />
                </VisualBlock>
              );
            })}
          </div>
        </ContentBlock>
      )}
    </>
  );
}

// ─── Contact ────────────────────────────────────────

const CONTACT_BLOCKS: BlockConfig[] = [
  BANNER_BLOCK(),
  {
    key: "info",
    label: "Información de Contacto",
    fields: [
      { name: "churchName", label: "Nombre de la iglesia", type: "text" },
      { name: "address", label: "Dirección", type: "text" },
      { name: "phone", label: "Teléfono", type: "text" },
      { name: "email", label: "Email", type: "text" },
      { name: "whatsapp", label: "WhatsApp", type: "text" },
      { name: "mapUrl", label: "Google Maps URL", type: "text" },
    ],
  },
];

function renderContact(getVal: (key: string) => string) {
  return (
    <>
      {renderBanner("banner", getVal)}
      <VisualBlock blockKey="info" label="Contacto">
        <ContentBlock variant="warm">
          <ContentNarrow>
            <div className="space-y-4">
              {getVal("churchName") && (
                <p className="text-lg font-semibold">{getVal("churchName")}</p>
              )}
              {getVal("address") && (
                <p className="flex items-center gap-2 text-berea-muted">
                  <MapPin className="h-4 w-4" />
                  {getVal("address")}
                </p>
              )}
              {getVal("phone") && (
                <p className="flex items-center gap-2 text-berea-muted">
                  <Phone className="h-4 w-4" />
                  {getVal("phone")}
                </p>
              )}
              {getVal("email") && (
                <p className="flex items-center gap-2 text-berea-muted">
                  <Mail className="h-4 w-4" />
                  {getVal("email")}
                </p>
              )}
              {getVal("whatsapp") && (
                <p className="text-berea-muted">WhatsApp: {getVal("whatsapp")}</p>
              )}
              {getVal("mapUrl") && <p className="text-sm text-berea-gold">Ver en Google Maps</p>}
            </div>
          </ContentNarrow>
        </ContentBlock>
      </VisualBlock>
    </>
  );
}

// ─── Donations ──────────────────────────────────────

const DONATION_BLOCKS: BlockConfig[] = [
  BANNER_BLOCK(),
  {
    key: "info",
    label: "Información de Donaciones",
    fields: [
      { name: "title", label: "Título", type: "text" },
      { name: "description", label: "Descripción", type: "textarea" },
      { name: "message", label: "Mensaje", type: "textarea" },
      { name: "ctaButtonText", label: "Texto del botón", type: "text" },
      { name: "ctaButtonHref", label: "Enlace del botón", type: "text" },
    ],
  },
];

function renderDonations(getVal: (key: string) => string) {
  return (
    <>
      {renderBanner("banner", getVal)}
      <VisualBlock blockKey="info" label="Donaciones">
        <ContentBlock variant="gold-mist">
          <ContentNarrow className="text-center">
            <Heart className="mx-auto h-12 w-12 text-berea-gold" />
            <h2 className="mt-6 text-3xl font-bold text-berea-navy">
              {getVal("title") || "Donaciones"}
            </h2>
            <p className="mt-4 text-lg text-berea-muted">{getVal("description")}</p>
            {getVal("message") && (
              <p className="mt-4 italic text-berea-muted">{getVal("message")}</p>
            )}
            {getVal("ctaButtonText") && (
              <span className="mt-8 inline-flex items-center gap-2 rounded-xl bg-berea-gold px-7 py-3.5 text-sm font-semibold text-white">
                {getVal("ctaButtonText")}
              </span>
            )}
          </ContentNarrow>
        </ContentBlock>
      </VisualBlock>
    </>
  );
}

// ─── Annual Vision ──────────────────────────────────

const VISION_BLOCKS: BlockConfig[] = [
  {
    key: "vision",
    label: "Visión Anual",
    fields: [
      { name: "name", label: "Nombre", type: "text" },
      { name: "verse", label: "Versículo", type: "textarea" },
      { name: "description", label: "Descripción", type: "textarea" },
    ],
  },
];

function renderVision(getVal: (key: string) => string, year?: number) {
  return (
    <>
      <PageBanner title="Visión Anual" subtitle="Lo que Dios nos ha encomendado este año." />
      <VisualBlock blockKey="vision" label="Visión Anual">
        <ContentBlock variant="gold-mist">
          <ContentNarrow className="text-center">
            {year && (
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-berea-gold/10">
                <Eye className="h-8 w-8 text-berea-gold" />
              </div>
            )}
            <h2 className="mt-6 text-3xl font-bold text-berea-navy">
              {getVal("name") || "Visión"}
            </h2>
            {getVal("verse") && (
              <blockquote className="mt-6 border-l-4 border-berea-gold pl-4 text-left italic text-berea-muted">
                <Quote className="mb-1 h-4 w-4 text-berea-gold" />
                {getVal("verse")}
              </blockquote>
            )}
            <p className="mt-6 text-lg text-berea-muted">{getVal("description")}</p>
          </ContentNarrow>
        </ContentBlock>
      </VisualBlock>
    </>
  );
}

// ─── Entity List ────────────────────────────────────

const iconByEntity: Record<string, React.ReactNode> = {
  leaders: <Users className="h-5 w-5" />,
  ministries: <Church className="h-5 w-5" />,
  serviceMinistries: <HandHeart className="h-5 w-5" />,
  cells: <Home className="h-5 w-5" />,
  biblicalPrograms: <GraduationCap className="h-5 w-5" />,
  devotionals: <BookOpen className="h-5 w-5" />,
  events: <CalendarDays className="h-5 w-5" />,
};

function renderEntityList(
  getVal: (key: string) => string,
  items: EntityItem[],
  entityTypeSlug: string
) {
  const baseFields = ENTITY_EDIT_FIELDS[entityTypeSlug];
  if (!baseFields) {
    return <>{renderBanner("banner", getVal)}</>;
  }

  return (
    <>
      {renderBanner("banner", getVal)}
      {items.length > 0 && (
        <ContentBlock variant="gold-mist">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const blockKey = `entity:${entityTypeSlug}:${item.id}`;
              return (
                <VisualBlock
                  key={blockKey}
                  blockKey={blockKey}
                  label={item.title || item.name || ""}
                >
                  <MediaCard
                    title={(item.title || item.name) ?? ""}
                    description={item.description ?? ""}
                    imageUrl={item.imageUrl ?? null}
                    icon={iconByEntity[entityTypeSlug] ? undefined : Sparkles}
                  />
                </VisualBlock>
              );
            })}
          </div>
        </ContentBlock>
      )}
    </>
  );
}

// ─── Page Config Registry ───────────────────────────

interface PageRenderConfig {
  blocks: BlockConfig[];
  extractInitial: (data: Record<string, unknown>) => Record<string, string>;
  onSave: (blockKey: string, data: Record<string, string>) => Promise<void>;
  render: (getVal: (key: string) => string, data: Record<string, unknown>) => React.ReactNode;
  renderActions?: (blockKey: string, config: BlockConfig) => React.ReactNode;
}

function getEntityCmsType(slug: string): string {
  const map: Record<string, string> = {
    leaders: "leaders",
    ministries: "ministries",
    serviceMinistries: "serviceMinistries",
    cells: "cells",
    biblicalPrograms: "biblicalPrograms",
    devotionals: "devotionals",
    events: "events",
    historyMilestones: "historyMilestones",
    doctrines: "doctrines",
    institutionalSections: "institutionalSections",
  };
  return map[slug] || slug;
}

function buildEntityBlocks(
  items: EntityItem[],
  entityTypeSlug: string,
  baseFields: BlockField[]
): BlockConfig[] {
  return items.map((item) => {
    const blockKey = `entity:${entityTypeSlug}:${item.id}`;
    return {
      key: blockKey,
      label: (item.title || item.name || "Elemento") as string,
      fields: baseFields.map((f) => ({
        ...f,
        name: `${blockKey}.${f.name}`,
      })),
    };
  });
}

function extractEntityInitialData(
  items: EntityItem[],
  entityTypeSlug: string,
  baseFields: BlockField[]
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const item of items) {
    const blockKey = `entity:${entityTypeSlug}:${item.id}`;
    for (const field of baseFields) {
      const val = item[field.name];
      result[`${blockKey}.${field.name}`] = val != null ? String(val) : "";
    }
  }
  return result;
}

function buildPageConfig(entityType: string, slug: string): PageRenderConfig {
  switch (entityType) {
    case "homepage":
      return {
        blocks: HOMEPAGE_BLOCKS,
        extractInitial: (data) => {
          const settings = (data.settings || {}) as Record<string, string>;
          return { ...HP_DEFAULTS, ...settings };
        },
        onSave: async (_blockKey, _data) => {
          const { saveHomepageBlock } = await import("@/lib/cms/homepage-actions");
          await saveHomepageBlock(_blockKey, _data);
        },
        render: (getVal) => renderHomepage(getVal),
      };

    case "institutionalPage":
      return {
        blocks: [BANNER_BLOCK()],
        extractInitial: (data) => {
          const b = (data.banner as Record<string, string>) || {};
          return {
            title: b.title || "",
            subtitle: b.subtitle || "",
            backgroundImage: b.backgroundImage || "",
          };
        },
        onSave: async (_blockKey, _data) => {
          if (_blockKey === "banner") {
            await saveInstitutionalPageBanner(slug, _data);
          }
        },
        render: (getVal, data) =>
          renderInstitutionalPage(getVal, (data.sections as EntityItem[]) || []),
      };

    case "history":
      return {
        blocks: [
          BANNER_BLOCK(),
          {
            key: "intro",
            label: "Introducción",
            fields: [{ name: "content", label: "Contenido introductorio", type: "textarea" }],
          },
        ],
        extractInitial: (data) => ({
          title: "Nuestra Historia",
          subtitle: "Una historia de fe, crecimiento y propósito.",
          backgroundImage: "/images/banner-berea.png",
          content: (data.content as string) || "",
        }),
        onSave: async (_blockKey, _data) => {
          if (_blockKey === "intro") await savePageIntro("nuestra-historia", _data);
        },
        render: (getVal, data) => renderHistory(getVal, (data.milestones as EntityItem[]) || []),
      };

    case "contact":
      return {
        blocks: CONTACT_BLOCKS,
        extractInitial: (data) => {
          const banner = (data.banner as Record<string, string>) || {};
          const info = (data.info as Record<string, string>) || {};
          return {
            title: banner.title || "Contacto",
            subtitle: banner.subtitle || "",
            backgroundImage: banner.backgroundImage || "",
            churchName: info.churchName || "",
            address: info.address || "",
            phone: info.phone || "",
            email: info.email || "",
            whatsapp: info.whatsapp || "",
            mapUrl: info.mapUrl || "",
          };
        },
        onSave: async (_blockKey, _data) => {
          if (_blockKey === "banner") {
            await saveInstitutionalPageBanner("contacto", _data);
          } else if (_blockKey === "info") {
            await saveContactInfo(_data);
          }
        },
        render: (getVal) => renderContact(getVal),
      };

    case "donations":
      return {
        blocks: DONATION_BLOCKS,
        extractInitial: (data) => {
          const banner = (data.banner as Record<string, string>) || {};
          const info = (data.info as Record<string, string>) || {};
          return {
            title: banner.title || "Donaciones",
            subtitle: banner.subtitle || "",
            backgroundImage: banner.backgroundImage || "",
            ...info,
          };
        },
        onSave: async (_blockKey, _data) => {
          if (_blockKey === "banner") {
            await saveInstitutionalPageBanner("donaciones", _data);
          } else if (_blockKey === "info") {
            await saveDonationInfo(_data);
          }
        },
        render: (getVal) => renderDonations(getVal),
      };

    case "annual-vision":
      return {
        blocks: VISION_BLOCKS,
        extractInitial: (data) => {
          const v = (data.vision as Record<string, unknown>) || {};
          return {
            name: (v.name as string) || "",
            verse: (v.verse as string) || "",
            description: (v.description as string) || "",
          };
        },
        onSave: async (_blockKey, _data) => {
          if (_blockKey === "vision") {
            await saveAnnualVision(_data);
          }
        },
        render: (getVal, data) => {
          const v = (data.vision as Record<string, unknown>) || {};
          return renderVision(getVal, v.year as number | undefined);
        },
      };

    default:
      return {
        blocks: [BANNER_BLOCK()],
        extractInitial: (data) => {
          const b = (data.banner as Record<string, string>) || {};
          return {
            title: b.title || "",
            subtitle: b.subtitle || "",
            backgroundImage: b.backgroundImage || "",
          };
        },
        onSave: async (_blockKey, _data) => {
          console.log("[TRACE:10] buildPageConfig.onSave (default) — llamado", {
            _blockKey,
            _dataKeys: Object.keys(_data),
            _data: JSON.stringify(_data),
          });
          if (_blockKey.startsWith("entity:")) {
            const parts = _blockKey.split(":");
            const eType = parts[1];
            const eId = parts.slice(2).join(":");
            const prefix = `${_blockKey}.`;
            const cleanData: Record<string, string> = {};
            for (const [key, value] of Object.entries(_data)) {
              if (key.startsWith(prefix)) {
                cleanData[key.slice(prefix.length)] = value;
              }
            }
            console.log(
              "[TRACE:10] buildPageConfig.onSave — cleanData:",
              JSON.stringify(cleanData)
            );
            await saveEntityBlock(getEntityCmsType(eType), eId, cleanData);
          }
        },
        render: (_getVal, _data) => null,
      };
  }
}

function buildEntityPageConfig(
  entityType: string,
  slug: string,
  items: EntityItem[],
  entityTypeSlug: string
): PageRenderConfig {
  const baseFields = ENTITY_EDIT_FIELDS[entityTypeSlug] || [];

  const staticBlocks: BlockConfig[] = [BANNER_BLOCK()];
  const entityBlocks = buildEntityBlocks(items, entityTypeSlug, baseFields);
  const allBlocks = [...staticBlocks, ...entityBlocks];

  return {
    blocks: allBlocks,
    extractInitial: (data) => {
      const b = (data.banner as Record<string, string>) || {};
      const bannerData = {
        title: b.title || "",
        subtitle: b.subtitle || "",
        backgroundImage: b.backgroundImage || "",
      };
      const entityData = extractEntityInitialData(items, entityTypeSlug, baseFields);
      return { ...bannerData, ...entityData };
    },
    onSave: async (_blockKey, _data) => {
      console.log("[TRACE:10] buildEntityPageConfig.onSave — llamado", {
        slug,
        _blockKey,
        _dataKeys: Object.keys(_data),
        _data: JSON.stringify(_data),
      });
      if (_blockKey === "banner") {
        console.log(
          "[TRACE:10] buildEntityPageConfig.onSave — es banner, llamando saveInstitutionalPageBanner"
        );
        await saveInstitutionalPageBanner(slug, _data);
      } else if (_blockKey.startsWith("entity:")) {
        const parts = _blockKey.split(":");
        const eType = parts[1];
        const eId = parts.slice(2).join(":");
        const prefix = `${_blockKey}.`;
        const cleanData: Record<string, string> = {};
        for (const [key, value] of Object.entries(_data)) {
          if (key.startsWith(prefix)) {
            cleanData[key.slice(prefix.length)] = value;
          }
        }
        console.log(
          "[TRACE:10] buildEntityPageConfig.onSave — cleanData:",
          JSON.stringify(cleanData)
        );
        console.log(
          "[TRACE:10] buildEntityPageConfig.onSave — entityType:",
          getEntityCmsType(eType),
          "id:",
          eId
        );
        await saveEntityBlock(getEntityCmsType(eType), eId, cleanData);
      }
    },
    render: (getVal, data) => renderEntityList(getVal, items, entityTypeSlug),
    renderActions: (blockKey, config) => {
      if (!blockKey.startsWith("entity:")) return null;
      const entityTypeSlugFromKey = blockKey.split(":")[1];
      const entityId = blockKey.split(":").slice(2).join(":");
      return (
        <Link
          href={`/admin/content/${getEntityCmsType(entityTypeSlugFromKey)}/${entityId}`}
          target="_blank"
          className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ExternalLink className="h-3 w-3" />
          Abrir editor avanzado
        </Link>
      );
    },
  };
}

// ─── Client Component ───────────────────────────────

function LivePreview({
  render,
  pageData,
  initialData,
}: {
  render: (getVal: (key: string) => string, data: Record<string, unknown>) => React.ReactNode;
  pageData: Record<string, unknown>;
  initialData: Record<string, string>;
}) {
  const { blockValues, blocks } = useVisualEditor();

  const liveGetVal = useCallback(
    (key: string): string => {
      for (const block of blocks) {
        const override = blockValues[block.key]?.[key];
        if (override !== undefined && override !== "") return override;
      }
      return initialData[key] || "";
    },
    [blocks, blockValues, initialData]
  );

  return <>{render(liveGetVal, pageData)}</>;
}

export function EditorClient({
  pages,
  categories,
  selectedSlug,
  selectedEntityType,
  pageData,
}: {
  pages: PageEntry[];
  categories: string[];
  selectedSlug: string;
  selectedEntityType: string;
  pageData: Record<string, unknown>;
}) {
  const router = useRouter();

  const config = useMemo(() => {
    const items = (pageData?.items as EntityItem[]) || [];
    const entityTypeSlug = (pageData?.entityTypeSlug as string) || "";

    if (items.length > 0 && entityTypeSlug && ENTITY_EDIT_FIELDS[entityTypeSlug]) {
      return buildEntityPageConfig(selectedEntityType, selectedSlug, items, entityTypeSlug);
    }

    if (selectedEntityType === "history") {
      const milestones = (pageData?.milestones as EntityItem[]) || [];
      if (milestones.length > 0) {
        const mSlug = "historyMilestones";
        const mFields = ENTITY_EDIT_FIELDS[mSlug] || [];
        const staticBlocks: BlockConfig[] = [
          BANNER_BLOCK(),
          {
            key: "intro",
            label: "Introducción",
            fields: [{ name: "content", label: "Contenido introductorio", type: "textarea" }],
          },
        ];
        const entityBlocks = buildEntityBlocks(milestones, mSlug, mFields);
        return {
          blocks: [...staticBlocks, ...entityBlocks],
          extractInitial: (data: Record<string, unknown>) => {
            const pageContent = (data.content as string) || "";
            const banner = {
              title: "Nuestra Historia",
              subtitle: "Una historia de fe, crecimiento y propósito.",
              backgroundImage: "/images/banner-berea.png",
              content: pageContent,
            };
            const entityData = extractEntityInitialData(milestones, mSlug, mFields);
            return { ...banner, ...entityData };
          },
          onSave: async (_blockKey: string, _data: Record<string, string>) => {
            if (_blockKey === "intro") await savePageIntro("nuestra-historia", _data);
            else if (_blockKey.startsWith("entity:")) {
              const parts = _blockKey.split(":");
              const eType = parts[1];
              const eId = parts.slice(2).join(":");
              const prefix = `${_blockKey}.`;
              const cleanData: Record<string, string> = {};
              for (const [key, value] of Object.entries(_data)) {
                if (key.startsWith(prefix)) {
                  cleanData[key.slice(prefix.length)] = value;
                }
              }
              await saveEntityBlock(getEntityCmsType(eType), eId, cleanData);
            }
          },
          render: (getVal: (key: string) => string, _data: Record<string, unknown>) =>
            renderHistory(getVal, milestones),
          renderActions: (blockKey: string) => {
            if (!blockKey.startsWith("entity:")) return null;
            const parts = blockKey.split(":");
            const eId = parts.slice(2).join(":");
            return (
              <Link
                href={`/admin/content/historyMilestones/${eId}`}
                target="_blank"
                className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="h-3 w-3" />
                Abrir editor avanzado
              </Link>
            );
          },
        };
      }
    }

    if (selectedEntityType === "institutionalPage") {
      const sections = (pageData?.sections as EntityItem[]) || [];
      const instFields = ENTITY_EDIT_FIELDS["institutionalSections"] || [];
      const entityBlocks = buildEntityBlocks(sections, "institutionalSections", instFields);
      return {
        blocks: [BANNER_BLOCK(), ...entityBlocks],
        extractInitial: (data: Record<string, unknown>) => {
          const b = (data.banner as Record<string, string>) || {};
          const bannerData = {
            title: b.title || "",
            subtitle: b.subtitle || "",
            backgroundImage: b.backgroundImage || "",
          };
          const entityData = extractEntityInitialData(
            sections,
            "institutionalSections",
            instFields
          );
          return { ...bannerData, ...entityData };
        },
        onSave: async (_blockKey: string, _data: Record<string, string>) => {
          if (_blockKey === "banner") {
            await saveInstitutionalPageBanner(selectedSlug, _data);
          } else if (_blockKey.startsWith("entity:")) {
            const parts = _blockKey.split(":");
            const eType = parts[1];
            const eId = parts.slice(2).join(":");
            const prefix = `${_blockKey}.`;
            const cleanData: Record<string, string> = {};
            for (const [key, value] of Object.entries(_data)) {
              if (key.startsWith(prefix)) {
                cleanData[key.slice(prefix.length)] = value;
              }
            }
            await saveEntityBlock(getEntityCmsType(eType), eId, cleanData);
          }
        },
        render: (getVal: (key: string) => string, _data: Record<string, unknown>) =>
          renderInstitutionalPage(getVal, sections),
        renderActions: (blockKey: string) => {
          if (!blockKey.startsWith("entity:")) return null;
          const parts = blockKey.split(":");
          const eId = parts.slice(2).join(":");
          return (
            <Link
              href={`/admin/content/institutionalSections/${eId}`}
              target="_blank"
              className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-3 w-3" />
              Abrir editor avanzado
            </Link>
          );
        },
      };
    }

    return buildPageConfig(selectedEntityType, selectedSlug);
  }, [selectedEntityType, selectedSlug, pageData]);

  const initialData = useMemo(() => config.extractInitial(pageData), [config, pageData]);

  const onSaveBlock = useCallback(
    async (blockKey: string, data: Record<string, string>) => {
      console.log("[TRACE:10] editor-client — onSaveBlock llamado", {
        blockKey,
        dataKeys: Object.keys(data),
        data: JSON.stringify(data),
      });
      await config.onSave(blockKey, data);
      console.log("[TRACE:10] editor-client — config.onSave completado");
    },
    [config]
  );

  const groupedPages = useMemo(() => {
    const groups: Record<string, PageEntry[]> = {};
    for (const cat of categories) groups[cat] = [];
    for (const p of pages) {
      if (groups[p.category]) groups[p.category].push(p);
    }
    return groups;
  }, [pages, categories]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <div key={cat} className="flex items-center gap-1">
            <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              {cat}:
            </span>
            {groupedPages[cat].map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => router.push(`/admin/editor?page=${p.slug}`)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  p.slug === selectedSlug
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      <VisualEditorShell
        blocks={config.blocks}
        initialData={initialData}
        onSaveBlock={onSaveBlock}
        panelRenderActions={config.renderActions}
      >
        <LivePreview render={config.render} pageData={pageData} initialData={initialData} />
      </VisualEditorShell>
    </div>
  );
}
