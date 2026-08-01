import Link from "next/link";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/rbac";
import { AdminSidebarShell } from "./AdminSidebarShell";
import { SidebarNavLink } from "./SidebarNavLink";
import { LayoutDashboard, Eye, ImageIcon, Settings, type LucideIcon } from "lucide-react";

interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
  permission?: string;
}

const items: SidebarItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    label: "Editor Visual",
    href: "/admin/editor",
    icon: Eye,
    permission: "homepage.manage",
  },
  {
    label: "Biblioteca de Medios",
    href: "/admin/media",
    icon: ImageIcon,
    permission: "media.manage",
  },
  {
    label: "Configuración",
    href: "/admin/settings",
    icon: Settings,
    permission: "settings.manage",
  },
];

export async function AdminSidebar() {
  const session = await auth();

  const visibleItems: SidebarItem[] = [];
  for (const item of items) {
    if (!item.permission) {
      visibleItems.push(item);
    } else if (session?.user) {
      try {
        const allowed = await hasPermission(item.permission);
        if (allowed) visibleItems.push(item);
      } catch {
        // skip
      }
    }
  }

  return (
    <AdminSidebarShell>
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/admin" className="text-sm font-semibold tracking-tight">
          CCB Admin
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <SidebarNavLink key={item.href} href={item.href}>
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </span>
            </SidebarNavLink>
          );
        })}
      </nav>
    </AdminSidebarShell>
  );
}
