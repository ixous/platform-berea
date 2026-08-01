"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/rbac";
import { logAudit } from "@/lib/audit";
import { rateLimit } from "@/lib/rate-limit";
import { settings, contact } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function requireSettingsAuth() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado.");
  const allowed = await hasPermission("settings.manage");
  if (!allowed) throw new Error("No tienes permiso para administrar la configuración.");
  return session;
}

async function upsertSetting(key: string, value: unknown, description?: string) {
  const [existing] = await db
    .select({ id: settings.id })
    .from(settings)
    .where(eq(settings.key, key))
    .limit(1);

  if (existing) {
    await db
      .update(settings)
      .set({ value, description, updatedAt: new Date() })
      .where(eq(settings.id, existing.id));
  } else {
    await db.insert(settings).values({ key, value, description });
  }
}

function parseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    throw new Error("JSON inválido. Revisa el formato antes de guardar.");
  }
}

export async function saveSiteSettings(formData: FormData) {
  const session = await requireSettingsAuth();
  if (!rateLimit(`settings:site:${session.user.id}`, { windowMs: 60_000, max: 30 })) return;

  const get = (key: string) => String(formData.get(key) || "").trim();

  const siteName = get("site_name");
  const siteDescription = get("site_description");
  const siteLogo = get("site_logo");
  const siteFavicon = get("site_favicon");
  const primaryColor = get("primary_color");

  if (siteName) await upsertSetting("site_name", { es: siteName });
  if (siteDescription) await upsertSetting("site_description", { es: siteDescription });
  if (siteLogo) await upsertSetting("site_logo", { url: siteLogo });
  if (siteFavicon) await upsertSetting("site_favicon", { url: siteFavicon });
  if (primaryColor) await upsertSetting("primary_color", { value: primaryColor });

  await logAudit({
    userId: session.user.id,
    action: "SETTINGS_UPDATE",
    resource: "settings",
    details: "Configuración general del sitio actualizada",
  });

  revalidatePath("/");
}

export async function saveChurchInfo(formData: FormData) {
  const session = await requireSettingsAuth();
  if (!rateLimit(`settings:church:${session.user.id}`, { windowMs: 60_000, max: 30 })) return;

  const updateData: Record<string, unknown> = { updatedAt: new Date() };

  const scalarFields = ["churchName", "address", "phone", "email", "whatsapp", "mapUrl"] as const;
  for (const field of scalarFields) {
    const val = formData.get(field);
    if (val !== null) updateData[field] = String(val);
  }

  const jsonFields = ["coordinates", "schedules", "socialMedia"] as const;
  for (const field of jsonFields) {
    const val = formData.get(field);
    if (val !== null && String(val).trim() !== "") {
      updateData[field] = parseJson(String(val));
    }
  }

  const [existing] = await db.select({ id: contact.id }).from(contact).limit(1);
  if (existing) {
    await db.update(contact).set(updateData).where(eq(contact.id, existing.id));
  } else {
    await db.insert(contact).values(updateData as typeof contact.$inferInsert);
  }

  await logAudit({
    userId: session.user.id,
    action: "SETTINGS_UPDATE",
    resource: "contact",
    details: "Información de la iglesia actualizada",
  });

  revalidatePath("/contacto");
  revalidatePath("/");
}

export async function saveAnalyticsSettings(formData: FormData) {
  const session = await requireSettingsAuth();
  if (!rateLimit(`settings:analytics:${session.user.id}`, { windowMs: 60_000, max: 30 })) return;

  const ga4Id = String(formData.get("ga4_id") || "").trim();
  if (ga4Id) await upsertSetting("ga4_id", { value: ga4Id });

  await logAudit({
    userId: session.user.id,
    action: "SETTINGS_UPDATE",
    resource: "settings",
    details: "Configuración de analíticas actualizada",
  });

  revalidatePath("/");
}
