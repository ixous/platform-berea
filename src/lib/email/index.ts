import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@centrocristianoberea.org";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  type: string;
  referenceType?: string;
  referenceId?: string;
}

export async function sendEmail(options: SendEmailOptions) {
  const notificationId = crypto.randomUUID();

  await db.insert(notifications).values({
    id: notificationId,
    type: options.type,
    recipient: options.to,
    subject: options.subject,
    body: options.html,
    referenceType: options.referenceType || null,
    referenceId: options.referenceId || null,
    status: "pending",
  });

  if (!resend) {
    console.log("[Email] No RESEND_API_KEY. Notification saved:", {
      to: options.to,
      subject: options.subject,
      id: notificationId,
    });
    await db
      .update(notifications)
      .set({ status: "sent", sentAt: new Date() })
      .where(eq(notifications.id, notificationId));
    return { success: true, id: notificationId };
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    await db
      .update(notifications)
      .set({ status: "sent", sentAt: new Date() })
      .where(eq(notifications.id, notificationId));
    return { success: true, id: notificationId };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[Email] Failed to send:", msg);
    await db
      .update(notifications)
      .set({ status: "failed", errorMessage: msg })
      .where(eq(notifications.id, notificationId));
    return { success: false, error: msg };
  }
}

export function confirmationTemplate(name: string, subject: string, message: string): string {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:#0F2747;padding:20px;border-radius:8px 8px 0 0;">
        <h1 style="color:#C9A227;margin:0;font-size:20px;">Centro Cristiano Berea</h1>
      </div>
      <div style="background:#fff;padding:30px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">
        <h2 style="color:#0F2747;margin-top:0;">Hemos recibido tu mensaje</h2>
        <p style="color:#4b5563;line-height:1.6;">Hola <strong>${name}</strong>,</p>
        <p style="color:#4b5563;line-height:1.6;">
          Gracias por contactarnos. Hemos recibido tu mensaje y lo atenderemos a la brevedad.
        </p>
        <div style="background:#f9fafb;padding:15px;border-radius:6px;margin:15px 0;">
          <p style="margin:0 0 5px;font-size:14px;color:#6b7280;"><strong>Asunto:</strong> ${subject}</p>
          <p style="margin:0;font-size:14px;color:#6b7280;"><strong>Mensaje:</strong></p>
          <p style="margin:5px 0 0;font-size:14px;color:#374151;">${message}</p>
        </div>
        <p style="color:#4b5563;line-height:1.6;">Te responderemos pronto.</p>
        <p style="color:#4b5563;line-height:1.6;">
          Bendiciones,<br>
          <strong style="color:#0F2747;">Centro Cristiano Berea</strong>
        </p>
      </div>
    </div>
  `;
}

export function adminNotificationTemplate(
  name: string,
  email: string,
  phone: string | null,
  subject: string,
  message: string
): string {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:#0F2747;padding:20px;border-radius:8px 8px 0 0;">
        <h1 style="color:#C9A227;margin:0;font-size:20px;">Nueva Solicitud de Contacto</h1>
      </div>
      <div style="background:#fff;padding:30px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">
        <table style="width:100%;border-collapse:collapse;margin-bottom:15px;">
          <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;width:100px;">Nombre</td><td style="padding:8px 0;color:#374151;font-size:14px;"><strong>${name}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Email</td><td style="padding:8px 0;color:#374151;font-size:14px;"><strong>${email}</strong></td></tr>
          ${phone ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Teléfono</td><td style="padding:8px 0;color:#374151;font-size:14px;"><strong>${phone}</strong></td></tr>` : ""}
          <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Asunto</td><td style="padding:8px 0;color:#374151;font-size:14px;"><strong>${subject}</strong></td></tr>
        </table>
        <div style="background:#f9fafb;padding:15px;border-radius:6px;">
          <p style="margin:0 0 5px;font-size:14px;color:#6b7280;"><strong>Mensaje:</strong></p>
          <p style="margin:5px 0 0;font-size:14px;color:#374151;white-space:pre-wrap;">${message}</p>
        </div>
      </div>
    </div>
  `;
}

export function replyTemplate(name: string, replyMessage: string): string {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:#0F2747;padding:20px;border-radius:8px 8px 0 0;">
        <h1 style="color:#C9A227;margin:0;font-size:20px;">Centro Cristiano Berea</h1>
      </div>
      <div style="background:#fff;padding:30px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">
        <h2 style="color:#0F2747;margin-top:0;">Respuesta a tu mensaje</h2>
        <p style="color:#4b5563;line-height:1.6;">Hola <strong>${name}</strong>,</p>
        <p style="color:#4b5563;line-height:1.6;">Hemos respondido a tu solicitud:</p>
        <div style="background:#f9fafb;padding:15px;border-radius:6px;margin:15px 0;">
          <p style="margin:0;font-size:14px;color:#374151;white-space:pre-wrap;">${replyMessage}</p>
        </div>
        <p style="color:#4b5563;line-height:1.6;">
          Bendiciones,<br>
          <strong style="color:#0F2747;">Centro Cristiano Berea</strong>
        </p>
      </div>
    </div>
  `;
}
