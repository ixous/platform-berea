import Link from "next/link";
import { db } from "@/lib/db";
import { navigation, navigationItems } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { AdminSidebarShell } from "./AdminSidebarShell";
import { SidebarNavLink } from "./SidebarNavLink";

const CMS_MENU_SLUG = "admin-menu";
const FALLBACK_MENU_SLUG = "main-menu";

export async function AdminSidebar() {
  let menu = await db.select().from(navigation).where(eq(navigation.slug, CMS_MENU_SLUG)).limit(1);

  if (menu.length === 0) {
    menu = await db
      .select()
      .from(navigation)
      .where(eq(navigation.slug, FALLBACK_MENU_SLUG))
      .limit(1);
  }

  if (menu.length === 0) {
    return (
      <AdminSidebarShell>
        <div className="flex h-14 items-center border-b px-4">
          <span className="text-sm font-semibold">CCB Admin</span>
        </div>
        <div className="flex-1 p-4">
          <p className="text-sm text-muted-foreground">Menú no configurado</p>
        </div>
      </AdminSidebarShell>
    );
  }

  const currentMenu = menu[0];

  const items = await db
    .select()
    .from(navigationItems)
    .where(
      and(
        eq(navigationItems.navigationId, currentMenu.id),
        eq(navigationItems.status, "active"),
        isNull(navigationItems.deletedAt)
      )
    )
    .orderBy(navigationItems.displayOrder);

  const isFallback = currentMenu.slug === FALLBACK_MENU_SLUG;

  return (
    <AdminSidebarShell>
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/admin" className="text-sm font-semibold tracking-tight">
          CCB Admin
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => (
          <SidebarNavLink key={item.id} href={item.url || "#"}>
            {item.title}
          </SidebarNavLink>
        ))}
      </nav>
      {isFallback && (
        <div className="border-t px-4 py-2 text-xs text-muted-foreground">
          Menú: {FALLBACK_MENU_SLUG} (fallback). Cambiar a &quot;{CMS_MENU_SLUG}&quot; al sembrar
          menú administrativo.
        </div>
      )}
    </AdminSidebarShell>
  );
}
