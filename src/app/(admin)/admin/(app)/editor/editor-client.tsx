"use client";

import { useMemo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
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
  ArrowRight,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  saveInstitutionalPageBanner,
  saveContactInfo,
  saveDonationInfo,
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
  devotionals: [
    { name: "title", label: "Título", type: "text" },
    { name: "excerpt", label: "Extracto", type: "textarea" },
    { name: "verse", label: "Versículo", type: "textarea" },
    { name: "imageUrl", label: "Imagen", type: "image" },
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
    { name: "imageUrl", label: "Imagen", type: "image" },
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
  homepageServices: [
    { name: "title", label: "Título", type: "text" },
    { name: "day", label: "Día", type: "text" },
    { name: "time", label: "Hora", type: "text" },
    { name: "description", label: "Descripción", type: "textarea" },
    { name: "link", label: "Enlace", type: "text" },
  ],
  homepageSections: [
    { name: "title", label: "Título", type: "text" },
    { name: "subtitle", label: "Subtítulo", type: "textarea" },
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

function SectionToggle({ sectionKey, visible }: { sectionKey: string; visible: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        try {
          const { toggleHomepageSection } = await import("@/lib/cms/homepage-actions");
          await toggleHomepageSection(sectionKey, !visible);
          router.refresh();
        } catch {
          // ignore
        } finally {
          setPending(false);
        }
      }}
      className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
    >
      {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
      {visible ? "Ocultar en el sitio" : "Mostrar en el sitio"}
    </button>
  );
}

function renderHomepage(getVal: (key: string) => string, data: Record<string, unknown>) {
  const services = (data.homepageServices as EntityItem[]) || [];
  const sections = (data.homepageSections as EntityItem[]) || [];

  const isVisible = (key: string) => {
    const s = sections.find((sec) => sec.sectionKey === key);
    return s ? Boolean(s.visible) : true;
  };

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

      {isVisible("welcome") && (
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
      )}

      {services.length > 0 && (
        <ContentBlock variant="warm">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((svc) => {
              const blockKey = `entity:homepageServices:${svc.id}`;
              const g = (key: string) => getVal(`${blockKey}.${key}`);
              return (
                <VisualBlock
                  key={blockKey}
                  blockKey={blockKey}
                  label={(svc.title as string) || "Servicio"}
                >
                  <MediaCard
                    variant="icon"
                    icon={Clock}
                    title={g("title")}
                    description={
                      g("description") ||
                      (g("day") && g("time") ? `${g("day")} ${g("time")}` : undefined)
                    }
                  >
                    {g("day") && g("time") && (
                      <p className="mt-8 text-xs text-berea-muted">
                        {g("day")} &middot; {g("time")}
                      </p>
                    )}
                  </MediaCard>
                </VisualBlock>
              );
            })}
          </div>
        </ContentBlock>
      )}

      {sections.map((section) => {
        const sectionKey = String(section.sectionKey);
        if (sectionKey === "welcome" || sectionKey === "cta") return null;
        const blockKey = `entity:homepageSections:${sectionKey}`;
        const visible = Boolean(section.visible);
        return (
          <VisualBlock
            key={blockKey}
            blockKey={blockKey}
            label={((section.title as string) || sectionKey) + " (Sección)"}
          >
            <section className={`border-b py-12 ${visible ? "" : "opacity-50"}`}>
              <ContentNarrow className="text-center">
                <h2 className="text-2xl font-bold tracking-tight text-berea-navy">
                  {getVal(`${blockKey}.title`) || sectionKey}
                </h2>
                {getVal(`${blockKey}.subtitle`) && (
                  <p className="mt-2 text-berea-muted">{getVal(`${blockKey}.subtitle`)}</p>
                )}
                <span
                  className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                    visible ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {visible ? "Visible en el sitio" : "Oculto en el sitio"}
                </span>
              </ContentNarrow>
            </section>
          </VisualBlock>
        );
      })}

      {isVisible("cta") && (
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
      )}
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

// ─── Entity List ────────────────────────────────────

const iconByEntity: Record<string, React.ReactNode> = {
  ministries: <Church className="h-5 w-5" />,
  serviceMinistries: <HandHeart className="h-5 w-5" />,
  cells: <Home className="h-5 w-5" />,
  biblicalPrograms: <GraduationCap className="h-5 w-5" />,
  devotionals: <BookOpen className="h-5 w-5" />,
  events: <CalendarDays className="h-5 w-5" />,
  homepageServices: <Clock className="h-5 w-5" />,
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

function buildPageConfig(
  entityType: string,
  slug: string,
  pageData?: Record<string, unknown>
): PageRenderConfig {
  switch (entityType) {
    case "homepage": {
      const services = ((pageData?.homepageServices as EntityItem[]) || []) as EntityItem[];
      const sections = ((pageData?.homepageSections as EntityItem[]) || []) as EntityItem[];
      const svcFields = ENTITY_EDIT_FIELDS["homepageServices"] || [];
      const secFields = ENTITY_EDIT_FIELDS["homepageSections"] || [];
      const svcBlocks = buildEntityBlocks(services, "homepageServices", svcFields);
      const secBlocks = sections.map((section) => {
        const blockKey = `entity:homepageSections:${section.sectionKey}`;
        return {
          key: blockKey,
          label: ((section.title as string) || String(section.sectionKey)) + " (Sección)",
          fields: secFields.map((f) => ({ ...f, name: `${blockKey}.${f.name}` })),
        };
      });
      const sectionVisibleMap: Record<string, boolean> = {};
      for (const s of sections) {
        sectionVisibleMap[String(s.sectionKey)] = Boolean(s.visible);
      }

      return {
        blocks: [...HOMEPAGE_BLOCKS, ...svcBlocks, ...secBlocks],
        extractInitial: (data) => {
          const settings = (data.settings || {}) as Record<string, string>;
          const svcData = extractEntityInitialData(services, "homepageServices", svcFields);
          const secData: Record<string, string> = {};
          for (const section of sections) {
            const blockKey = `entity:homepageSections:${section.sectionKey}`;
            for (const f of secFields) {
              const val = section[f.name];
              secData[`${blockKey}.${f.name}`] = val != null ? String(val) : "";
            }
          }
          return { ...HP_DEFAULTS, ...settings, ...svcData, ...secData };
        },
        onSave: async (_blockKey, _data) => {
          if (_blockKey.startsWith("entity:homepageServices:")) {
            const parts = _blockKey.split(":");
            const eId = parts.slice(2).join(":");
            const prefix = `${_blockKey}.`;
            const cleanData: Record<string, string> = {};
            for (const [key, value] of Object.entries(_data)) {
              if (key.startsWith(prefix)) cleanData[key.slice(prefix.length)] = value;
            }
            await saveEntityBlock("homepageServices", eId, cleanData);
          } else if (_blockKey.startsWith("entity:homepageSections:")) {
            const sectionKey = _blockKey.split(":")[2];
            const prefix = `${_blockKey}.`;
            const cleanData: Record<string, string> = {};
            for (const [key, value] of Object.entries(_data)) {
              if (key.startsWith(prefix)) cleanData[key.slice(prefix.length)] = value;
            }
            const { saveHomepageSection } = await import("@/lib/cms/homepage-actions");
            await saveHomepageSection(sectionKey, cleanData);
          } else {
            const { saveHomepageBlock } = await import("@/lib/cms/homepage-actions");
            await saveHomepageBlock(_blockKey, _data);
          }
        },
        render: (getVal, data) => renderHomepage(getVal, data),
        renderActions: (blockKey) => {
          if (!blockKey.startsWith("entity:homepageSections:")) return null;
          const sectionKey = blockKey.split(":")[2];
          const visible = sectionVisibleMap[sectionKey] ?? true;
          return (
            <div className="mt-3 border-t pt-3">
              <p className="mb-1 text-xs text-muted-foreground">
                {visible ? "Sección visible en el sitio" : "Sección oculta en el sitio"}
              </p>
              <SectionToggle sectionKey={sectionKey} visible={visible} />
            </div>
          );
        },
      };
    }

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
            await saveEntityBlock(getEntityCmsType(eType), eId, cleanData, slug);
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
        await saveEntityBlock(getEntityCmsType(eType), eId, cleanData, slug);
      }
    },
    render: (getVal, data) => renderEntityList(getVal, items, entityTypeSlug),
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

  const config = useMemo((): PageRenderConfig => {
    const items = (pageData?.items as EntityItem[]) || [];
    const entityTypeSlug = (pageData?.entityTypeSlug as string) || "";

    if (items.length > 0 && entityTypeSlug && ENTITY_EDIT_FIELDS[entityTypeSlug]) {
      return buildEntityPageConfig(selectedEntityType, selectedSlug, items, entityTypeSlug);
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
            await saveEntityBlock(getEntityCmsType(eType), eId, cleanData, selectedSlug);
          }
        },
        render: (getVal: (key: string) => string, _data: Record<string, unknown>) =>
          renderInstitutionalPage(getVal, sections),
      };
    }

    return buildPageConfig(selectedEntityType, selectedSlug, pageData);
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
        key={selectedSlug}
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
