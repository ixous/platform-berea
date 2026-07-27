import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { media } from "@/lib/db/schema";
import { ilike, isNull, and, or, desc, type SQL } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { uploadToR2 } from "@/lib/storage/r2";
import { hasPermission } from "@/lib/auth/rbac";
import { logAudit } from "@/lib/audit";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ items: [] }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";

  const conditions: SQL[] = [isNull(media.deletedAt)];

  if (q) {
    const like = `%${q}%`;
    conditions.push(or(ilike(media.filename, like), ilike(media.originalName, like)) as SQL);
  }

  const items = await db
    .select({
      id: media.id,
      url: media.url,
      thumbnailUrl: media.thumbnailUrl,
      filename: media.filename,
      mimeType: media.mimeType,
    })
    .from(media)
    .where(and(...conditions))
    .orderBy(desc(media.createdAt))
    .limit(50);

  return NextResponse.json({ items });
}

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

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "No autorizado. Inicia sesión para subir archivos." },
        { status: 401 }
      );
    }

    const perm = await hasPermission("media.manage");
    if (!perm) {
      return NextResponse.json(
        { success: false, error: "No tienes permiso para subir archivos." },
        { status: 403 }
      );
    }

    if (!rateLimit(`upload:${session.user.id}`, { windowMs: 60_000, max: 20 })) {
      return NextResponse.json(
        { success: false, error: "Demasiadas subidas. Espera un minuto." },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file || file.size === 0) {
      return NextResponse.json(
        { success: false, error: "No se seleccionó ningún archivo." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `El archivo excede el tamaño máximo de ${MAX_FILE_SIZE / (1024 * 1024)} MB.`,
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { success: false, error: `El tipo de archivo "${file.type}" no está permitido.` },
        { status: 400 }
      );
    }

    const ext = getExtension(file.name);
    if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { success: false, error: `La extensión ".${ext}" no está permitida.` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!checkMagicBytes(buffer, ext)) {
      return NextResponse.json(
        { success: false, error: "El contenido del archivo no coincide con su extensión." },
        { status: 400 }
      );
    }

    const sanitized = sanitizeFilename(file.name);
    if (!sanitized) {
      return NextResponse.json(
        { success: false, error: "El nombre del archivo no es válido." },
        { status: 400 }
      );
    }

    const key = generateFileKey(file.name);
    const uploadResult = await uploadToR2({ body: buffer, key, contentType: file.type });
    const mediaType = detectMediaType(file.type);

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

    return NextResponse.json({
      success: true,
      id: record.id,
      filename: sanitized,
      url: uploadResult.url,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[API /api/media] Error subiendo archivo:", msg);
    return NextResponse.json(
      { success: false, error: `Error al subir archivo: ${msg}` },
      { status: 500 }
    );
  }
}
