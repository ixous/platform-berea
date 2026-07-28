import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

function loadLocalEnvOnce(): void {
  const envPath = resolveEnvPath();
  if (!envPath) return;

  const content = readFileSync(envPath, "utf-8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const eqIdx = trimmed.indexOf("=");
    const key = trimmed.substring(0, eqIdx).trim();
    let value = trimmed.substring(eqIdx + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadLocalEnvOnce();

function resolveEnvPath(): string | null {
  const base = process.cwd();
  const candidates = [resolve(base, ".env.local")];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return null;
}

function readEnvFromFile(): Record<string, string> {
  const result: Record<string, string> = {};
  const envPath = resolveEnvPath();
  if (!envPath) return result;
  const content = readFileSync(envPath, "utf-8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const eqIdx = trimmed.indexOf("=");
    const key = trimmed.substring(0, eqIdx).trim();
    let value = trimmed.substring(eqIdx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  }
  return result;
}

async function readR2Env() {
  let endpoint = process.env.CLOUDFLARE_R2_ENDPOINT;
  let accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  let secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  let bucket = process.env.MEDIA_BUCKET;
  let publicUrl = process.env.MEDIA_PUBLIC_URL;

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket || !publicUrl) {
    const fallback = readEnvFromFile();
    endpoint = endpoint || fallback.CLOUDFLARE_R2_ENDPOINT;
    accessKeyId = accessKeyId || fallback.CLOUDFLARE_R2_ACCESS_KEY_ID;
    secretAccessKey = secretAccessKey || fallback.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
    bucket = bucket || fallback.MEDIA_BUCKET;
    publicUrl = publicUrl || fallback.MEDIA_PUBLIC_URL;
  }

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

  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  const url = `${publicUrl}/${key}`;
  return { key, url };
}
