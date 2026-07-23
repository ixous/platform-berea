import Link from "next/link";
import { getAllEntityConfigs } from "@/lib/cms/config";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/rbac";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  FileText,
  BookOpen,
  Calendar,
  Church,
  HeartHandshake,
  GraduationCap,
  Home,
  Eye,
  Building,
  Heart,
  Phone,
  Users,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  FileText: <FileText className="h-5 w-5" />,
  BookOpen: <BookOpen className="h-5 w-5" />,
  Calendar: <Calendar className="h-5 w-5" />,
  Church: <Church className="h-5 w-5" />,
  HeartHandshake: <HeartHandshake className="h-5 w-5" />,
  GraduationCap: <GraduationCap className="h-5 w-5" />,
  Home: <Home className="h-5 w-5" />,
  Eye: <Eye className="h-5 w-5" />,
  Building: <Building className="h-5 w-5" />,
  Heart: <Heart className="h-5 w-5" />,
  Phone: <Phone className="h-5 w-5" />,
  Users: <Users className="h-5 w-5" />,
};

export default async function ContentOverviewPage() {
  const session = await auth();
  const configs = getAllEntityConfigs();

  const accessibleConfigs = [];
  for (const cfg of configs) {
    if (session?.user) {
      try {
        const allowed = await hasPermission(cfg.permission);
        if (allowed) accessibleConfigs.push(cfg);
      } catch {
        // skip
      }
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Contenido"
        description="Administra todo el contenido del sitio desde aquí."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {accessibleConfigs.map((cfg) => (
          <Link
            key={cfg.entityType}
            href={`/admin/content/${cfg.entityType}`}
            className="group flex items-start gap-3 rounded-xl border bg-card p-4 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {iconMap[cfg.icon] ?? <FileText className="h-5 w-5" />}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold group-hover:text-primary">{cfg.pluralName}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {cfg.displayName} {cfg.singleRecord ? "(configuración única)" : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
