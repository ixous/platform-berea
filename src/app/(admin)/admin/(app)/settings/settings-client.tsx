"use client";

import { useRouter } from "next/navigation";
import { Save, Info } from "lucide-react";
import {
  saveSiteSettings,
  saveChurchInfo,
  saveAnalyticsSettings,
} from "@/lib/cms/settings-actions";

const TABS = [
  { key: "general", label: "General" },
  { key: "church", label: "Iglesia" },
  { key: "analytics", label: "Analíticas" },
];

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteLogo: string;
  siteFavicon: string;
  primaryColor: string;
}

interface ChurchSettings {
  churchName: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  mapUrl: string;
  coordinates: string;
  schedules: string;
  socialMedia: string;
}

interface AnalyticsSettings {
  ga4Id: string;
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  placeholder,
  help,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  placeholder?: string;
  help?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          defaultValue={defaultValue}
          rows={5}
          placeholder={placeholder}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      )}
      {help && <p className="text-xs text-muted-foreground">{help}</p>}
    </div>
  );
}

function FormCard({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description: string;
  action: (formData: FormData) => Promise<void>;
  children: React.ReactNode;
}) {
  return (
    <form action={action} className="rounded-xl border bg-card p-6">
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-6 grid gap-5">{children}</div>
      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Save className="h-4 w-4" />
          Guardar cambios
        </button>
      </div>
    </form>
  );
}

function GeneralTab({ site }: { site: SiteSettings }) {
  return (
    <div className="space-y-6">
      <FormCard
        title="Información general"
        description="Nombre y descripción por defecto del sitio. Se usan para el SEO global y el contenido de redes."
        action={saveSiteSettings}
      >
        <Field
          label="Nombre del sitio"
          name="site_name"
          defaultValue={site.siteName}
          placeholder="Centro Cristiano Berea"
        />
        <Field
          label="Descripción del sitio"
          name="site_description"
          defaultValue={site.siteDescription}
          placeholder="Sitio web oficial de Centro Cristiano Berea — Mexicali, Baja California, México."
          type="textarea"
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Logo"
            name="site_logo"
            defaultValue={site.siteLogo}
            placeholder="/images/logo.png"
            help="URL del logo. Cópiala desde la Biblioteca de Medios."
          />
          <Field
            label="Favicon"
            name="site_favicon"
            defaultValue={site.siteFavicon}
            placeholder="/images/logo.png"
            help="Icono de pestaña del navegador."
          />
        </div>
        <Field
          label="Color principal"
          name="primary_color"
          defaultValue={site.primaryColor}
          type="color"
          help="Color de acento del sitio (por ejemplo, dorado)."
        />
      </FormCard>
    </div>
  );
}

function ChurchTab({ church }: { church: ChurchSettings }) {
  return (
    <div className="space-y-6">
      <FormCard
        title="Información de la iglesia"
        description="Datos de contacto, horarios y redes sociales que se muestran en la página de Contacto."
        action={saveChurchInfo}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nombre de la iglesia" name="churchName" defaultValue={church.churchName} />
          <Field label="Dirección" name="address" defaultValue={church.address} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Teléfono" name="phone" defaultValue={church.phone} />
          <Field label="Email" name="email" defaultValue={church.email} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="WhatsApp" name="whatsapp" defaultValue={church.whatsapp} />
          <Field label="Google Maps (URL)" name="mapUrl" defaultValue={church.mapUrl} />
        </div>
        <Field
          label="Horarios (JSON)"
          name="schedules"
          defaultValue={church.schedules}
          type="textarea"
          help={'Formato: [{"day":"Domingo","time":"11:00 AM a 1:00 PM"}]'}
        />
        <Field
          label="Redes sociales (JSON)"
          name="socialMedia"
          defaultValue={church.socialMedia}
          type="textarea"
          help={'Formato: [{"platform":"facebook","url":"https://...","label":"Facebook"}]'}
        />
        <Field
          label="Coordenadas (JSON)"
          name="coordinates"
          defaultValue={church.coordinates}
          type="textarea"
          help='Formato: {"lat": 32.6634, "lng": -115.4678}'
        />
      </FormCard>
    </div>
  );
}

function AnalyticsTab({ analytics }: { analytics: AnalyticsSettings }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-xl border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          La integración con Google Analytics 4 llegará en una próxima fase. Puedes dejar preparado
          el ID de medición (formato <span className="font-mono">G-XXXXXXXXXX</span>) para que se
          active automáticamente.
        </p>
      </div>
      <FormCard
        title="Analíticas"
        description="Configuración de métricas del sitio."
        action={saveAnalyticsSettings}
      >
        <Field
          label="Google Analytics 4 (ID de medición)"
          name="ga4_id"
          defaultValue={analytics.ga4Id}
          placeholder="G-XXXXXXXXXX"
        />
      </FormCard>
    </div>
  );
}

export function SettingsClient({
  activeTab,
  site,
  church,
  analytics,
}: {
  activeTab: string;
  site: SiteSettings;
  church: ChurchSettings;
  analytics: AnalyticsSettings;
}) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => router.push(`/admin/settings?tab=${tab.key}`)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              tab.key === activeTab
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "church" ? (
        <ChurchTab church={church} />
      ) : activeTab === "analytics" ? (
        <AnalyticsTab analytics={analytics} />
      ) : (
        <GeneralTab site={site} />
      )}
    </div>
  );
}
