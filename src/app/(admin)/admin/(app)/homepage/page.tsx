import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/rbac";
import { db } from "@/lib/db";
import { homepageSettings, homepageSections } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { PageHeader } from "@/components/shared/PageHeader";
import Link from "next/link";
import { Eye, EyeOff, ExternalLink } from "lucide-react";
import { saveHomepageSettings, saveHomepageSections } from "@/lib/cms/homepage-actions";

const TABS = ["hero", "welcome", "cta", "services", "sections"] as const;
type Tab = (typeof TABS)[number];

async function getSettings() {
  const [settings] = await db.select().from(homepageSettings).limit(1);
  return settings ?? null;
}

async function getSections() {
  return db.select().from(homepageSections).orderBy(asc(homepageSections.displayOrder));
}

export default async function HomepageAdminPage(props: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  const allowed = await hasPermission("homepage.manage");
  if (!allowed) redirect("/admin");

  const { tab: rawTab } = await props.searchParams;
  const currentTab = TABS.includes(rawTab as Tab) ? (rawTab as Tab) : "hero";

  return (
    <div className="space-y-8">
      <PageHeader
        title="Personalizar Inicio"
        description="Administra todas las secciones de la página de inicio."
      />
      <nav className="flex gap-1 border-b">
        {(["hero", "welcome", "services", "cta", "sections"] as const).map((t) => (
          <Link
            key={t}
            href={`/admin/homepage?tab=${t}`}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              t === currentTab
                ? "border-b-2 border-primary text-primary"
                : "border-b-2 border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {
              {
                hero: "Hero",
                welcome: "Bienvenida",
                services: "Servicios",
                cta: "CTA Final",
                sections: "Secciones",
              }[t]
            }
          </Link>
        ))}
      </nav>
      <div>
        {currentTab === "hero" && <HeroForm />}
        {currentTab === "welcome" && <WelcomeForm />}
        {currentTab === "cta" && <CtaForm />}
        {currentTab === "services" && <ServicesPanel />}
        {currentTab === "sections" && <SectionsForm />}
      </div>
    </div>
  );
}

async function HeroForm() {
  const s = await getSettings();
  return (
    <SectionForm action={saveHomepageSettings}>
      <Field label="Tagline" name="heroTagline" defaultValue={s?.heroTagline ?? "BIENVENIDOS"} />
      <Field
        label="Título principal"
        name="heroTitle"
        defaultValue={s?.heroTitle ?? "Centro Cristiano Berea"}
      />
      <Field label="Subtítulo" name="heroSubtitle" defaultValue={s?.heroSubtitle ?? ""} textarea />
      <Field
        label="Texto botón principal"
        name="heroCtaText"
        defaultValue={s?.heroCtaText ?? "Conócenos"}
      />
      <Field
        label="Enlace botón principal"
        name="heroCtaHref"
        defaultValue={s?.heroCtaHref ?? "/quienes-somos"}
      />
      <Field
        label="Texto botón secundario"
        name="heroSecondaryCtaText"
        defaultValue={s?.heroSecondaryCtaText ?? "Horarios de Servicio"}
      />
      <Field
        label="Enlace botón secundario"
        name="heroSecondaryCtaHref"
        defaultValue={s?.heroSecondaryCtaHref ?? "/contacto"}
      />
      <Field
        label="URL imagen de fondo"
        name="heroBackgroundImage"
        defaultValue={s?.heroBackgroundImage ?? ""}
      />
      <Field
        label="Texto alternativo imagen"
        name="heroImageAlt"
        defaultValue={s?.heroImageAlt ?? ""}
      />
    </SectionForm>
  );
}

async function WelcomeForm() {
  const s = await getSettings();
  return (
    <SectionForm action={saveHomepageSettings}>
      <Field label="Título" name="welcomeTitle" defaultValue={s?.welcomeTitle ?? ""} />
      <Field
        label="Descripción"
        name="welcomeDescription"
        defaultValue={s?.welcomeDescription ?? ""}
        textarea
      />
      <Field label="Texto botón" name="welcomeCtaText" defaultValue={s?.welcomeCtaText ?? ""} />
      <Field label="Enlace botón" name="welcomeCtaHref" defaultValue={s?.welcomeCtaHref ?? ""} />
      <Field
        label="Texto botón secundario"
        name="welcomeCtaSecondaryText"
        defaultValue={s?.welcomeCtaSecondaryText ?? ""}
      />
      <Field
        label="Enlace botón secundario"
        name="welcomeCtaSecondaryHref"
        defaultValue={s?.welcomeCtaSecondaryHref ?? ""}
      />
    </SectionForm>
  );
}

async function CtaForm() {
  const s = await getSettings();
  return (
    <SectionForm action={saveHomepageSettings}>
      <Field label="Título" name="ctaTitle" defaultValue={s?.ctaTitle ?? ""} />
      <Field
        label="Descripción"
        name="ctaDescription"
        defaultValue={s?.ctaDescription ?? ""}
        textarea
      />
      <Field label="Texto del botón" name="ctaButtonText" defaultValue={s?.ctaButtonText ?? ""} />
      <Field label="Enlace del botón" name="ctaButtonHref" defaultValue={s?.ctaButtonHref ?? ""} />
      <Field
        label="URL imagen de fondo"
        name="ctaBackgroundImage"
        defaultValue={s?.ctaBackgroundImage ?? ""}
      />
    </SectionForm>
  );
}

function ServicesPanel() {
  return (
    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      <p className="mb-4 text-sm text-muted-foreground">
        Los servicios se administran desde el gestor de contenido.
      </p>
      <Link
        href="/admin/content/homepageServices"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        <ExternalLink className="h-4 w-4" />
        Gestionar Servicios
      </Link>
    </div>
  );
}

async function SectionsForm() {
  const sections = await getSections();

  return (
    <form action={saveHomepageSections} className="max-w-3xl space-y-4">
      {sections.length === 0 ? (
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <p className="text-sm text-muted-foreground">
            No hay secciones. Ejecuta el seed para crearlas.
          </p>
        </div>
      ) : (
        <>
          {sections.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
            >
              <span className="text-xs font-bold text-muted-foreground w-6">{s.displayOrder}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{s.title || s.sectionKey}</p>
              </div>
              <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                <input type="hidden" name={`visible_${s.sectionKey}`} value="false" />
                <input
                  type="checkbox"
                  name={`visible_${s.sectionKey}`}
                  value="true"
                  defaultChecked={s.visible}
                  className="h-4 w-4"
                />
                {s.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              </label>
            </div>
          ))}
          <button
            type="submit"
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Guardar cambios
          </button>
        </>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  textarea,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  textarea?: boolean;
}) {
  const id = `field-${name}`;
  const cls =
    "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {textarea ? (
        <textarea id={id} name={name} defaultValue={defaultValue ?? ""} rows={3} className={cls} />
      ) : (
        <input id={id} name={name} type="text" defaultValue={defaultValue ?? ""} className={cls} />
      )}
    </div>
  );
}

function SectionForm({
  action,
  children,
}: {
  action: (fd: FormData) => void;
  children: React.ReactNode;
}) {
  return (
    <form action={action} className="max-w-2xl space-y-6">
      {children}
      <button
        type="submit"
        className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Guardar cambios
      </button>
    </form>
  );
}
