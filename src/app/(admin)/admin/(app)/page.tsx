import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { roles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { PageHeader } from "@/components/shared/PageHeader";
import { QuickActions } from "@/components/admin/quick-actions";
import { StatsCards } from "@/components/admin/stats-cards";
import { RecentActivity } from "@/components/admin/recent-activity";
import { AttentionRequired } from "@/components/admin/attention-required";

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

      <section>
        <h2 className="mb-4 text-sm font-semibold text-muted-foreground">Acciones Rápidas</h2>
        <QuickActions />
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold text-muted-foreground">Resumen Operativo</h2>
        <StatsCards />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <RecentActivity />
        <AttentionRequired />
      </section>
    </div>
  );
}
