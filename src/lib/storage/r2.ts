import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

async function readR2Env() {
  // ════════════════════════════════════════════
  // [6] TRACE: R2 Config — lectura de variables
  // ════════════════════════════════════════════

  // Valores ANTES de dotenv
  const before = {
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ? "SET" : undefined,
    bucket: process.env.MEDIA_BUCKET,
    publicUrl: process.env.MEDIA_PUBLIC_URL,
  };

  try {
    const dotenv = await import("dotenv");
    dotenv.config({ path: ".env.local", override: true });
  } catch {}

  const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  const bucket = process.env.MEDIA_BUCKET;
  const publicUrl = process.env.MEDIA_PUBLIC_URL;

  console.log("[TRACE:6] R2 Config — valores ANTES de dotenv:", JSON.stringify(before));
  console.log("[TRACE:6] R2 Config — valores DESPUÉS de dotenv:", {
    endpoint: endpoint ? endpoint.substring(0, 30) + "..." : "MISSING",
    accessKeyId: accessKeyId ? `[SET len=${accessKeyId.length}]` : "MISSING",
    secretAccessKey: secretAccessKey ? `[SET len=${secretAccessKey.length}]` : "MISSING",
    bucket: bucket || "MISSING",
    publicUrl: publicUrl ? publicUrl.substring(0, 30) + "..." : "MISSING",
  });

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket || !publicUrl) {
    const missing = [
      !endpoint && "CLOUDFLARE_R2_ENDPOINT",
      !accessKeyId && "CLOUDFLARE_R2_ACCESS_KEY_ID",
      !secretAccessKey && "CLOUDFLARE_R2_SECRET_ACCESS_KEY",
      !bucket && "MEDIA_BUCKET",
      !publicUrl && "MEDIA_PUBLIC_URL",
    ]
      .filter(Boolean)
      .join(", ");
    console.log("[TRACE:6] FALTAN variables:", missing);
    throw new Error(`Faltan variables de entorno R2: ${missing}`);
  }

  return { endpoint, accessKeyId, secretAccessKey, bucket, publicUrl };
}

export async function getR2Config() {
  return readR2Env();
}

async function createClient() {
  const { endpoint, accessKeyId, secretAccessKey } = await getR2Config();
  return new S3Client({
    region: "auto",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
  });
}

async function getR2(): Promise<S3Client> {
  // Recreate client each time to pick up fresh credentials from .env.local
  return createClient();
}

interface UploadToR2Input {
  body: Buffer;
  key: string;
  contentType: string;
}

interface UploadToR2Output {
  key: string;
  url: string;
}

export async function uploadToR2({
  body,
  key,
  contentType,
}: UploadToR2Input): Promise<UploadToR2Output> {
  const r2 = await getR2();
  const { bucket, publicUrl } = await getR2Config();

  // ════════════════════════════════════════════
  // [7] TRACE: PutObjectCommand — ANTES de ejecutar
  // ════════════════════════════════════════════
  console.log("[TRACE:7] PutObjectCommand — preparando envío:", {
    bucket,
    key,
    contentType,
    bodySize: body.length,
  });

  let result;
  try {
    result = await r2.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      })
    );
    // ════════════════════════════════════════════
    // [8] TRACE: PutObjectCommand — ÉXITO
    // ════════════════════════════════════════════
    console.log("[TRACE:8] PutObjectCommand — éxito:", {
      statusCode: result.$metadata.httpStatusCode,
      requestId: result.$metadata.requestId,
      attempts: result.$metadata.attempts,
    });
  } catch (err) {
    // ════════════════════════════════════════════
    // [8] TRACE: PutObjectCommand — EXCEPCIÓN
    // ════════════════════════════════════════════
    const msg = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : "(no stack)";
    console.log("[TRACE:8] PutObjectCommand — EXCEPCIÓN:");
    console.log("[TRACE:8]   message:", msg);
    console.log("[TRACE:8]   name:", err instanceof Error ? err.name : typeof err);
    console.log("[TRACE:8]   code:", (err as { code?: string })?.code || "N/A");
    console.log("[TRACE:8]   stack:", stack);
    throw err;
  }

  const url = `${publicUrl}/${key}`;
  console.log("[TRACE:8] URL generada:", url);
  return { key, url };
}
