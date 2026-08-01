import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/rbac";
import { db } from "@/lib/db";
import { settings, contact } from "@/lib/db/schema";
import { isNull } from "drizzle-orm";
import { PageHeader } from "@/components/shared/PageHeader";
import { SettingsClient } from "./settings-client";

function str(v: unknown, key = "es"): string {
  const obj = v as Record<string, unknown> | undefined;
  if (!obj) return "";
  const val = obj[key];
  return typeof val === "string" ? val : "";
}

function prettyJson(value: unknown): string {
  if (value == null) return "";
  try {
    if (typeof value === "string") return JSON.stringify(JSON.parse(value), null, 2);
    return JSON.stringify(value, null, 2);
  } catch {
    return typeof value === "string" ? value : "";
  }
}

export default async function SettingsPage(props: { searchParams: Promise<{ tab?: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const allowed = await hasPermission("settings.manage");
  if (!allowed) redirect("/admin");

  const rows = await db.select().from(settings).where(isNull(settings.deletedAt));
  const settingsMap: Record<string, unknown> = {};
  for (const r of rows) settingsMap[r.key] = r.value;

  const [info] = await db.select().from(contact).limit(1);

  const { tab } = await props.searchParams;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configuración"
        description="Información general, datos de la iglesia y analíticas del sitio."
      />
      <SettingsClient
        activeTab={tab || "general"}
        site={{
          siteName: str(settingsMap.site_name),
          siteDescription: str(settingsMap.site_description),
          siteLogo: str(settingsMap.site_logo, "url"),
          siteFavicon: str(settingsMap.site_favicon, "url"),
          primaryColor: str(settingsMap.primary_color, "value"),
        }}
        church={{
          churchName: info?.churchName || "",
          address: info?.address || "",
          phone: info?.phone || "",
          email: info?.email || "",
          whatsapp: info?.whatsapp || "",
          mapUrl: info?.mapUrl || "",
          coordinates: prettyJson(info?.coordinates),
          schedules: prettyJson(info?.schedules),
          socialMedia: prettyJson(info?.socialMedia),
        }}
        analytics={{
          ga4Id: str(settingsMap.ga4_id, "value"),
        }}
      />
    </div>
  );
}
