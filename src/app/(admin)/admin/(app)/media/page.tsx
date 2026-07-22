import { db } from "@/lib/db";
import { media } from "@/lib/db/schema";
import { ilike, count, isNull, and, or, type SQL } from "drizzle-orm";
import { PageHeader } from "@/components/shared/PageHeader";
import { MediaGrid } from "@/components/media/MediaGrid";
import { MediaCard } from "@/components/media/MediaCard";
import { MediaSearch } from "@/components/media/MediaSearch";
import { Pagination } from "@/components/media/Pagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { ImageIcon } from "lucide-react";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

const ITEMS_PER_PAGE = 20;

interface MediaListPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

async function MediaList({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() || "";
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const conditions: SQL[] = [isNull(media.deletedAt)];

  if (query) {
    const likePattern = `%${query}%`;
    conditions.push(
      or(ilike(media.filename, likePattern), ilike(media.originalName, likePattern)) as SQL
    );
  }

  const [items, [countResult]] = await Promise.all([
    db
      .select()
      .from(media)
      .where(and(...conditions))
      .orderBy(media.createdAt)
      .limit(ITEMS_PER_PAGE)
      .offset(offset),
    db
      .select({ total: count() })
      .from(media)
      .where(and(...conditions)),
  ]);

  const totalItems = countResult?.total || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  if (totalItems === 0) {
    return (
      <EmptyState
        icon={<ImageIcon className="h-10 w-10" />}
        title={query ? "Sin resultados" : "Sin archivos multimedia"}
        description={
          query
            ? `No se encontraron archivos para "${query}".`
            : "Aún no hay archivos multimedia en la biblioteca."
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <MediaGrid>
        {items.map((item) => (
          <MediaCard
            key={item.id}
            id={item.id}
            filename={item.filename}
            mimeType={item.mimeType}
            mediaType={item.mediaType}
            url={item.url}
            thumbnailUrl={item.thumbnailUrl}
            size={item.size}
          />
        ))}
      </MediaGrid>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        baseUrl="/admin/media"
        searchQuery={query}
      />
    </div>
  );
}

export default function MediaListPage({ searchParams }: MediaListPageProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Biblioteca Multimedia"
        description="Gestiona imágenes, videos y documentos."
      />
      <Suspense fallback={<LoadingSpinner />}>
        <MediaSearch />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <MediaList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
