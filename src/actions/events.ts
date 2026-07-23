"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { events, eventRegistrations } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/rbac";
import { logAudit } from "@/lib/audit";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeHtml } from "@/lib/cms/utils";
import { sendEmail } from "@/lib/email";
import { eq, desc, and, count, ilike, or, isNull, type SQL, sql } from "drizzle-orm";

const ITEMS_PER_PAGE = 20;

const registerSchema = z.object({
  eventId: z.string().uuid("Evento inválido"),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(255),
  email: z.string().email("Correo electrónico inválido").max(255),
  phone: z.string().max(50).optional().default(""),
  guests: z.coerce
    .number()
    .int()
    .min(1, "Debes registrarte al menos tú")
    .max(20, "Máximo 20 personas"),
  notes: z.string().max(1000).optional().default(""),
  "cf-turnstile-response": z.string().min(1, "Verificación de seguridad requerida"),
});

export type RegisterEventState = {
  success: boolean;
  error?: string;
  message?: string;
  fields?: Record<string, string>;
};

export async function registerForEvent(
  prevState: RegisterEventState,
  formData: FormData
): Promise<RegisterEventState> {
  const raw = Object.fromEntries(formData.entries());

  const parsed = registerSchema.safeParse(raw);

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
    eventId,
    name,
    email,
    phone,
    guests,
    notes,
    "cf-turnstile-response": turnstileToken,
  } = parsed.data;

  const ip = await getClientIp();

  if (!rateLimit(`event-register:${ip}`, { windowMs: 60_000, max: 5 })) {
    return { success: false, error: "Demasiadas solicitudes. Espera un minuto." };
  }

  const turnstileValid = await verifyTurnstile(turnstileToken);
  if (!turnstileValid) {
    return { success: false, error: "Verificación de seguridad fallida. Intenta de nuevo." };
  }

  try {
    const [event] = await db
      .select()
      .from(events)
      .where(and(eq(events.id, eventId), eq(events.status, "published")))
      .limit(1);

    if (!event) return { success: false, error: "Evento no encontrado." };
    if (event.deletedAt) return { success: false, error: "Evento no disponible." };

    const eventDate = new Date(event.startDate);
    if (eventDate < new Date()) return { success: false, error: "El evento ya ha pasado." };

    const [existingRegistration] = await db
      .select()
      .from(eventRegistrations)
      .where(
        and(
          eq(eventRegistrations.eventId, eventId),
          eq(eventRegistrations.email, email),
          eq(eventRegistrations.status, "confirmed")
        )
      )
      .limit(1);

    if (existingRegistration) {
      return { success: false, error: "Ya estás registrado en este evento." };
    }

    if (event.capacity) {
      const [countResult] = await db
        .select({ total: sql<number>`COALESCE(SUM(${eventRegistrations.guests}), 0)::int` })
        .from(eventRegistrations)
        .where(
          and(eq(eventRegistrations.eventId, eventId), eq(eventRegistrations.status, "confirmed"))
        );

      const currentAttendees = Number(countResult?.total ?? 0);
      if (currentAttendees + guests > event.capacity) {
        const remaining = event.capacity - currentAttendees;
        return {
          success: false,
          error: `Cupo insuficiente. Quedan ${remaining} lugar(es) disponible(s).`,
        };
      }
    }

    const sanitizedNotes = notes ? sanitizeHtml(notes) : null;

    const [inserted] = await db
      .insert(eventRegistrations)
      .values({
        eventId,
        name: sanitizeHtml(name),
        email,
        phone: phone || null,
        guests,
        notes: sanitizedNotes,
        ipAddress: ip,
        status: "confirmed",
        confirmedAt: new Date(),
      })
      .returning();

    const eventTitle = event.title;
    const eventDateStr = eventDate.toLocaleDateString("es-MX", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    logAudit({
      userId: null,
      action: "REGISTER_FOR_EVENT",
      resource: "event_registration",
      resourceId: inserted.id,
      details: `${name} (${email}) se registró a "${eventTitle}" con ${guests} persona(s)`,
    });

    sendEmail({
      to: email,
      subject: `Confirmación de registro — ${eventTitle}`,
      html: registrationConfirmationTemplate(
        name,
        eventTitle,
        eventDateStr,
        event.time || "",
        event.location || "",
        guests
      ),
      type: "event_confirmation",
      referenceType: "event_registration",
      referenceId: inserted.id,
    });

    const adminEmail = process.env.CONTACT_TO_EMAIL;
    if (adminEmail) {
      sendEmail({
        to: adminEmail,
        subject: `Nuevo registro: ${name} — ${eventTitle}`,
        html: adminRegistrationNotificationTemplate(
          name,
          email,
          phone || null,
          guests,
          notes || null,
          eventTitle,
          eventDateStr
        ),
        type: "admin_event_alert",
        referenceType: "event_registration",
        referenceId: inserted.id,
      });
    }

    return {
      success: true,
      message: `¡Registro confirmado! Te hemos enviado un correo con los detalles.`,
    };
  } catch (err) {
    console.error("[Events] Register failed:", err);
    return { success: false, error: "Error al registrarse. Intenta de nuevo." };
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

export interface EventRegistration {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone: string | null;
  guests: number;
  notes: string | null;
  status: string;
  confirmedAt: Date | null;
  cancelledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegistrationListResult {
  items: EventRegistration[];
  total: number;
  page: number;
  totalPages: number;
  eventTitle: string;
}

export async function getRegistrations(
  eventId: string,
  search?: string,
  page = 1,
  statusFilter?: string
): Promise<RegistrationListResult> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado.");
  const allowed = await hasPermission("event-registrations.manage");
  if (!allowed) throw new Error("No tienes permiso.");

  const [event] = await db
    .select({ title: events.title })
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);

  if (!event) throw new Error("Evento no encontrado.");

  const conditions: SQL[] = [eq(eventRegistrations.eventId, eventId)];

  if (search) {
    const likePattern = `%${search}%`;
    conditions.push(
      or(
        ilike(eventRegistrations.name, likePattern),
        ilike(eventRegistrations.email, likePattern)
      ) as SQL
    );
  }

  if (statusFilter) {
    conditions.push(eq(eventRegistrations.status, statusFilter));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [countResult] = await db
    .select({ total: count() })
    .from(eventRegistrations)
    .where(whereClause);

  const total = Number(countResult?.total ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const items = await db
    .select()
    .from(eventRegistrations)
    .where(whereClause)
    .orderBy(desc(eventRegistrations.createdAt))
    .limit(ITEMS_PER_PAGE)
    .offset((safePage - 1) * ITEMS_PER_PAGE);

  return { items, total, page: safePage, totalPages, eventTitle: event.title };
}

export async function getRegistration(id: string): Promise<EventRegistration | null> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado.");
  const allowed = await hasPermission("event-registrations.manage");
  if (!allowed) throw new Error("No tienes permiso.");

  const [item] = await db
    .select()
    .from(eventRegistrations)
    .where(eq(eventRegistrations.id, id))
    .limit(1);

  return item || null;
}

export async function updateRegistrationStatus(
  id: string,
  newStatus: string
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "No autorizado." };
  const allowed = await hasPermission("event-registrations.manage");
  if (!allowed) return { success: false, error: "No tienes permiso." };

  const validStatuses = ["confirmed", "cancelled", "attended", "no-show"];
  if (!validStatuses.includes(newStatus)) {
    return { success: false, error: "Estado inválido." };
  }

  try {
    const updateData: Record<string, unknown> = { status: newStatus, updatedAt: new Date() };

    if (newStatus === "cancelled") {
      updateData.cancelledAt = new Date();
    }
    if (newStatus === "confirmed" && !updateData.confirmedAt) {
      updateData.confirmedAt = new Date();
    }

    await db.update(eventRegistrations).set(updateData).where(eq(eventRegistrations.id, id));

    await logAudit({
      userId: session.user.id,
      action: "REGISTRATION_STATUS",
      resource: "event_registration",
      resourceId: id,
      details: `Estado cambiado a "${newStatus}"`,
    });

    return { success: true };
  } catch {
    return { success: false, error: "Error al actualizar el estado." };
  }
}

export async function getEventsWithRegistrationCounts(): Promise<
  Array<{
    eventId: string;
    title: string;
    startDate: Date;
    confirmed: number;
    totalGuests: number;
    capacity: number | null;
  }>
> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado.");
  const allowed = await hasPermission("event-registrations.manage");
  if (!allowed) throw new Error("No tienes permiso.");

  const allEvents = await db
    .select({
      eventId: events.id,
      title: events.title,
      startDate: events.startDate,
      capacity: events.capacity,
    })
    .from(events)
    .where(isNull(events.deletedAt))
    .orderBy(desc(events.startDate));

  const result = await Promise.all(
    allEvents.map(async (ev) => {
      const [countResult] = await db
        .select({ count: count() })
        .from(eventRegistrations)
        .where(
          and(
            eq(eventRegistrations.eventId, ev.eventId),
            eq(eventRegistrations.status, "confirmed")
          )
        );

      const [guestsResult] = await db
        .select({ total: sql<number>`COALESCE(SUM(${eventRegistrations.guests}), 0)::int` })
        .from(eventRegistrations)
        .where(
          and(
            eq(eventRegistrations.eventId, ev.eventId),
            eq(eventRegistrations.status, "confirmed")
          )
        );

      return {
        eventId: ev.eventId,
        title: ev.title,
        startDate: ev.startDate,
        confirmed: Number(countResult?.count ?? 0),
        totalGuests: Number(guestsResult?.total ?? 0),
        capacity: ev.capacity,
      };
    })
  );

  return result;
}

