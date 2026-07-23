import Link from "next/link";
import { getSubmissions } from "@/actions/contact";
import { CmsStatusBadge } from "@/components/cms/CmsStatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { MailOpen } from "lucide-react";

interface ContactListProps {
  searchParams: Promise<{ q?: string; page?: string; status?: string }>;
}

export async function ContactList({ searchParams }: ContactListProps) {
  const sp = await searchParams;
  const query = sp.q?.trim() || "";
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const statusFilter = sp.status || "";

  let result;
  try {
    result = await getSubmissions(query, page, statusFilter);
  } catch {
    return (
      <EmptyState
        icon={<MailOpen className="h-10 w-10" />}
        title="Error de autorización"
        description="No tienes permiso para acceder a la bandeja de entrada."
      />
    );
  }

  if (result.total === 0) {
    return (
      <div className="space-y-6">
        <SearchAndFilter query={query} statusFilter={statusFilter} />
        <EmptyState
          icon={<MailOpen className="h-10 w-10" />}
          title={query ? "Sin resultados" : "Bandeja vacía"}
          description={
            query
              ? `No se encontraron solicitudes para "${query}".`
              : "No hay solicitudes de contacto pendientes."
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SearchAndFilter query={query} statusFilter={statusFilter} />

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nombre</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Asunto</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Estado</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {result.items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b transition-colors hover:bg-muted/30 last:border-0"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/contact/${item.id}`}
                      className="font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {item.status === "pending" ? (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-blue-500" />
                          {item.name}
                        </span>
                      ) : (
                        item.name
                      )}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{item.email}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">
                    {item.subject}
                  </td>
                  <td className="px-4 py-3">
                    <CmsStatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {new Date(item.createdAt).toLocaleDateString("es-MX", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {result.totalPages > 1 && (
        <Pagination
          currentPage={result.page}
          totalPages={result.totalPages}
          total={result.total}
          query={query}
          statusFilter={statusFilter}
        />
      )}
    </div>
  );
}

function SearchAndFilter({ query, statusFilter }: { query: string; statusFilter: string }) {
  return (
    <form className="flex gap-2" method="GET">
      <input type="hidden" name="page" value="1" />
      <input
        type="text"
        name="q"
        defaultValue={query}
        placeholder="Buscar por nombre, email, asunto..."
        className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <select
        name="status"
        defaultValue={statusFilter}
        className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <option value="">Todos los estados</option>
        <option value="pending">Pendiente</option>
        <option value="read">Leído</option>
        <option value="replied">Respondido</option>
        <option value="archived">Archivado</option>
      </select>
      <button
        type="submit"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Buscar
      </button>
      {query && (
        <Link
          href="/admin/contact"
          className="inline-flex items-center rounded-md border px-4 py-2 text-sm transition-colors hover:bg-muted"
        >
          Limpiar
        </Link>
      )}
    </form>
  );
}

function Pagination({
  currentPage,
  totalPages,
  total,
  query,
  statusFilter,
}: {
  currentPage: number;
  totalPages: number;
  total: number;
  query: string;
  statusFilter: string;
}) {
  function buildUrl(page: number) {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", String(page));
    if (query) params.set("q", query);
    if (statusFilter) params.set("status", statusFilter);
    const qs = params.toString();
    return `/admin/contact${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <p>
        Página {currentPage} de {totalPages} ({total} solicitudes)
      </p>
      <div className="flex gap-2">
        {currentPage > 1 && (
          <a
            href={buildUrl(currentPage - 1)}
            className="rounded-md border px-3 py-1.5 transition-colors hover:bg-muted"
          >
            Anterior
          </a>
        )}
        {currentPage < totalPages && (
          <a
            href={buildUrl(currentPage + 1)}
            className="rounded-md border px-3 py-1.5 transition-colors hover:bg-muted"
          >
            Siguiente
          </a>
        )}
      </div>
    </div>
  );
}
