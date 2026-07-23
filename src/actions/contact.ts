"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/rbac";
import { logAudit } from "@/lib/audit";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeHtml } from "@/lib/cms/utils";
import {
  sendEmail,
  confirmationTemplate,
  adminNotificationTemplate,
  replyTemplate,
} from "@/lib/email";
import { eq, desc, and, count, ilike, or, type SQL } from "drizzle-orm";

const ITEMS_PER_PAGE = 20;

const submitSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(255),
  email: z.string().email("Correo electrónico inválido").max(255),
  phone: z.string().max(50).optional().default(""),
  subject: z.string().min(3, "El asunto debe tener al menos 3 caracteres").max(255),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres").max(5000),
  "cf-turnstile-response": z.string().min(1, "Verificación de seguridad requerida"),
});

const replySchema = z.object({
  message: z.string().min(1, "El mensaje de respuesta es requerido").max(5000),
});

export type SubmitContactState = {
  success: boolean;
  error?: string;
  message?: string;
  fields?: Record<string, string>;
};

export async function submitContact(
  prevState: SubmitContactState,
  formData: FormData
): Promise<SubmitContactState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = submitSchema.safeParse(raw);

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

  const {
    name,
    email,
    phone,
    subject,
    message,
    "cf-turnstile-response": turnstileToken,
  } = parsed.data;

  const ip = await getClientIp();

  if (!rateLimit(`contact:${ip}`, { windowMs: 60_000, max: 5 })) {
    return { success: false, error: "Demasiadas solicitudes. Espera un minuto." };
  }

  const turnstileValid = await verifyTurnstile(turnstileToken);
  if (!turnstileValid) {
    return { success: false, error: "Verificación de seguridad fallida. Intenta de nuevo." };
  }

  const sanitizedMessage = sanitizeHtml(message);
  const sanitizedSubject = sanitizeHtml(subject);
  const sanitizedName = sanitizeHtml(name);

  try {
    const [inserted] = await db
      .insert(contactSubmissions)
      .values({
        name: sanitizedName,
        email,
        phone: phone || null,
        subject: sanitizedSubject,
        message: sanitizedMessage,
        ipAddress: ip,
      })
      .returning();

    sendEmail({
      to: email,
      subject: "Hemos recibido tu mensaje — Centro Cristiano Berea",
      html: confirmationTemplate(sanitizedName, sanitizedSubject, sanitizedMessage),
      type: "contact_confirmation",
      referenceType: "contact_submission",
      referenceId: inserted.id,
    });

    const adminEmail = process.env.CONTACT_TO_EMAIL;
    if (adminEmail) {
      sendEmail({
        to: adminEmail,
        subject: `Nueva solicitud de contacto: ${sanitizedSubject}`,
        html: adminNotificationTemplate(
          sanitizedName,
          email,
          phone || null,
          sanitizedSubject,
          sanitizedMessage
        ),
        type: "admin_contact_alert",
        referenceType: "contact_submission",
        referenceId: inserted.id,
      });
    }

    return {
      success: true,
      message: "Mensaje enviado con éxito. Te hemos enviado una confirmación a tu correo.",
    };
  } catch (err) {
    console.error("[Contact] Failed to save submission:", err);
    return { success: false, error: "Error al enviar el mensaje. Intenta de nuevo." };
  }
}

