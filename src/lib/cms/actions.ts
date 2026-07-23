/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/rbac";
import { logAudit } from "@/lib/audit";
import { rateLimit } from "@/lib/rate-limit";
import { getEntityConfig } from "./config";
import { generateSlug, sanitizeHtml } from "./utils";
import * as schema from "@/lib/db/schema";
import { eq, and, isNull, or, ilike, desc, asc, count, sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm";

const ITEMS_PER_PAGE = 20;

async function requireAuth(permission: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado.");
  const allowed = await hasPermission(permission);
  if (!allowed) throw new Error("No tienes permiso para realizar esta accion.");
  return session;
}

async function createVersion(
  entityType: string,
  entityId: string,
  userId: string,
  content: Record<string, unknown>,
  comment?: string
) {
  const existing = await db
    .select({ max: sql`COALESCE(MAX(${schema.contentVersions.versionNumber}), 0)`.mapWith(Number) })
    .from(schema.contentVersions)
    .where(
      and(
        eq(schema.contentVersions.entityType, entityType),
        eq(schema.contentVersions.entityId, entityId)
      )
    );

  const versionNumber = (existing[0]?.max ?? 0) + 1;

  await db.insert(schema.contentVersions).values({
    entityType,
    entityId,
    versionNumber,
    userId,
    content,
    comment: comment || `Version ${versionNumber}`,
    status: "draft",
  });
}

const tableRegistry: Record<string, any> = {
  pages: schema.pages,
  devotionals: schema.devotionals,
  events: schema.events,
  ministries: schema.ministries,
  serviceMinistries: schema.serviceMinistries,
  biblicalPrograms: schema.biblicalPrograms,
  cells: schema.cells,
  annualVision: schema.annualVision,
  auditorium: schema.auditorium,
  donations: schema.donations,
  contact: schema.contact,
  leadership: schema.users,
};

function getTable(entityType: string): any {
  const table = tableRegistry[entityType];
  if (!table) throw new Error(`Schema not found for "${entityType}"`);
  return table;
}

export interface ListResult {
  items: Record<string, unknown>[];
  total: number;
  page: number;
  totalPages: number;
}

export async function listEntities(
  entityType: string,
  search?: string,
  page = 1,
  statusFilter?: string
): Promise<ListResult> {
  const config = getEntityConfig(entityType);
  if (!config) throw new Error(`Entity type "${entityType}" not found.`);

  await requireAuth(config.permission);
  const table = getTable(entityType);

  const conditions: any[] = [];

  if (config.softDelete && table.deletedAt) {
    conditions.push(isNull(table.deletedAt));
  }

  if (search && config.listSearchFields.length > 0) {
    const searchValue = `%${search}%`;
    const orConds: SQL[] = config.listSearchFields
      .map((field) => {
        const col = table[field];
        if (!col) return null;
        return ilike(col, searchValue);
      })
      .filter((c): c is SQL => c !== null);
    if (orConds.length > 0) {
      conditions.push(or(...orConds));
    }
  }

  if (statusFilter && config.statusField && table[config.statusField]) {
    conditions.push(eq(table[config.statusField], statusFilter));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const countResult = await db.select({ total: count() }).from(table).where(whereClause);

  const total = Number((countResult[0] as { total: number } | undefined)?.total ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const sortField = config.defaultSort?.field || "updatedAt";
  const sortDir = config.defaultSort?.dir || "desc";
  const sortCol = table[sortField];
  const orderFn = sortDir === "asc" ? asc : desc;

  const rawItems = await db
    .select()
    .from(table)
    .where(whereClause)
    .orderBy(sortCol ? orderFn(sortCol) : desc(table.createdAt || table.id))
    .limit(ITEMS_PER_PAGE)
    .offset((safePage - 1) * ITEMS_PER_PAGE);

  const items = rawItems.map((item) => {
    const record: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(item as object)) {
      record[key] = value;
    }
    return record;
  });

  return { items, total, page: safePage, totalPages };
}

export async function getEntity(
  entityType: string,
  id: string
): Promise<Record<string, unknown> | null> {
  const config = getEntityConfig(entityType);
  if (!config) throw new Error(`Entity type "${entityType}" not found.`);
  await requireAuth(config.permission);

  const table = getTable(entityType);

  const [result] = await db.select().from(table).where(eq(table.id, id)).limit(1);

  if (!result) return null;

  const record: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(result as object)) {
    record[key] = value;
  }
  return record;
}

export interface CmsActionResult {
  success: boolean;
  error?: string;
  id?: string;
}

export async function createEntity(
  entityType: string,
  data: Record<string, unknown>
): Promise<CmsActionResult> {
  const config = getEntityConfig(entityType);
  if (!config) return { success: false, error: "Tipo de contenido no valido." };

  const session = await requireAuth(config.permission);

  if (!rateLimit(`cms:create:${session.user.id}`, { windowMs: 60_000, max: 30 })) {
    return { success: false, error: "Demasiadas operaciones. Espera un minuto." };
  }

  const table = getTable(entityType);

  const sanitizedData: Record<string, unknown> = { ...data };

  for (const field of config.fields) {
    const val = sanitizedData[field.name];
    if (val !== undefined) {
      if (field.type === "textarea" || field.type === "richtext") {
        sanitizedData[field.name] = sanitizeHtml(String(val));
      }
      if (field.type === "number" && String(val) !== "") {
        sanitizedData[field.name] = Number(val);
      }
    }
  }

  const slugField = config.fields.find((f) => f.name === "slug");
  if (slugField) {
    const titleField = config.fields.find((f) => f.name === "title" || f.name === "name");
    const existingSlug = sanitizedData["slug"] as string | undefined;
    if (!existingSlug && titleField) {
      const titleVal = sanitizedData[titleField.name] as string | undefined;
      if (titleVal) {
        sanitizedData["slug"] = generateSlug(titleVal);
      }
    }
  }

  try {
    const inserted = (await db.insert(table).values(sanitizedData).returning()) as any;

    const recordId = inserted[0]?.id;

    await createVersion(entityType, recordId, session.user.id, sanitizedData, "Creacion inicial");
    await logAudit({
      userId: session.user.id,
      action: "CMS_CREATE",
      resource: entityType,
      resourceId: recordId,
      details: `Creado: ${config.displayName}`,
    });

    revalidatePath(`/admin/content/${entityType}`);
    return { success: true, id: recordId };
  } catch (err) {
    console.error(`[CMS] Create ${entityType} failed:`, err);
    return { success: false, error: "Error al crear el registro." };
  }
}

export async function updateEntity(
  entityType: string,
  id: string,
  data: Record<string, unknown>
): Promise<CmsActionResult> {
  const config = getEntityConfig(entityType);
  if (!config) return { success: false, error: "Tipo de contenido no valido." };

  const session = await requireAuth(config.permission);

  if (!rateLimit(`cms:update:${session.user.id}`, { windowMs: 60_000, max: 30 })) {
    return { success: false, error: "Demasiadas operaciones. Espera un minuto." };
  }

  const table = getTable(entityType);

  const sanitizedData: Record<string, unknown> = {};
  for (const field of config.fields) {
    const val = data[field.name];
    if (val !== undefined) {
      if (field.type === "textarea" || field.type === "richtext") {
        sanitizedData[field.name] = sanitizeHtml(String(val));
      } else if (field.type === "number" && String(val) !== "") {
        sanitizedData[field.name] = Number(val);
      } else {
        sanitizedData[field.name] = val;
      }
    }
  }

  sanitizedData["updatedAt"] = new Date();

  try {
    await db.update(table).set(sanitizedData).where(eq(table.id, id));

    await createVersion(entityType, id, session.user.id, sanitizedData, "Actualizacion");
    await logAudit({
      userId: session.user.id,
      action: "CMS_UPDATE",
      resource: entityType,
      resourceId: id,
      details: `Actualizado: ${config.displayName}`,
    });

    revalidatePath(`/admin/content/${entityType}`);
    revalidatePath(`/admin/content/${entityType}/${id}`);
    return { success: true, id };
  } catch (err) {
    console.error(`[CMS] Update ${entityType} failed:`, err);
    return { success: false, error: "Error al actualizar el registro." };
  }
}

export async function deleteEntity(entityType: string, id: string): Promise<CmsActionResult> {
  const config = getEntityConfig(entityType);
  if (!config) return { success: false, error: "Tipo de contenido no valido." };

  const session = await requireAuth(config.permission);

  if (!rateLimit(`cms:delete:${session.user.id}`, { windowMs: 60_000, max: 20 })) {
    return { success: false, error: "Demasiadas operaciones. Espera un minuto." };
  }

  const table = getTable(entityType);

  try {
    if (config.softDelete) {
      await db.update(table).set({ deletedAt: new Date() }).where(eq(table.id, id));
    } else {
      await db.delete(table).where(eq(table.id, id));
    }

    await logAudit({
      userId: session.user.id,
      action: "CMS_DELETE",
      resource: entityType,
      resourceId: id,
      details: `${config.softDelete ? "Soft-deleted" : "Eliminado"}: ${config.displayName}`,
    });

    revalidatePath(`/admin/content/${entityType}`);
    return { success: true, id };
  } catch (err) {
    console.error(`[CMS] Delete ${entityType} failed:`, err);
    return { success: false, error: "Error al eliminar el registro." };
  }
}

export async function restoreEntity(entityType: string, id: string): Promise<CmsActionResult> {
  const config = getEntityConfig(entityType);
  if (!config) return { success: false, error: "Tipo de contenido no valido." };
  if (!config.softDelete) return { success: false, error: "Esta entidad no soporta restauracion." };

  const session = await requireAuth(config.permission);

  if (!rateLimit(`cms:restore:${session.user.id}`, { windowMs: 60_000, max: 20 })) {
    return { success: false, error: "Demasiadas operaciones. Espera un minuto." };
  }

  const table = getTable(entityType);

  try {
    await db.update(table).set({ deletedAt: null }).where(eq(table.id, id));

    await logAudit({
      userId: session.user.id,
      action: "CMS_RESTORE",
      resource: entityType,
      resourceId: id,
      details: `Restaurado: ${config.displayName}`,
    });

    revalidatePath(`/admin/content/${entityType}`);
    return { success: true, id };
  } catch (err) {
    console.error(`[CMS] Restore ${entityType} failed:`, err);
    return { success: false, error: "Error al restaurar el registro." };
  }
}

export async function changeEntityStatus(
  entityType: string,
  id: string,
  newStatus: string
): Promise<CmsActionResult> {
  const config = getEntityConfig(entityType);
  if (!config) return { success: false, error: "Tipo de contenido no valido." };
  if (!config.statusField) return { success: false, error: "Sin campo de estado." };

  const session = await requireAuth(config.permission);

  const table = getTable(entityType);

  try {
    const updateData: Record<string, unknown> = {
      [config.statusField]: newStatus,
      updatedAt: new Date(),
    };

    if (newStatus === "published") {
      updateData["publishedAt"] = new Date();
    }

    await db.update(table).set(updateData).where(eq(table.id, id));

    await logAudit({
      userId: session.user.id,
      action: "CMS_STATUS",
      resource: entityType,
      resourceId: id,
      details: `Estado cambiado a "${newStatus}": ${config.displayName}`,
    });

    revalidatePath(`/admin/content/${entityType}`);
    revalidatePath(`/admin/content/${entityType}/${id}`);
    return { success: true, id };
  } catch (err) {
    console.error(`[CMS] Status change ${entityType} failed:`, err);
    return { success: false, error: "Error al cambiar el estado." };
  }
}
