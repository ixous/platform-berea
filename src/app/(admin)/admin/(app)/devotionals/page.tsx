import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/rbac";
import { db } from "@/lib/db";
import { devotionals } from "@/lib/db/schema";
import { isNull, desc } from "drizzle-orm";
import { PageHeader } from "@/components/shared/PageHeader";
import { DevotionalsClient } from "./devotionals-client";
import type { DevotionalRow } from "./devotionals-client";

export default async function DevotionalsAdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const allowed = await hasPermission("devotionals.manage").catch(() => true);
  if (!allowed && session.user.roleId !== "admin") {
    redirect("/admin");
  }

  const rows = await db
    .select()
    .from(devotionals)
    .where(isNull(devotionals.deletedAt))
    .orderBy(desc(devotionals.createdAt));

  const items: DevotionalRow[] = rows.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    verse: r.verse,
    excerpt: r.excerpt,
    content: r.content,
    imageUrl: r.imageUrl,
    featured: Boolean(r.featured),
    status: r.status,
    publishedAt: r.publishedAt,
    createdAt: r.createdAt,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Devocionales Berea"
        description="Publica y administra reflexiones bíblicas y devocionales propios para la congregación."
      />
      <DevotionalsClient initialItems={items} />
    </div>
  );
}
