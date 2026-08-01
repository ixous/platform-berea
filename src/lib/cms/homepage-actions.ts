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

const BLOCK_FIELD_MAP: Record<string, string[]> = {
  hero: [
    "heroTagline",
    "heroTitle",
    "heroSubtitle",
    "heroCtaText",
    "heroCtaHref",
    "heroSecondaryCtaText",
    "heroSecondaryCtaHref",
    "heroBackgroundImage",
    "heroImageAlt",
  ],
  welcome: [
    "welcomeTitle",
    "welcomeDescription",
    "welcomeCtaText",
    "welcomeCtaHref",
    "welcomeCtaSecondaryText",
    "welcomeCtaSecondaryHref",
  ],
  cta: ["ctaTitle", "ctaDescription", "ctaButtonText", "ctaButtonHref", "ctaBackgroundImage"],
};

export async function saveHomepageBlock(blockKey: string, data: Record<string, string>) {
  const session = await requireHomepageAuth();
  if (!rateLimit(`homepage:save:${session.user.id}`, { windowMs: 60_000, max: 30 })) return;

  const allowedFields = BLOCK_FIELD_MAP[blockKey];
  if (!allowedFields) throw new Error(`Bloque desconocido: ${blockKey}`);

  const updateData: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (field in data) updateData[field] = data[field];
  }

  try {
    const [existing] = await db.select({ id: homepageSettings.id }).from(homepageSettings).limit(1);

    if (existing) {
      await db
        .update(homepageSettings)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(homepageSettings.id, existing.id));
    } else {
      await db.insert(homepageSettings).values(updateData as any);
    }

    await logAudit({
      userId: session.user.id,
      action: "HOMEPAGE_UPDATE",
      resource: "homepage_settings",
      details: `Bloque "${blockKey}" actualizado desde editor visual`,
    });

    revalidatePath("/");
  } catch (err) {
    console.error("[Homepage] Save block failed:", err);
    throw new Error("Error al guardar el bloque.");
  }
}

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
  } catch (err) {
    console.error("[Homepage] Save sections failed:", err);
  }
}

export async function saveHomepageSection(sectionKey: string, data: Record<string, string>) {
  const session = await requireHomepageAuth();
  if (!rateLimit(`homepage:section:${session.user.id}`, { windowMs: 60_000, max: 30 })) return;

  const allowedFields = ["title", "subtitle"];
  const updateData: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (field in data) updateData[field] = data[field];
  }

  try {
    const [existing] = await db
      .select({ id: homepageSections.id })
      .from(homepageSections)
      .where(eq(homepageSections.sectionKey, sectionKey))
      .limit(1);

    if (existing) {
      await db
        .update(homepageSections)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(homepageSections.id, existing.id));
    }

    await logAudit({
      userId: session.user.id,
      action: "HOMEPAGE_SECTIONS",
      resource: "homepage_sections",
      details: `Sección "${sectionKey}" actualizada desde editor visual`,
    });

    revalidatePath("/");
  } catch (err) {
    console.error("[Homepage] Save section failed:", err);
    throw new Error("Error al guardar la sección.");
  }
}

export async function toggleHomepageSection(sectionKey: string, visible: boolean) {
  const session = await requireHomepageAuth();
  if (!rateLimit(`homepage:section:${session.user.id}`, { windowMs: 60_000, max: 30 })) return;

  try {
    const [existing] = await db
      .select({ id: homepageSections.id })
      .from(homepageSections)
      .where(eq(homepageSections.sectionKey, sectionKey))
      .limit(1);

    if (existing) {
      await db
        .update(homepageSections)
        .set({ visible, updatedAt: new Date() })
        .where(eq(homepageSections.id, existing.id));
    }

    await logAudit({
      userId: session.user.id,
      action: "HOMEPAGE_SECTIONS",
      resource: "homepage_sections",
      details: `Sección "${sectionKey}" ${visible ? "mostrada" : "ocultada"} desde editor visual`,
    });

    revalidatePath("/");
  } catch (err) {
    console.error("[Homepage] Toggle section failed:", err);
    throw new Error("Error al actualizar la sección.");
  }
}
