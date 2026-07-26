import Link from "next/link";
import { BookOpen, Calendar, Church, GraduationCap, Home, Upload } from "lucide-react";

interface Action {
  label: string;
  description: string;
  href: string;
  icon: typeof BookOpen;
  accent: string;
}

const actions: Action[] = [
  {
    label: "Nuevo Devocional",
    description: "Escribe y publica una reflexión bíblica",
    href: "/admin/content/devotionals/new",
    icon: BookOpen,
    accent: "bg-amber-100 text-amber-700",
  },
  {
    label: "Nuevo Evento",
    description: "Crea un evento o actividad especial",
    href: "/admin/content/events/new",
    icon: Calendar,
    accent: "bg-blue-100 text-blue-700",
  },
  {
    label: "Nuevo Ministerio",
    description: "Registra un ministerio activo",
    href: "/admin/content/ministries/new",
    icon: Church,
    accent: "bg-emerald-100 text-emerald-700",
  },
  {
    label: "Nuevo Programa",
    description: "Agrega un programa de formación bíblica",
    href: "/admin/content/biblicalPrograms/new",
    icon: GraduationCap,
    accent: "bg-violet-100 text-violet-700",
  },
  {
    label: "Nueva Célula",
    description: "Registra un grupo de células",
    href: "/admin/content/cells/new",
    icon: Home,
    accent: "bg-rose-100 text-rose-700",
  },
  {
    label: "Subir Multimedia",
    description: "Agrega imágenes y archivos a la biblioteca",
    href: "/admin/media",
    icon: Upload,
    accent: "bg-sky-100 text-sky-700",
  },
];

export function QuickActions() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.label}
            href={action.href}
            className="group flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${action.accent}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold group-hover:text-primary">{action.label}</p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{action.description}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
