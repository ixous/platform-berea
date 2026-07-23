import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntityConfig } from "@/lib/cms/config";
import { listEntities } from "@/lib/cms/actions";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/rbac";
import { PageHeader } from "@/components/shared/PageHeader";
import { CmsDataTable } from "@/components/cms/CmsDataTable";
import { CmsPagination } from "@/components/cms/CmsPagination";
import { Plus } from "lucide-react";

interface ListPageProps {
  params: Promise<{ entityType: string }>;
  searchParams: Promise<{ q?: string; page?: string; status?: string }>;
}

export default async function EntityListPage({ params, searchParams }: ListPageProps) {
  const { entityType } = await params;
  const sp = await searchParams;
  const config = getEntityConfig(entityType);

  if (!config) notFound();

  const session = await auth();
  if (!session?.user) notFound();
  const allowed = await hasPermission(config.permission);
  if (!allowed) notFound();

  const query = sp.q?.trim() || "";
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const statusFilter = sp.status || "";

  const result = await listEntities(entityType, query, page, statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <PageHeader
          title={config.pluralName}
          description={`Administra los registros de ${config.pluralName.toLowerCase()}.`}
        />
        {!config.singleRecord && (
          <Link
            href={`/admin/content/${entityType}/new`}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Crear {config.displayName}
          </Link>
        )}
        {config.singleRecord && result.items.length === 0 && (
          <Link
            href={`/admin/content/${entityType}/new`}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Configurar
          </Link>
        )}
        {config.singleRecord && result.items.length > 0 && (
          <Link
            href={`/admin/content/${entityType}/${result.items[0].id}`}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Editar configuración
          </Link>
        )}
      </div>

      <form className="flex gap-2" method="GET">
        <input type="hidden" name="page" value="1" />
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder={`Buscar ${config.pluralName.toLowerCase()}...`}
          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {config.statusField && (
          <select
            name="status"
            defaultValue={statusFilter}
            className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Todos los estados</option>
            {config.statusField === "status" &&
            config.entityType !== "ministries" &&
            config.entityType !== "serviceMinistries" &&
            config.entityType !== "cells" ? (
              <>
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
                <option value="archived">Archivado</option>
              </>
            ) : (
              <>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </>
            )}
          </select>
        )}
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Buscar
        </button>
        {query && (
          <a
            href={`/admin/content/${entityType}`}
            className="rounded-md border px-4 py-2 text-sm transition-colors hover:bg-muted inline-flex items-center"
          >
            Limpiar
          </a>
        )}
      </form>

      <CmsDataTable config={config} items={result.items} baseUrl={`/admin/content/${entityType}`} />

      {result.totalPages > 1 && (
        <CmsPagination
          currentPage={result.page}
          totalPages={result.totalPages}
          baseUrl={`/admin/content/${entityType}`}
          searchQuery={query}
        />
      )}
    </div>
  );
}
