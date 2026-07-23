"use server";

import { db } from "@/lib/db";
import { media } from "@/lib/db/schema";
import { uploadToR2 } from "@/lib/storage/r2";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/rbac";
import { logAudit } from "@/lib/audit";
import { rateLimit } from "@/lib/rate-limit";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "video/mp4",
  "video/webm",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const ALLOWED_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "avif",
  "gif",
  "mp4",
  "webm",
  "pdf",
  "doc",
  "docx",
]);

const MAGIC_SIGNATURES: Record<string, number[]> = {
  jpg: [0xff, 0xd8, 0xff],
  jpeg: [0xff, 0xd8, 0xff],
  png: [0x89, 0x50, 0x4e, 0x47],
  webp: [0x52, 0x49, 0x46, 0x46],
  gif: [0x47, 0x49, 0x46, 0x38],
  pdf: [0x25, 0x50, 0x44, 0x46],
};

function detectMediaType(mimeType: string): "image" | "video" | "document" {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  return "document";
}

function generateFileKey(originalName: string): string {
  const ext = originalName.split(".").pop()?.toLowerCase() || "bin";
  const uuid = crypto.randomUUID();
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `uploads/${year}/${month}/${uuid}.${ext}`;
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._\-\u00C0-\u024F]/g, "_").slice(0, 500);
}

function getExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

function checkMagicBytes(buffer: Buffer, ext: string): boolean {
  const signature = MAGIC_SIGNATURES[ext];
  if (!signature) return true;
  if (buffer.length < signature.length) return false;
  return signature.every((byte, i) => buffer[i] === byte);
}

const ACCEPTED = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/avif": [".avif"],
  "image/gif": [".gif"],
  "video/mp4": [".mp4"],
  "video/webm": [".webm"],
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
} as const;

function validateFileType(mimeType: string, filename: string): string | null {
  const ext = `.${getExtension(filename)}`;
  const accepted = ACCEPTED[mimeType as keyof typeof ACCEPTED];
  if (!accepted) return `Tipo MIME "${mimeType}" no permitido.`;
  if (!(accepted as readonly string[]).includes(ext)) {
    return `La extensión "${ext}" no coincide con el tipo MIME "${mimeType}".`;
  }
  return null;
}

export interface UploadResult {
  success: boolean;
  id?: string;
  error?: string;
  filename?: string;
}

export async function uploadMedia(formData: FormData): Promise<UploadResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "No autorizado. Inicia sesión para subir archivos." };
  }

  const perm = await hasPermission("media.manage");
  if (!perm) {
    return { success: false, error: "No tienes permiso para subir archivos." };
  }

  if (!rateLimit(`upload:${session.user.id}`, { windowMs: 60_000, max: 20 })) {
    return { success: false, error: "Demasiadas subidas. Espera un minuto." };
  }

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { success: false, error: "No se seleccionó ningún archivo." };
  }

  if (file.size > MAX_FILE_SIZE) {
    const maxMB = MAX_FILE_SIZE / (1024 * 1024);
    return { success: false, error: `El archivo excede el tamaño máximo de ${maxMB} MB.` };
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return { success: false, error: `El tipo de archivo "${file.type}" no está permitido.` };
  }

  const ext = getExtension(file.name);
  if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
    return { success: false, error: `La extensión ".${ext}" no está permitida.` };
  }

  const mimeError = validateFileType(file.type, file.name);
  if (mimeError) {
    return { success: false, error: mimeError };
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (!checkMagicBytes(buffer, ext)) {
    return { success: false, error: "El contenido del archivo no coincide con su extensión." };
  }

  const sanitized = sanitizeFilename(file.name);
  if (!sanitized) {
    return { success: false, error: "El nombre del archivo no es válido." };
  }

  const key = generateFileKey(file.name);

  let uploadResult: { key: string; url: string };
  try {
    uploadResult = await uploadToR2({ body: buffer, key, contentType: file.type });
  } catch {
    return { success: false, error: "Error al subir el archivo. Inténtalo de nuevo." };
  }

  const mediaType = detectMediaType(file.type);

  try {
    const [record] = await db
      .insert(media)
      .values({
        filename: sanitized,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: uploadResult.url,
        mediaType,
        uploadedBy: session.user.id,
      })
      .returning({ id: media.id });

    await logAudit({
      userId: session.user.id,
      action: "MEDIA_UPLOAD",
      resource: "media",
      resourceId: record.id,
      details: `Archivo subido: ${sanitized} (${mediaType}, ${file.size} bytes)`,
    });

    return { success: true, id: record.id, filename: sanitized };
  } catch {
    return { success: false, error: "Error al guardar el registro en la base de datos." };
  }
}

export async function uploadMultipleMedia(formData: FormData): Promise<UploadResult[]> {
  const files = formData.getAll("files") as File[];
  if (files.length === 0) {
    return [{ success: false, error: "No se seleccionó ningún archivo." }];
  }

  const results: UploadResult[] = [];
  for (const file of files) {
    const fileFormData = new FormData();
    fileFormData.set("file", file);
    const result = await uploadMedia(fileFormData);
    results.push(result);
  }

  return results;
}
