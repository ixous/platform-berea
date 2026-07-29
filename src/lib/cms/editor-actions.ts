"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { rateLimit } from "@/lib/rate-limit";
import { institutionalPages, pages, contact, donations, annualVision } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { updateEntity } from "./actions";

async function requireEditorAuth() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado.");
  return session;
}

const BANNER_FIELD_MAP: Record<string, string> = {
  title: "bannerTitle",
  subtitle: "bannerSubtitle",
  backgroundImage: "bannerImage",
};

export async function saveEntityBlock(
  entityType: string,
  id: string,
  data: Record<string, string>
) {
  console.log("[TRACE:11] saveEntityBlock — llamado", {
    entityType,
    id,
    data: JSON.stringify(data),
  });
  const session = await requireEditorAuth();
  if (!rateLimit(`editor:entity:${session.user.id}`, { windowMs: 60_000, max: 60 })) return;

  console.log("[TRACE:11] saveEntityBlock — llamando updateEntity");
  const result = await updateEntity(entityType, id, data as Record<string, unknown>);
  console.log("[TRACE:11] saveEntityBlock — updateEntity resultado:", JSON.stringify(result));

  revalidatePath("/admin/editor");

  return result;
}

export async function saveInstitutionalPageBanner(slug: string, data: Record<string, string>) {
  console.log("[TRACE:11] saveInstitutionalPageBanner — llamado", {
    slug,
    data: JSON.stringify(data),
  });
  const session = await requireEditorAuth();
  if (!rateLimit(`editor:banner:${session.user.id}`, { windowMs: 60_000, max: 30 })) return;

  const updateData: Record<string, unknown> = {};
  for (const [blockField, dbField] of Object.entries(BANNER_FIELD_MAP)) {
    if (blockField in data) {
      updateData[dbField] = data[blockField];
    } else {
      console.log(
        "[TRACE:11] saveInstitutionalPageBanner — campo NO encontrado en data:",
        blockField,
        "→",
        dbField
      );
    }
  }
  console.log(
    "[TRACE:11] saveInstitutionalPageBanner — updateData construido:",
    JSON.stringify(updateData)
  );
  updateData.updatedAt = new Date();

  try {
    const [existing] = await db
      .select({ id: institutionalPages.id })
      .from(institutionalPages)
      .where(eq(institutionalPages.slug, slug))
      .limit(1);

    if (existing) {
      await db
        .update(institutionalPages)
        .set(updateData)
        .where(eq(institutionalPages.id, existing.id));
    } else {
      await db
        .insert(institutionalPages)
        .values({ slug, ...updateData } as typeof institutionalPages.$inferInsert)
        .onConflictDoNothing({ target: institutionalPages.slug });
    }

    await logAudit({
      userId: session.user.id,
      action: "EDITOR_UPDATE_BANNER",
      resource: "institutional_pages",
      resourceId: existing?.id,
      details: `Banner actualizado: "${slug}"`,
    });

    revalidatePath(`/${slug}`);
    revalidatePath("/admin/editor");
  } catch (err) {
    console.error("[Editor] Save banner failed:", err);
  }
}

export async function savePageIntro(slug: string, data: Record<string, string>) {
  const session = await requireEditorAuth();
  if (!rateLimit(`editor:page:${session.user.id}`, { windowMs: 60_000, max: 30 })) return;

  try {
    const [existing] = await db
      .select({ id: pages.id })
      .from(pages)
      .where(eq(pages.slug, slug))
      .limit(1);

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };
    if ("content" in data) updateData.content = data.content;

    if (existing) {
      await db.update(pages).set(updateData).where(eq(pages.id, existing.id));
    }

    await logAudit({
      userId: session.user.id,
      action: "EDITOR_UPDATE_CONTENT",
      resource: "pages",
      resourceId: existing?.id,
      details: `Contenido actualizado: "${slug}"`,
    });

    revalidatePath(`/${slug}`);
    revalidatePath("/admin/editor");
  } catch (err) {
    console.error("[Editor] Save page content failed:", err);
  }
}

export async function saveContactInfo(data: Record<string, string>) {
  const session = await requireEditorAuth();
  if (!rateLimit(`editor:contact:${session.user.id}`, { windowMs: 60_000, max: 30 })) return;

  try {
    const [existing] = await db.select({ id: contact.id }).from(contact).limit(1);

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    const allowed = ["churchName", "address", "phone", "email", "whatsapp", "mapUrl"] as const;
    for (const field of allowed) {
      if (field in data) updateData[field] = data[field];
    }

    if (existing) {
      await db.update(contact).set(updateData).where(eq(contact.id, existing.id));
    }

    await logAudit({
      userId: session.user.id,
      action: "EDITOR_UPDATE_CONTACT",
      resource: "contact",
      details: "Información de contacto actualizada",
    });

    revalidatePath("/contacto");
    revalidatePath("/admin/editor");
  } catch (err) {
    console.error("[Editor] Save contact failed:", err);
  }
}

export async function saveDonationInfo(data: Record<string, string>) {
  const session = await requireEditorAuth();
  if (!rateLimit(`editor:donation:${session.user.id}`, { windowMs: 60_000, max: 30 })) return;

  try {
    const [existing] = await db
      .select({ id: donations.id })
      .from(donations)
      .where(eq(donations.status, "active"))
      .limit(1);

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    const allowed = ["title", "description", "message", "ctaButtonText", "ctaButtonHref"] as const;
    for (const field of allowed) {
      if (field in data) updateData[field] = data[field];
    }

    if (existing) {
      await db.update(donations).set(updateData).where(eq(donations.id, existing.id));
    }

    await logAudit({
      userId: session.user.id,
      action: "EDITOR_UPDATE_DONATION",
      resource: "donations",
      details: "Información de donaciones actualizada",
    });

    revalidatePath("/donaciones");
    revalidatePath("/admin/editor");
  } catch (err) {
    console.error("[Editor] Save donation failed:", err);
  }
}

export async function saveAnnualVision(data: Record<string, string>) {
  const session = await requireEditorAuth();
  if (!rateLimit(`editor:vision:${session.user.id}`, { windowMs: 60_000, max: 30 })) return;

  try {
    const [existing] = await db
      .select({ id: annualVision.id })
      .from(annualVision)
      .where(eq(annualVision.status, "published"))
      .limit(1);

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    const allowed = ["name", "verse", "description"] as const;
    for (const field of allowed) {
      if (field in data) updateData[field] = data[field];
    }

    if (existing) {
      await db.update(annualVision).set(updateData).where(eq(annualVision.id, existing.id));
    }

    await logAudit({
      userId: session.user.id,
      action: "EDITOR_UPDATE_VISION",
      resource: "annual_vision",
      details: "Visión anual actualizada",
    });

    revalidatePath("/vision-anual");
    revalidatePath("/admin/editor");
  } catch (err) {
    console.error("[Editor] Save vision failed:", err);
  }
}