export async function getRegistrationCounts(eventId: string): Promise<{
  confirmed: number;
  totalGuests: number;
  capacity: number | null;
}> {
  const session = await auth();
  if (!session?.user?.id) return { confirmed: 0, totalGuests: 0, capacity: null };
  const allowed = await hasPermission("event-registrations.manage");
  if (!allowed) return { confirmed: 0, totalGuests: 0, capacity: null };

  const [event] = await db
    .select({ capacity: events.capacity })
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);

  const [countResult] = await db
    .select({ count: count() })
    .from(eventRegistrations)
    .where(
      and(eq(eventRegistrations.eventId, eventId), eq(eventRegistrations.status, "confirmed"))
    );

  const [guestsResult] = await db
    .select({ total: sql<number>`COALESCE(SUM(${eventRegistrations.guests}), 0)::int` })
    .from(eventRegistrations)
    .where(
      and(eq(eventRegistrations.eventId, eventId), eq(eventRegistrations.status, "confirmed"))
    );

  return {
    confirmed: Number(countResult?.count ?? 0),
    totalGuests: Number(guestsResult?.total ?? 0),
    capacity: event?.capacity ?? null,
  };
}

export async function exportRegistrationsCSV(eventId: string): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado.");
  const allowed = await hasPermission("event-registrations.manage");
  if (!allowed) throw new Error("No tienes permiso.");

  const items = await db
    .select()
    .from(eventRegistrations)
    .where(eq(eventRegistrations.eventId, eventId))
    .orderBy(desc(eventRegistrations.createdAt));

  const headers = [
    "Nombre",
    "Email",
    "Teléfono",
    "Acompañantes",
    "Total Personas",
    "Notas",
    "Estado",
    "Registrado",
    "Confirmado",
    "Cancelado",
  ];
  const rows = items.map((r) =>
    [
      escapeCsv(r.name),
      escapeCsv(r.email),
      escapeCsv(r.phone || ""),
      String(r.guests - 1),
      String(r.guests),
      escapeCsv(r.notes || ""),
      r.status,
      r.createdAt ? new Date(r.createdAt).toISOString() : "",
      r.confirmedAt ? new Date(r.confirmedAt).toISOString() : "",
      r.cancelledAt ? new Date(r.cancelledAt).toISOString() : "",
    ].join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function registrationConfirmationTemplate(
  name: string,
  eventTitle: string,
  date: string,
  time: string,
  location: string,
  guests: number
): string {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:#0F2747;padding:20px;border-radius:8px 8px 0 0;">
        <h1 style="color:#C9A227;margin:0;font-size:20px;">Centro Cristiano Berea</h1>
      </div>
      <div style="background:#fff;padding:30px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">
        <h2 style="color:#0F2747;margin-top:0;">¡Registro confirmado!</h2>
        <p style="color:#4b5563;line-height:1.6;">Hola <strong>${name}</strong>,</p>
        <p style="color:#4b5563;line-height:1.6;">Tu registro para el siguiente evento ha sido confirmado:</p>
        <div style="background:#f9fafb;padding:15px;border-radius:6px;margin:15px 0;">
          <p style="margin:0 0 5px;font-size:16px;color:#0F2747;"><strong>${eventTitle}</strong></p>
          <p style="margin:0;font-size:14px;color:#6b7280;">📅 ${date}</p>
          ${time ? `<p style="margin:0;font-size:14px;color:#6b7280;">⏰ ${time}</p>` : ""}
          ${location ? `<p style="margin:0;font-size:14px;color:#6b7280;">📍 ${location}</p>` : ""}
          <p style="margin:5px 0 0;font-size:14px;color:#6b7280;">👥 Total personas: ${guests}</p>
        </div>
        <p style="color:#4b5563;line-height:1.6;">¡Te esperamos!</p>
        <p style="color:#4b5563;line-height:1.6;">
          Bendiciones,<br>
          <strong style="color:#0F2747;">Centro Cristiano Berea</strong>
        </p>
      </div>
    </div>
  `;
}

function adminRegistrationNotificationTemplate(
  name: string,
  email: string,
  phone: string | null,
  guests: number,
  notes: string | null,
  eventTitle: string,
  date: string
): string {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:#0F2747;padding:20px;border-radius:8px 8px 0 0;">
        <h1 style="color:#C9A227;margin:0;font-size:20px;">Nuevo Registro a Evento</h1>
      </div>
      <div style="background:#fff;padding:30px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">
        <p style="color:#0F2747;font-size:16px;margin-top:0;"><strong>${eventTitle}</strong> — ${date}</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:15px;">
          <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;width:120px;">Nombre</td><td style="padding:8px 0;color:#374151;font-size:14px;"><strong>${name}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Email</td><td style="padding:8px 0;color:#374151;font-size:14px;"><strong>${email}</strong></td></tr>
          ${phone ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Teléfono</td><td style="padding:8px 0;color:#374151;font-size:14px;"><strong>${phone}</strong></td></tr>` : ""}
          <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Personas</td><td style="padding:8px 0;color:#374151;font-size:14px;"><strong>${guests}</strong></td></tr>
          ${notes ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Notas</td><td style="padding:8px 0;color:#374151;font-size:14px;">${notes}</td></tr>` : ""}
        </table>
      </div>
    </div>
  `;
}
