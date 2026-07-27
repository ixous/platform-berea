import Link from "next/link";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/rbac";
import { AdminSidebarShell } from "./AdminSidebarShell";
import { SidebarNavLink } from "./SidebarNavLink";
import {
  LayoutDashboard,
  FileText,
  ImageIcon,
  MessageSquare,
  ClipboardList,
  BookOpen,
  Calendar,
  Home,
  Book,
  Users,
  type LucideIcon,
} from "lucide-react";

interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
  permission?: string;
}

interface SidebarCategory {
  name: string;
  items: SidebarItem[];
}

const categories: SidebarCategory[] = [
  {
    name: "INICIO",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      {
        label: "Personalizar Inicio",
        href: "/admin/homepage",
        icon: Home,
        permission: "homepage.manage",
      },
    ],
  },
  {
    name: "CONTENIDO",
    items: [
      { label: "Gestión de Contenido", href: "/admin/content", icon: FileText },
      {
        label: "Devocionales",
        href: "/admin/content/devotionals",
        icon: BookOpen,
        permission: "devotionals.manage",
      },
      {
        label: "Eventos",
        href: "/admin/content/events",
        icon: Calendar,
        permission: "events.manage",
      },
    ],
  },
  {
    name: "MULTIMEDIA",
    items: [
      {
        label: "Biblioteca de Medios",
        href: "/admin/media",
        icon: ImageIcon,
        permission: "media.manage",
      },
    ],
  },
  {
    name: "INSTITUCIONAL",
    items: [
      {
        label: "Páginas Institucionales",
        href: "/admin/content/institutionalPages",
        icon: FileText,
        permission: "pages.manage",
      },
      {
        label: "Secciones",
        href: "/admin/content/institutionalSections",
        icon: Users,
        permission: "pages.manage",
      },
      {
        label: "Doctrinas",
        href: "/admin/content/doctrines",
        icon: Book,
        permission: "pages.manage",
      },
    ],
  },
  {
    name: "COMUNIDAD",
    items: [
      {
        label: "Bandeja de Entrada",
        href: "/admin/contact",
        icon: MessageSquare,
        permission: "contact-submissions.manage",
      },
      {
        label: "Registros a Eventos",
        href: "/admin/registrations",
        icon: ClipboardList,
        permission: "event-registrations.manage",
      },
    ],
  },
];

export async function AdminSidebar() {
  const session = await auth();

  const visibleCategories: { name: string; items: SidebarItem[] }[] = [];

  for (const cat of categories) {
    const visibleItems: SidebarItem[] = [];
    for (const item of cat.items) {
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
    if (visibleItems.length > 0) {
      visibleCategories.push({ name: cat.name, items: visibleItems });
    }
  }

  return (
    <AdminSidebarShell>
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/admin" className="text-sm font-semibold tracking-tight">
          CCB Admin
        </Link>
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto p-3">
        {visibleCategories.map((cat) => (
          <div key={cat.name}>
            <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              {cat.name}
            </p>
            <div className="space-y-0.5">
              {cat.items.map((item) => {
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
            </div>
          </div>
        ))}
      </nav>
    </AdminSidebarShell>
  );
}
