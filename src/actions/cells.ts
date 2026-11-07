"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { cellRequests, contactSubmissions, cells } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/rbac";
import { logAudit } from "@/lib/audit";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeHtml } from "@/lib/cms/utils";
import { eq, desc, and, count, ilike, or, type SQL } from "drizzle-orm";

const ITEMS_PER_PAGE = 20;

// Número de WhatsApp para coordinar células (por ahora el del usuario, configurable vía ENV)
const WHATSAPP_COORDINATOR = process.env.CELLS_WHATSAPP_NUMBER || "526861959581";

const cellRequestSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(255),
  phone: z.string().min(7, "Por favor ingresa un número de teléfono válido").max(50),
  email: z.string().email("Correo electrónico inválido").max(255).optional().or(z.literal("")),
  neighborhood: z.string().min(2, "Por favor indica tu colonia o zona de Mexicali").max(255),
  cellType: z.string().max(100).optional().default("Familiar"),
  preferredSchedule: z.string().max(100).optional().default(""),
  notes: z.string().max(1000).optional().default(""),
});

export type SubmitCellState = {
  success: boolean;
  error?: string;
  message?: string;
  whatsappUrl?: string;
  fields?: Record<string, string>;
};

async function getClientIp(): Promise<string> {
  try {
    const { headers } = await import("next/headers");
    const h = await headers();
    return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  } catch {
    return "unknown";
  }
}

