import { db } from "@/lib/db";
import { media } from "@/lib/db/schema";
import { ilike, count, isNull, and, or, desc, type SQL } from "drizzle-orm";
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
  const rawPage = Math.max(1, parseInt(params.page || "1", 10) || 1);

  const conditions: SQL[] = [isNull(media.deletedAt)];

  if (query) {
    const likePattern = `%${query}%`;
    conditions.push(
      or(ilike(media.filename, likePattern), ilike(media.originalName, likePattern)) as SQL
    );
  }

  const [countResult] = await db
    .select({ total: count() })
    .from(media)
    .where(and(...conditions));

  const totalItems = countResult?.total || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const page = Math.min(rawPage, Math.max(1, totalPages));

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

  const items = await db
    .select()
    .from(media)
    .where(and(...conditions))
    .orderBy(desc(media.createdAt))
    .limit(ITEMS_PER_PAGE)
    .offset((page - 1) * ITEMS_PER_PAGE);

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
