import Link from "next/link";
import { db } from "@/lib/db";
import { navigation, navigationItems } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function AdminSidebar() {
  const menus = await db.select().from(navigation).where(eq(navigation.slug, "main-menu")).limit(1);

  if (menus.length === 0) {
    return (
      <aside className="flex w-64 flex-col border-r bg-card p-4">
        <p className="text-sm text-muted-foreground">Menú no configurado</p>
      </aside>
    );
  }

  const mainMenu = menus[0];

  const items = await db
    .select()
    .from(navigationItems)
    .where(
      and(
        eq(navigationItems.navigationId, mainMenu.id),
        eq(navigationItems.status, "active"),
        isNull(navigationItems.deletedAt)
      )
    )
    .orderBy(navigationItems.displayOrder);

  return (
    <aside className="flex w-64 flex-col border-r bg-card">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/admin" className="text-sm font-semibold tracking-tight">
          CCB Admin
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.url || "#"}
            className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
