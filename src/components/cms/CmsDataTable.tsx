import Link from "next/link";
import { Pencil } from "lucide-react";
import { CmsStatusBadge } from "./CmsStatusBadge";
import type { EntityDef } from "@/lib/cms/config";

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (value instanceof Date) {
    return value.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  if (typeof value === "boolean") return value ? "Si" : "No";
  if (typeof value === "object") return JSON.stringify(value).substring(0, 100);
  return String(value);
}

interface CmsDataTableProps {
  config: EntityDef;
  items: Record<string, unknown>[];
  baseUrl: string;
}

export function CmsDataTable({ config, items, baseUrl }: CmsDataTableProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card p-12 text-center">
        <h3 className="text-lg font-semibold">Sin {config.pluralName.toLowerCase()}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          No hay registros. Crea el primero para comenzar.
        </p>
        <Link
          href={`${baseUrl}/new`}
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Crear {config.displayName}
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {config.listColumns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  {col === "displayOrder"
                    ? "Orden"
                    : col === "authorId"
                      ? "Autor"
                      : col === "publishedAt"
                        ? "Publicado"
                        : col === "startDate"
                          ? "Fecha"
                          : col === "updatedAt"
                            ? "Actualizado"
                            : col === "createdAt"
                              ? "Creado"
                              : col}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item) => (
              <tr key={item.id as string} className="transition-colors hover:bg-muted/30">
                {config.listColumns.map((col) => (
                  <td key={col} className="px-4 py-3 whitespace-nowrap">
                    {col === "status" || col === config.statusField ? (
                      <CmsStatusBadge status={String(item[col] ?? "draft")} />
                    ) : (
                      <span className="text-muted-foreground">{formatValue(item[col])}</span>
                    )}
                  </td>
                ))}
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`${baseUrl}/${item.id}`}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors hover:bg-muted"
                      title="Editar"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Editar</span>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
