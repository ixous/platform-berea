import { db } from "@/lib/db";
import { mediaAttachments, media } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";

interface EntityMedia {
  mediaUrl: string | null;
  thumbnailUrl: string | null;
  altText: string | null;
}

export async function getEntityMediaMap(
  entityType: string,
  entityIds: string[]
): Promise<Map<string, EntityMedia>> {
  if (entityIds.length === 0) return new Map();

  const rows = await db
    .select({
      entityId: mediaAttachments.entityId,
      mediaUrl: media.url,
      thumbnailUrl: media.thumbnailUrl,
      altText: media.altText,
    })
    .from(mediaAttachments)
    .innerJoin(media, eq(mediaAttachments.mediaId, media.id))
    .where(
      and(
        eq(mediaAttachments.entityType, entityType),
        inArray(mediaAttachments.entityId, entityIds),
        eq(mediaAttachments.relationType, "cover"),
        eq(mediaAttachments.status, "active")
      )
    );

  const map = new Map<string, EntityMedia>();
  for (const row of rows) {
    if (!map.has(row.entityId)) {
      map.set(row.entityId, {
        mediaUrl: row.mediaUrl,
        thumbnailUrl: row.thumbnailUrl,
        altText: row.altText,
      });
    }
  }
  return map;
}
