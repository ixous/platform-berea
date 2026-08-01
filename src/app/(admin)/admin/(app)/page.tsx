import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { roles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { PageHeader } from "@/components/shared/PageHeader";
import { Eye, ImageIcon, Settings, BarChart3, ArrowUpRight } from "lucide-react";

interface AccessCard {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

const cards: AccessCard[] = [
  {
    title: "Editor Visual",
    description:
      "Edita cada página del sitio sin salir de una vista previa: textos, imágenes, botones, tarjetas y más.",
    href: "/admin/editor",
    icon: <Eye className="h-5 w-5" />,
  },
  {
    title: "Biblioteca de Medios",
    description: "Banco de recursos del sitio: sube, busca, reemplaza y administra imágenes.",
    href: "/admin/media",
    icon: <ImageIcon className="h-5 w-5" />,
  },
  {
    title: "Configuración",
    description: "Información de la iglesia, SEO global, redes sociales, logo, favicon y colores.",
    href: "/admin/settings",
    icon: <Settings className="h-5 w-5" />,
  },
  {
    title: "Analíticas",
    description:
      "Métricas del sitio. La integración con Google Analytics llegará en una próxima fase.",
    href: "/admin/settings?tab=analytics",
    icon: <BarChart3 className="h-5 w-5" />,
  },
];

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;

  let roleName = user?.roleId || "Desconocido";
  if (user?.roleId) {
    const [role] = await db
      .select({ name: roles.name })
      .from(roles)
      .where(eq(roles.id, user.roleId))
      .limit(1);
    if (role) roleName = role.name;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Bienvenido, ${user?.name || "Admin"}`}
        description={`Has iniciado sesión como ${roleName}.`}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group flex flex-col justify-between gap-6 rounded-xl border bg-card p-6 transition-colors hover:border-primary/40 hover:bg-muted/30"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {card.icon}
              </div>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
            </div>
            <div>
              <h3 className="font-semibold tracking-tight">{card.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {card.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
