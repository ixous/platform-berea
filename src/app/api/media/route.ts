import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { media } from "@/lib/db/schema";
import { ilike, isNull, and, or, desc, type SQL } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { uploadToR2 } from "@/lib/storage/r2";
import { hasPermission } from "@/lib/auth/rbac";
import { logAudit } from "@/lib/audit";
import { rateLimit } from "@/lib/rate-limit";
import sharp from "sharp";

const IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

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
  // ════════════════════════════════════════════
  // [5] TRACE: Route Handler — request recibido
  // ════════════════════════════════════════════
  console.log("[TRACE:5] POST /api/media — request recibido", {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries()),
  });

  try {
    const session = await auth();
    if (!session?.user?.id) {
      console.log("[TRACE:5] Auth falló — no hay sesión");
      return NextResponse.json(
        { success: false, error: "No autorizado. Inicia sesión para subir archivos." },
        { status: 401 }
      );
    }
    console.log("[TRACE:5] Auth OK — userId:", session.user.id);

    const perm = await hasPermission("media.manage");
    if (!perm) {
      console.log("[TRACE:5] Permiso denegado — media.manage");
      return NextResponse.json(
        { success: false, error: "No tienes permiso para subir archivos." },
        { status: 403 }
      );
    }
    console.log("[TRACE:5] Permiso OK — media.manage");

    if (!rateLimit(`upload:${session.user.id}`, { windowMs: 60_000, max: 20 })) {
      console.log("[TRACE:5] Rate limit excedido");
      return NextResponse.json(
        { success: false, error: "Demasiadas subidas. Espera un minuto." },
        { status: 429 }
      );
    }
    console.log("[TRACE:5] Rate limit OK");

    // ════════════════════════════════════════════
    // [5] TRACE: Parseo del formData
    // ════════════════════════════════════════════
    console.log("[TRACE:5] Parseando formData...");
    const formData = await req.formData();
    console.log("[TRACE:5] formData parseado, entries:", [...formData.keys()].join(", "));

    const file = formData.get("file") as File | null;
    console.log(
      "[TRACE:5] file extraído:",
      file ? `name=${file.name} size=${file.size} type=${file.type}` : "null"
    );

    if (!file || file.size === 0) {
      return NextResponse.json(
        { success: false, error: "No se seleccionó ningún archivo." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      console.log("[TRACE:5] Archivo demasiado grande:", file.size, ">", MAX_FILE_SIZE);
      return NextResponse.json(
        {
          success: false,
          error: `El archivo excede el tamaño máximo de ${MAX_FILE_SIZE / (1024 * 1024)} MB.`,
        },
        { status: 400 }
      );
    }
    console.log("[TRACE:5] Tamaño OK:", file.size);

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      console.log("[TRACE:5] MIME no permitido:", file.type);
      return NextResponse.json(
        { success: false, error: `El tipo de archivo "${file.type}" no está permitido.` },
        { status: 400 }
      );
    }
    console.log("[TRACE:5] MIME OK:", file.type);

    const ext = getExtension(file.name);
    console.log("[TRACE:5] Extensión detectada:", ext);
    if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
      console.log("[TRACE:5] Extensión no permitida:", ext);
      return NextResponse.json(
        { success: false, error: `La extensión ".${ext}" no está permitida.` },
        { status: 400 }
      );
    }
    console.log("[TRACE:5] Extensión OK");

    const buffer = Buffer.from(await file.arrayBuffer());
    console.log("[TRACE:5] Buffer creado, tamaño:", buffer.length);

    let finalBuffer = buffer;
    let finalContentType = file.type;
    let finalExt = ext;

    if (IMAGE_MIME_TYPES.has(file.type)) {
      try {
        const meta = await sharp(buffer).metadata();
        console.log(
          "[TRACE:5] Imagen detectada — formato:",
          meta.format,
          "dimensiones:",
          meta.width,
          "x",
          meta.height
        );
        const webpBuffer = Buffer.from(await sharp(buffer).webp({ quality: 90 }).toBuffer());
        if (webpBuffer.length < buffer.length) {
          finalBuffer = webpBuffer;
          finalContentType = "image/webp";
          finalExt = "webp";
          console.log(
            "[TRACE:5] Convertido a WebP:",
            buffer.length,
            "→",
            webpBuffer.length,
            "bytes (",
            Math.round((1 - webpBuffer.length / buffer.length) * 100),
            "% de reducción)"
          );
        } else {
          console.log("[TRACE:5] WebP no reduce tamaño, se usa original");
        }
      } catch (convErr) {
        console.log(
          "[TRACE:5] Error al convertir a WebP, se usa original:",
          convErr instanceof Error ? convErr.message : String(convErr)
        );
      }
    } else {
      if (!checkMagicBytes(buffer, ext)) {
        console.log("[TRACE:5] Magic bytes no coinciden para:", ext);
        return NextResponse.json(
          { success: false, error: "El contenido del archivo no coincide con su extensión." },
          { status: 400 }
        );
      }
    }
    console.log("[TRACE:5] Magic bytes OK");

    const sanitized =
      finalExt !== ext
        ? sanitizeFilename(file.name).replace(/\.[^.]+$/, "") + "." + finalExt
        : sanitizeFilename(file.name);
    console.log("[TRACE:5] Nombre sanitizado:", sanitized);
    if (!sanitized) {
      return NextResponse.json(
        { success: false, error: "El nombre del archivo no es válido." },
        { status: 400 }
      );
    }

    const key = generateFileKey(sanitized);
    console.log("[TRACE:5] File key generado:", key);

    // ════════════════════════════════════════════
    // [5 → 6] TRACE: Antes de uploadToR2
    // ════════════════════════════════════════════
    console.log("[TRACE:5] Llamando uploadToR2...");
    const uploadResult = await uploadToR2({
      body: finalBuffer,
      key,
      contentType: finalContentType,
    });
    console.log("[TRACE:5 → 8] uploadToR2 completado:", JSON.stringify(uploadResult));

    const mediaType = detectMediaType(finalContentType);
    console.log("[TRACE:9] DB insert — mediaType:", mediaType);

    const [record] = await db
      .insert(media)
      .values({
        filename: sanitized,
        originalName: file.name,
        mimeType: finalContentType,
        size: finalBuffer.length,
        url: uploadResult.url,
        mediaType,
        uploadedBy: session.user.id,
      })
      .returning({ id: media.id });

    console.log("[TRACE:9] DB insert OK — record id:", record.id);

    await logAudit({
      userId: session.user.id,
      action: "MEDIA_UPLOAD",
      resource: "media",
      resourceId: record.id,
      details: `Archivo subido: ${sanitized} (${mediaType}, ${file.size} bytes)`,
    });

    // ════════════════════════════════════════════
    // [9] TRACE: Respuesta exitosa
    // ════════════════════════════════════════════
    const responseBody = {
      success: true,
      id: record.id,
      filename: sanitized,
      url: uploadResult.url,
    };
    console.log("[TRACE:9] Respuesta exitosa:", JSON.stringify(responseBody));
    return NextResponse.json(responseBody);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : "(no stack)";
    const akid = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
    const sak = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
    const r2ep = process.env.CLOUDFLARE_R2_ENDPOINT;
    const bkt = process.env.MEDIA_BUCKET;
    const diag = [
      `AKID:${akid ? akid.length + "c" : "MISSING"}`,
      `SAK:${sak ? sak.length + "c" : "MISSING"}`,
      `EP:${r2ep ? "SET" : "MISSING"}`,
      `BKT:${bkt || "MISSING"}`,
    ].join(" | ");
    console.log("[TRACE:5] EXCEPCIÓN capturada en POST handler:");
    console.log("[TRACE:5] Error message:", msg);
    console.log("[TRACE:5] Full stack:", stack);
    console.log("[TRACE:5] Env diag:", diag);
    console.error("[API /api/media] Error:", msg, diag);
    return NextResponse.json(
      { success: false, error: `Error al subir archivo: ${msg} [${diag}]` },
      { status: 500 }
    );
  }
}
