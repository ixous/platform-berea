/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/rbac";
import { logAudit } from "@/lib/audit";
import { rateLimit } from "@/lib/rate-limit";
import { homepageSettings, homepageSections } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function requireHomepageAuth() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado.");
  const allowed = await hasPermission("homepage.manage");
  if (!allowed) throw new Error("No tienes permiso.");
  return session;
}

const SETTINGS_FIELDS = [
  "heroTagline",
  "heroTitle",
  "heroSubtitle",
  "heroCtaText",
  "heroCtaHref",
  "heroSecondaryCtaText",
  "heroSecondaryCtaHref",
  "heroBackgroundImage",
  "heroImageAlt",
  "welcomeTitle",
  "welcomeDescription",
  "welcomeCtaText",
  "welcomeCtaHref",
  "welcomeCtaSecondaryText",
  "welcomeCtaSecondaryHref",
  "ctaTitle",
  "ctaDescription",
  "ctaButtonText",
  "ctaButtonHref",
  "ctaBackgroundImage",
];

export async function saveHomepageSettings(formData: FormData) {
  const session = await requireHomepageAuth();
  if (!rateLimit(`homepage:save:${session.user.id}`, { windowMs: 60_000, max: 30 })) return;

  const data: Record<string, unknown> = {};
  for (const field of SETTINGS_FIELDS) {
    const val = formData.get(field);
    if (val !== null) data[field] = String(val);
  }

  try {
    const [existing] = await db.select({ id: homepageSettings.id }).from(homepageSettings).limit(1);

    if (existing) {
      await db
        .update(homepageSettings)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(homepageSettings.id, existing.id));
    } else {
      await db.insert(homepageSettings).values(data as any);
    }

    await logAudit({
      userId: session.user.id,
      action: "HOMEPAGE_UPDATE",
      resource: "homepage_settings",
      details: "Configuración de inicio actualizada",
    });

    revalidatePath("/");
    revalidatePath("/admin/homepage");
  } catch (err) {
    console.error("[Homepage] Save settings failed:", err);
  }
}

export async function saveHomepageSections(formData: FormData) {
  const session = await requireHomepageAuth();
  if (!rateLimit(`homepage:sections:${session.user.id}`, { windowMs: 60_000, max: 30 })) return;

  try {
    const allSections = await db
      .select()
      .from(homepageSections)
      .orderBy(homepageSections.displayOrder);

    for (const section of allSections) {
      const visible = formData.get(`visible_${section.sectionKey}`) === "true";

      await db
        .update(homepageSections)
        .set({
          visible,
          updatedAt: new Date(),
        })
        .where(eq(homepageSections.id, section.id));
    }

    await logAudit({
      userId: session.user.id,
      action: "HOMEPAGE_SECTIONS",
      resource: "homepage_sections",
      details: "Visibilidad de secciones actualizado",
    });

    revalidatePath("/");
    revalidatePath("/admin/homepage");
  } catch (err) {
    console.error("[Homepage] Save sections failed:", err);
  }
}
