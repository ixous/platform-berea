import { db } from "@/lib/db";
import { auditLogs, users } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { Clock } from "lucide-react";

const actionLabels: Record<string, string> = {
  LOGIN: "Inició sesión",
  LOGOUT: "Cerró sesión",
  CMS_CREATE: "Creó",
  CMS_UPDATE: "Actualizó",
  CMS_DELETE: "Eliminó",
  CMS_RESTORE: "Restauró",
  CMS_STATUS: "Cambió estado",
  MEDIA_UPLOAD: "Subió archivo",
  MEDIA_DELETE: "Eliminó archivo",
};

const resourceLabels: Record<string, string> = {
  pages: "página",
  devotionals: "devocional",
  events: "evento",
  ministries: "ministerio",
  "service-ministries": "ministerio de servicio",
  "biblical-programs": "programa bíblico",
  cells: "célula",
  "annual-vision": "visión anual",
  auditorium: "auditorio",
  donations: "donación",
  contact: "contacto",
  media: "archivo",
  user: "usuario",
};

function formatTimeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Hace ${days}d`;
  return date.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}

function describeAction(action: string, resource: string): string {
  const actionStr = actionLabels[action] || action;
  const resourceStr = resourceLabels[resource] || resource;
  if (
    action === "CMS_CREATE" ||
    action === "CMS_UPDATE" ||
    action === "CMS_DELETE" ||
    action === "CMS_RESTORE"
  ) {
    return `${actionStr} ${resourceStr}`;
  }
  if (action === "MEDIA_UPLOAD" || action === "MEDIA_DELETE") {
    return `${actionStr}`;
  }
  return actionStr;
}

export async function RecentActivity() {
  const logs = await db
    .select({
      id: auditLogs.id,
      action: auditLogs.action,
      resource: auditLogs.resource,
      details: auditLogs.details,
      createdAt: auditLogs.createdAt,
      userName: users.name,
    })
    .from(auditLogs)
    .leftJoin(users, eq(auditLogs.userId, users.id))
    .orderBy(desc(auditLogs.createdAt))
    .limit(10);

  if (logs.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
        <p className="text-sm text-muted-foreground">Aún no hay actividad registrada.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="border-b px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">Actividad Reciente</h2>
        </div>
      </div>
      <div className="divide-y">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-3 px-5 py-3 text-sm">
            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary/30" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-foreground">{log.userName || "Sistema"}</p>
              <p className="mt-0.5 text-muted-foreground">
                {describeAction(log.action, log.resource)}
                {log.details && (
                  <span className="ml-1 text-muted-foreground/60">&mdash; {log.details}</span>
                )}
              </p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatTimeAgo(new Date(log.createdAt))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
