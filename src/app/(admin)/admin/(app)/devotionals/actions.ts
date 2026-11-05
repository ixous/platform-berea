"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/rbac";
import { devotionals } from "@/lib/db/schema";
import { generateSlug } from "@/lib/cms/utils";
import { eq, desc, isNull, and } from "drizzle-orm";

async function requireDevotionalsAuth() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autenticado");
  const allowed = await hasPermission("devotionals.manage").catch(() => true);
  if (!allowed && session.user.roleId !== "admin") {
    throw new Error("Sin permisos para gestionar devocionales");
  }
  return session;
}

export async function createDevotional(formData: {
  title: string;
  verse?: string;
  excerpt?: string;
  content: string;
  imageUrl?: string;
  featured?: boolean;
  status?: "draft" | "published";
}) {
  const session = await requireDevotionalsAuth();

  const title = formData.title.trim();
  if (!title) throw new Error("El título es obligatorio");
  if (!formData.content?.trim()) throw new Error("El contenido es obligatorio");

  // Obtener slugs existentes para evitar colisiones
  const existingRows = await db
    .select({ slug: devotionals.slug })
    .from(devotionals)
    .where(isNull(devotionals.deletedAt));
  const existingSlugs = existingRows.map((r) => r.slug);
  const slug = generateSlug(title, existingSlugs);

  const status = formData.status || "published";
  const publishedAt = status === "published" ? new Date() : null;

  const [created] = await db
    .insert(devotionals)
    .values({
      title,
      slug,
      verse: formData.verse?.trim() || null,
      excerpt: formData.excerpt?.trim() || null,
      content: formData.content.trim(),
      imageUrl: formData.imageUrl?.trim() || null,
      featured: Boolean(formData.featured),
      authorId: session.user.id,
      status,
      publishedAt,
    })
    .returning();

  revalidatePath("/");
  revalidatePath("/devocionales");
  revalidatePath("/admin/devotionals");

  return { success: true, item: created };
}

export async function updateDevotional(
  id: string,
  formData: {
    title: string;
    verse?: string;
    excerpt?: string;
    content: string;
    imageUrl?: string;
    featured?: boolean;
    status?: "draft" | "published";
  }
) {
  await requireDevotionalsAuth();

  const title = formData.title.trim();
  if (!title) throw new Error("El título es obligatorio");
  if (!formData.content?.trim()) throw new Error("El contenido es obligatorio");

  const [existing] = await db
    .select()
    .from(devotionals)
    .where(and(eq(devotionals.id, id), isNull(devotionals.deletedAt)))
    .limit(1);

  if (!existing) throw new Error("Devocional no encontrado");

  const status = formData.status || existing.status;
  const publishedAt =
    status === "published" && !existing.publishedAt ? new Date() : existing.publishedAt;

  await db
    .update(devotionals)
    .set({
      title,
      verse: formData.verse?.trim() || null,
      excerpt: formData.excerpt?.trim() || null,
      content: formData.content.trim(),
      imageUrl: formData.imageUrl?.trim() || null,
      featured: Boolean(formData.featured),
      status,
      publishedAt,
      updatedAt: new Date(),
    })
    .where(eq(devotionals.id, id));

  revalidatePath("/");
  revalidatePath("/devocionales");
  revalidatePath(`/devocionales/${existing.slug}`);
  revalidatePath("/admin/devotionals");

  return { success: true };
}

export async function deleteDevotional(id: string) {
  await requireDevotionalsAuth();

  await db.update(devotionals).set({ deletedAt: new Date() }).where(eq(devotionals.id, id));

  revalidatePath("/");
  revalidatePath("/devocionales");
  revalidatePath("/admin/devotionals");

  return { success: true };
}

export async function toggleDevotionalStatus(id: string) {
  await requireDevotionalsAuth();

  const [item] = await db
    .select()
    .from(devotionals)
    .where(and(eq(devotionals.id, id), isNull(devotionals.deletedAt)))
    .limit(1);

  if (!item) throw new Error("Devocional no encontrado");

  const newStatus = item.status === "published" ? "draft" : "published";
  const publishedAt =
    newStatus === "published" && !item.publishedAt ? new Date() : item.publishedAt;

  await db
    .update(devotionals)
    .set({
      status: newStatus,
      publishedAt,
      updatedAt: new Date(),
    })
    .where(eq(devotionals.id, id));

  revalidatePath("/");
  revalidatePath("/devocionales");
  revalidatePath("/admin/devotionals");

  return { success: true, status: newStatus };
}
