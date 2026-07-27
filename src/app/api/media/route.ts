import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { media } from "@/lib/db/schema";
import { ilike, isNull, and, or, desc, type SQL } from "drizzle-orm";
import { auth } from "@/lib/auth";

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