async function verifyTurnstile(token: string): Promise<boolean> {
  if (process.env.NODE_ENV === "development") return true;

  try {
    const formData = new FormData();
    formData.append("secret", process.env.TURNSTILE_SECRET_KEY || "");
    formData.append("response", token);

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}

async function getClientIp(): Promise<string> {
  try {
    const { headers } = await import("next/headers");
    const h = await headers();
    return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  } catch {
    return "unknown";
  }
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  assignedTo: string | null;
  repliedAt: Date | null;
  replyMessage: string | null;
  ipAddress: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactListResult {
  items: ContactSubmission[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getSubmissions(
  search?: string,
  page = 1,
  statusFilter?: string
): Promise<ContactListResult> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado.");
  const allowed = await hasPermission("contact-submissions.manage");
  if (!allowed) throw new Error("No tienes permiso para gestionar solicitudes.");

  const conditions: SQL[] = [];

  if (search) {
    const likePattern = `%${search}%`;
    conditions.push(
      or(
        ilike(contactSubmissions.name, likePattern),
        ilike(contactSubmissions.email, likePattern),
        ilike(contactSubmissions.subject, likePattern),
        ilike(contactSubmissions.message, likePattern)
      ) as SQL
    );
  }

  if (statusFilter) {
    conditions.push(eq(contactSubmissions.status, statusFilter));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [countResult] = await db
    .select({ total: count() })
    .from(contactSubmissions)
    .where(whereClause);

  const total = Number(countResult?.total ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const items = await db
    .select()
    .from(contactSubmissions)
    .where(whereClause)
    .orderBy(desc(contactSubmissions.createdAt))
    .limit(ITEMS_PER_PAGE)
    .offset((safePage - 1) * ITEMS_PER_PAGE);

  return { items, total, page: safePage, totalPages };
}

export async function getSubmission(id: string): Promise<ContactSubmission | null> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado.");
  const allowed = await hasPermission("contact-submissions.manage");
  if (!allowed) throw new Error("No tienes permiso para gestionar solicitudes.");

  const [item] = await db
    .select()
    .from(contactSubmissions)
    .where(eq(contactSubmissions.id, id))
    .limit(1);

  return item || null;
}

export async function updateSubmissionStatus(
  id: string,
  newStatus: string
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "No autorizado." };
  const allowed = await hasPermission("contact-submissions.manage");
  if (!allowed) return { success: false, error: "No tienes permiso." };

  const validStatuses = ["pending", "read", "replied", "archived"];
  if (!validStatuses.includes(newStatus)) {
    return { success: false, error: "Estado inválido." };
  }

  try {
    const updateData: Record<string, unknown> = { status: newStatus, updatedAt: new Date() };
    if (newStatus === "read") {
      updateData.repliedAt = new Date();
    }
    if (newStatus === "replied") {
      updateData.repliedAt = new Date();
    }

    await db.update(contactSubmissions).set(updateData).where(eq(contactSubmissions.id, id));

    await logAudit({
      userId: session.user.id,
      action: "CONTACT_STATUS",
      resource: "contact_submission",
      resourceId: id,
      details: `Estado cambiado a "${newStatus}"`,
    });

    return { success: true };
  } catch {
    return { success: false, error: "Error al actualizar el estado." };
  }
}

export async function replyToSubmission(
  id: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "No autorizado." };
  const allowed = await hasPermission("contact-submissions.manage");
  if (!allowed) return { success: false, error: "No tienes permiso." };

  const raw = Object.fromEntries(formData.entries());
  const parsed = replySchema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues.map((e) => e.message).join(". ") };
  }

  const replyMessage = sanitizeHtml(parsed.data.message);

  try {
    const [submission] = await db
      .select()
      .from(contactSubmissions)
      .where(eq(contactSubmissions.id, id))
      .limit(1);

    if (!submission) return { success: false, error: "Solicitud no encontrada." };

    await db
      .update(contactSubmissions)
      .set({
        status: "replied",
        replyMessage,
        repliedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(contactSubmissions.id, id));

    sendEmail({
      to: submission.email,
      subject: "Respuesta a tu mensaje — Centro Cristiano Berea",
      html: replyTemplate(submission.name, replyMessage),
      type: "contact_reply",
      referenceType: "contact_submission",
      referenceId: id,
    });

    await logAudit({
      userId: session.user.id,
      action: "CONTACT_REPLY",
      resource: "contact_submission",
      resourceId: id,
      details: "Respuesta enviada al remitente.",
    });

    return { success: true };
  } catch (err) {
    console.error("[Contact] Reply failed:", err);
    return { success: false, error: "Error al enviar la respuesta." };
  }
}
