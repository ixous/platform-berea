import { db } from "@/lib/db";
import { navigation, navigationItems } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { PublicHeaderClient } from "./PublicHeaderClient";

async function getMainNav() {
  const [menu] = await db
    .select()
    .from(navigation)
    .where(eq(navigation.slug, "main-menu"))
    .limit(1);

  if (!menu) return [];

  return db
    .select({ id: navigationItems.id, title: navigationItems.title, url: navigationItems.url })
    .from(navigationItems)
    .where(
      and(
        eq(navigationItems.navigationId, menu.id),
        eq(navigationItems.status, "active"),
        isNull(navigationItems.deletedAt)
      )
    )
    .orderBy(navigationItems.displayOrder);
}

export async function PublicHeader() {
  const items = await getMainNav();
  return <PublicHeaderClient items={items} />;
}
