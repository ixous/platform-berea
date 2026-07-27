import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const R2_ENDPOINT = process.env.CLOUDFLARE_R2_ENDPOINT!;
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!;
const R2_BUCKET = process.env.MEDIA_BUCKET!;
const R2_PUBLIC_URL = process.env.MEDIA_PUBLIC_URL!;

let client: S3Client | null = null;

function getR2(): S3Client {
  if (!client) {
    client = new S3Client({
      region: "auto",
      endpoint: R2_ENDPOINT,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
    });
  }
  return client;
}

export { getR2, R2_BUCKET, R2_PUBLIC_URL };

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
  const r2 = getR2();

  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return {
    key,
    url: `${R2_PUBLIC_URL}/${key}`,
  };
}
