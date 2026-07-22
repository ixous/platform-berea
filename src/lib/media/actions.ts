"use server";

import { db } from "@/lib/db";
import { media } from "@/lib/db/schema";
import { uploadToR2 } from "@/lib/storage/r2";
import { auth } from "@/lib/auth";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

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

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { success: false, error: "No se seleccionó ningún archivo." };
  }

  if (file.size > MAX_FILE_SIZE) {
    const maxMB = MAX_FILE_SIZE / (1024 * 1024);
    return { success: false, error: `El archivo excede el tamaño máximo de ${maxMB} MB.` };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { success: false, error: `El tipo de archivo "${file.type}" no está permitido.` };
  }

  const sanitized = sanitizeFilename(file.name);
  if (!sanitized) {
    return { success: false, error: "El nombre del archivo no es válido." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
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
