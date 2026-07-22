import { db } from "@/lib/db";
import { navigation, navigationItems } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import Link from "next/link";
import { Menu } from "lucide-react";

async function getMainNav() {
  const [menu] = await db
    .select()
    .from(navigation)
    .where(eq(navigation.slug, "main-menu"))
    .limit(1);

  if (!menu) return [];

  return db
    .select()
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

function MobileMenu({ items }: { items: (typeof navigationItems.$inferSelect)[] }) {
  return (
    <details className="group lg:hidden">
      <summary className="flex cursor-pointer list-none items-center rounded-md p-2 text-berea-navy transition-colors hover:bg-berea-light">
        <Menu className="h-5 w-5" />
      </summary>
      <nav className="absolute left-0 right-0 top-full z-50 border-b bg-white shadow-lg">
        <div className="flex flex-col px-4 py-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.url || "#"}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-berea-navy transition-colors hover:bg-berea-light hover:text-berea-navy"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </nav>
    </details>
  );
}

export async function PublicHeader() {
  const items = await getMainNav();

  return (
    <header className="sticky top-0 z-50 border-b border-berea-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-berea-navy">
            <span className="text-sm font-bold text-white">CCB</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-berea-navy">
            Centro Cristiano Berea
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <nav className="hidden items-center gap-1 lg:flex">
            {items.map((item) => (
              <Link
                key={item.id}
                href={item.url || "#"}
                className="rounded-md px-3 py-2 text-sm font-medium text-berea-navy transition-colors hover:bg-berea-light hover:text-berea-navy"
              >
                {item.title}
              </Link>
            ))}
          </nav>
          <Link
            href="/contacto"
            className="hidden rounded-md bg-berea-gold px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 lg:inline-flex"
          >
            Contacto
          </Link>
          <MobileMenu items={items} />
        </div>
      </div>
    </header>
  );
}
