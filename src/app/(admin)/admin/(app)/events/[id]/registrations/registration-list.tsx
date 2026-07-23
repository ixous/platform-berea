import { db } from "@/lib/db";
import { events, eventRegistrations } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/rbac";
import { redirect } from "next/navigation";
import Link from "next/link";
import { eq, and, desc, ilike, or, type SQL, count } from "drizzle-orm";
import { ArrowLeft, Mail, Phone, UserCheck, Users, Download } from "lucide-react";
import { RegistrationActions } from "./registration-actions";

const ITEMS_PER_PAGE = 20;

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q?: string; page?: string; status?: string }>;
}

export async function RegistrationList({ params, searchParams }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");
  const allowed = await hasPermission("event-registrations.manage");
  if (!allowed) redirect("/admin");

  const { id: eventId } = await params;
  const { q, page: pageStr, status: statusFilter } = await searchParams;
  const currentPage = Math.max(1, Number(pageStr) || 1);

  const [event] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);

  if (!event) {
    redirect("/admin/registrations");
  }

  const filters: SQL[] = [eq(eventRegistrations.eventId, eventId)];

  if (q) {
    const like = `%${q}%`;
    filters.push(
      or(ilike(eventRegistrations.name, like), ilike(eventRegistrations.email, like)) as SQL
    );
  }

  if (statusFilter) {
    filters.push(eq(eventRegistrations.status, statusFilter));
  }

  const [totalCount] = await db
    .select({ count: count() })
    .from(eventRegistrations)
    .where(filters.length > 0 ? and(...filters) : undefined);

  const total = Number(totalCount?.count ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const items = await db
    .select()
    .from(eventRegistrations)
    .where(filters.length > 0 ? and(...filters) : undefined)
    .orderBy(desc(eventRegistrations.createdAt))
    .limit(ITEMS_PER_PAGE)
    .offset((safePage - 1) * ITEMS_PER_PAGE);

  const statusBadge: Record<string, string> = {
    confirmed: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-red-100 text-red-700",
    attended: "bg-blue-100 text-blue-700",
    "no-show": "bg-amber-100 text-amber-700",
  };

  const statusLabel: Record<string, string> = {
    confirmed: "Confirmado",
    cancelled: "Cancelado",
    attended: "Asistió",
    "no-show": "No Asistió",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/registrations"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-berea-muted transition-colors hover:text-berea-navy"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a eventos
          </Link>
          <h2 className="mt-2 text-xl font-bold text-berea-navy">{event.title}</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm text-berea-muted">
            <Users className="h-4 w-4" />
            <span>{total} registro(s)</span>
          </div>
          {event.capacity && (
            <div className="flex items-center gap-1.5 text-sm text-berea-muted">
              <UserCheck className="h-4 w-4" />
              <span>Capacidad: {event.capacity}</span>
            </div>
          )}
          <a
            href={`/api/events/${eventId}/registrations/export`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-berea-border bg-white px-3 py-2 text-sm font-medium text-berea-navy transition-colors hover:bg-berea-light"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </a>
        </div>
      </div>

      <div className="rounded-xl border border-berea-border bg-white">
        <div className="border-b border-berea-border p-4">
          <form className="flex gap-3">
            <input type="hidden" name="id" value={eventId} />
            <input
              type="search"
              name="q"
              defaultValue={q || ""}
              placeholder="Buscar por nombre o email..."
              className="block flex-1 rounded-lg border border-berea-border bg-white px-4 py-2 text-sm outline-none transition-colors placeholder:text-berea-muted focus:border-berea-gold focus:ring-2 focus:ring-berea-gold/20"
            />
            <select
              name="status"
              defaultValue={statusFilter || ""}
              className="rounded-lg border border-berea-border bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-berea-gold focus:ring-2 focus:ring-berea-gold/20"
            >
              <option value="">Todos los estados</option>
              <option value="confirmed">Confirmado</option>
              <option value="cancelled">Cancelado</option>
              <option value="attended">Asistió</option>
              <option value="no-show">No Asistió</option>
            </select>
            <button
              type="submit"
              className="rounded-lg bg-berea-navy px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Buscar
            </button>
          </form>
        </div>

        {items.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto h-10 w-10 text-berea-muted" />
            <p className="mt-3 text-sm text-berea-muted">No hay registros.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-berea-border bg-berea-light/50">
                  <th className="px-4 py-3 text-left font-medium text-berea-navy">Nombre</th>
                  <th className="px-4 py-3 text-left font-medium text-berea-navy">Contacto</th>
                  <th className="px-4 py-3 text-center font-medium text-berea-navy">
                    Acompañantes
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-berea-navy">Total</th>
                  <th className="px-4 py-3 text-center font-medium text-berea-navy">Estado</th>
                  <th className="px-4 py-3 text-right font-medium text-berea-navy">Registrado</th>
                  <th className="px-4 py-3 text-right font-medium text-berea-navy">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-berea-border">
                {items.map((reg) => (
                  <tr key={reg.id} className="group hover:bg-berea-light/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-medium text-berea-navy">{reg.name}</span>
                      {reg.notes && (
                        <p
                          className="mt-0.5 max-w-xs truncate text-xs text-berea-muted"
                          title={reg.notes}
                        >
                          {reg.notes}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <a
                          href={`mailto:${reg.email}`}
                          className="inline-flex items-center gap-1 text-xs text-berea-muted hover:text-berea-navy transition-colors"
                        >
                          <Mail className="h-3 w-3" />
                          {reg.email}
                        </a>
                        {reg.phone && (
                          <a
                            href={`tel:${reg.phone}`}
                            className="inline-flex items-center gap-1 text-xs text-berea-muted hover:text-berea-navy transition-colors"
                          >
                            <Phone className="h-3 w-3" />
                            {reg.phone}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-berea-navy">{reg.guests - 1}</td>
                    <td className="px-4 py-3 text-center font-medium text-berea-navy">
                      {reg.guests}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          statusBadge[reg.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {statusLabel[reg.status] || reg.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-berea-muted">
                      {new Date(reg.createdAt).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <RegistrationActions registrationId={reg.id} currentStatus={reg.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-berea-border px-4 py-3">
            <p className="text-sm text-berea-muted">
              Página {safePage} de {totalPages} ({total} registros)
            </p>
            <div className="flex gap-2">
              {safePage > 1 && (
                <Link
                  href={`/admin/events/${eventId}/registrations?page=${safePage - 1}${q ? `&q=${q}` : ""}${statusFilter ? `&status=${statusFilter}` : ""}`}
                  className="rounded-lg border border-berea-border px-3 py-1.5 text-sm text-berea-navy transition-colors hover:bg-berea-light"
                >
                  Anterior
                </Link>
              )}
              {safePage < totalPages && (
                <Link
                  href={`/admin/events/${eventId}/registrations?page=${safePage + 1}${q ? `&q=${q}` : ""}${statusFilter ? `&status=${statusFilter}` : ""}`}
                  className="rounded-lg border border-berea-border px-3 py-1.5 text-sm text-berea-navy transition-colors hover:bg-berea-light"
                >
                  Siguiente
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
