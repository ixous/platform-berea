import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CmsPaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchQuery?: string;
}

export function CmsPagination({
  currentPage,
  totalPages,
  baseUrl,
  searchQuery,
}: CmsPaginationProps) {
  if (totalPages <= 1) return null;

  function buildUrl(page: number): string {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `${baseUrl}?${qs}` : baseUrl;
  }

  return (
    <div className="flex items-center justify-between border-t pt-4">
      <p className="text-sm text-muted-foreground">
        Página {currentPage} de {totalPages}
      </p>
      <div className="flex gap-2">
        {currentPage > 1 && (
          <Link
            href={buildUrl(currentPage - 1)}
            className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Link>
        )}
        {currentPage < totalPages && (
          <Link
            href={buildUrl(currentPage + 1)}
            className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