export async function submitCellRequest(
  prevState: SubmitCellState,
  formData: FormData
): Promise<SubmitCellState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = cellRequestSchema.safeParse(raw);

  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const [key, val] of formData.entries()) {
      if (typeof val === "string") fields[key] = val;
    }
    return {
      success: false,
      error: parsed.error.issues.map((e) => e.message).join(". "),
      fields,
    };
  }

  const { name, phone, email, neighborhood, cellType, preferredSchedule, notes } = parsed.data;

  const ip = await getClientIp();

  if (!rateLimit(`cell_request:${ip}`, { windowMs: 60_000, max: 6 })) {
    return {
      success: false,
      error: "Demasiadas solicitudes. Por favor espera un minuto antes de reintentar.",
    };
  }

  const sanitizedName = sanitizeHtml(name.trim());
  const sanitizedPhone = phone.trim();
  const sanitizedNeighborhood = sanitizeHtml(neighborhood.trim());
  const sanitizedType = sanitizeHtml(cellType || "Familiar");
  const sanitizedSchedule = preferredSchedule ? sanitizeHtml(preferredSchedule.trim()) : null;
  const sanitizedNotes = notes ? sanitizeHtml(notes.trim()) : null;

  try {
    // 1. Guardar en tabla dedicada cellRequests
    const [inserted] = await db
      .insert(cellRequests)
      .values({
        name: sanitizedName,
        phone: sanitizedPhone,
        email: email || null,
        neighborhood: sanitizedNeighborhood,
        cellType: sanitizedType,
        preferredSchedule: sanitizedSchedule,
        notes: sanitizedNotes,
        ipAddress: ip,
        status: "pending",
      })
      .returning();

    // 2. Respaldo en contactSubmissions para visibilidad central
    try {
      const backupEmail =
        email && email.trim()
          ? email.trim()
          : `whatsapp-${sanitizedPhone.replace(/\D/g, "")}@centrocristianoberea.org`;

      const detailMessage = [
        `SOLICITUD DE CÉLULA (EMBUDO DE CONEXIÓN):`,
        `Nombre: ${sanitizedName}`,
        `WhatsApp: ${sanitizedPhone}`,
        `Colonia / Zona: ${sanitizedNeighborhood}`,
        `Tipo de grupo deseado: ${sanitizedType}`,
        sanitizedSchedule ? `Horario preferido: ${sanitizedSchedule}` : null,
        sanitizedNotes ? `Notas: ${sanitizedNotes}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      await db.insert(contactSubmissions).values({
        name: sanitizedName,
        email: backupEmail,
        phone: sanitizedPhone,
        subject: `Interés en Célula: ${sanitizedNeighborhood} (${sanitizedType})`,
        message: detailMessage,
        ipAddress: ip,
        status: "pending",
      });
    } catch (backupErr) {
      console.warn("[CellRequest] Backup in contactSubmissions skipped:", backupErr);
    }

    // 3. Generar enlace de WhatsApp con mensaje pre-redactado
    const whatsappText = `¡Hola Centro Cristiano Berea! 👋
Me llamo *${sanitizedName}*, vivo en la colonia *${sanitizedNeighborhood}* y me acabo de registrar en el sitio web para conectarme a una célula (${sanitizedType}). ¿Me podrían compartir qué grupo me queda más cercano? ¡Muchas gracias!`;

    const cleanCoordinatorPhone = WHATSAPP_COORDINATOR.replace(/\D/g, "");
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanCoordinatorPhone}&text=${encodeURIComponent(
      whatsappText
    )}`;

    return {
      success: true,
      message:
        "¡Tus datos han sido registrados con éxito! A continuación te conectaremos directamente por WhatsApp.",
      whatsappUrl,
    };
  } catch (err) {
    console.error("[CellRequest] Failed to save request:", err);
    return {
      success: false,
      error: "Hubo un error al registrar tu solicitud. Por favor intenta de nuevo.",
    };
  }
}

export interface CellRequestItem {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  neighborhood: string;
  cellType: string | null;
  preferredSchedule: string | null;
  notes: string | null;
  status: string;
  createdAt: Date;
}

export async function getCellRequests(
  query: string = "",
  page: number = 1,
  statusFilter: string = ""
): Promise<{ items: CellRequestItem[]; total: number; totalPages: number }> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autenticado");
  const allowed = await hasPermission("contact.manage");
  if (!allowed) throw new Error("No autorizado");

  const safePage = Math.max(1, page);
  const conditions: SQL[] = [];

  if (query) {
    const likePattern = `%${query}%`;
    conditions.push(
      or(
        ilike(cellRequests.name, likePattern),
        ilike(cellRequests.phone, likePattern),
        ilike(cellRequests.neighborhood, likePattern)
      )!
    );
  }

  if (statusFilter) {
    conditions.push(eq(cellRequests.status, statusFilter));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [totalResult] = await db.select({ count: count() }).from(cellRequests).where(whereClause);

  const total = totalResult?.count ?? 0;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const items = await db
    .select()
    .from(cellRequests)
    .where(whereClause)
    .orderBy(desc(cellRequests.createdAt))
    .limit(ITEMS_PER_PAGE)
    .offset((safePage - 1) * ITEMS_PER_PAGE);

  return { items, total, totalPages };
}

export async function updateCellRequestStatus(
  id: string,
  newStatus: "pending" | "contacted" | "assigned" | "integrated" | "archived"
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autenticado");
  const allowed = await hasPermission("contact.manage");
  if (!allowed) throw new Error("No autorizado");

  try {
    await db
      .update(cellRequests)
      .set({ status: newStatus, updatedAt: new Date() })
      .where(eq(cellRequests.id, id));

    await logAudit({
      action: "UPDATE_STATUS",
      resource: "cell_request",
      details: `Solicitud de célula ${id} marcada como ${newStatus}`,
    });

    return { success: true };
  } catch (err) {
    console.error("[CellRequest] Update status error:", err);
    return { success: false, error: "Error al actualizar el estado" };
  }
}

export async function exportCellRequestsCSV(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autenticado");
  const allowed = await hasPermission("contact.manage");
  if (!allowed) throw new Error("No autorizado");

  const items = await db.select().from(cellRequests).orderBy(desc(cellRequests.createdAt));

  const headers = [
    "ID",
    "Nombre",
    "WhatsApp / Teléfono",
    "Correo",
    "Colonia / Zona",
    "Tipo de Célula",
    "Horario Preferido",
    "Notas",
    "Estado",
    "Fecha de Registro",
  ];

  const escapeCSV = (val: string | null | undefined): string => {
    if (!val) return '""';
    const escaped = val.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const rows = items.map((r) => [
    escapeCSV(r.id),
    escapeCSV(r.name),
    escapeCSV(r.phone),
    escapeCSV(r.email),
    escapeCSV(r.neighborhood),
    escapeCSV(r.cellType),
    escapeCSV(r.preferredSchedule),
    escapeCSV(r.notes),
    escapeCSV(r.status),
    escapeCSV(r.createdAt.toISOString()),
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}
