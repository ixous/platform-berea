import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { roles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";

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
    <div className="space-y-6">
      <PageHeader title="Dashboard" description={`Bienvenido, ${user?.name || "Admin"}.`} />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <SectionCard title="Información del Usuario">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Nombre</dt>
              <dd className="font-medium">{user?.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium">{user?.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Rol</dt>
              <dd className="font-medium">{roleName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Estado</dt>
              <dd className="font-medium">{user?.status}</dd>
            </div>
          </dl>
        </SectionCard>

        <SectionCard title="Sesión">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Fecha</dt>
              <dd className="font-medium">
                {new Date().toLocaleDateString("es-MX", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Hora</dt>
              <dd className="font-medium">
                {new Date().toLocaleTimeString("es-MX", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </dd>
            </div>
          </dl>
        </SectionCard>

        <SectionCard title="Accesos Rápidos">
          <ul className="space-y-2 text-sm">
            <li className="text-muted-foreground">Gestión de Usuarios</li>
            <li className="text-muted-foreground">Ministerios</li>
            <li className="text-muted-foreground">Eventos</li>
            <li className="text-muted-foreground">Configuración</li>
            <li className="text-muted-foreground">Multimedia</li>
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
