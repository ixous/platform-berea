import { db } from "@/lib/db";
import { media } from "@/lib/db/schema";
import { eq, isNull, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { MediaDetailPreview } from "@/components/media/MediaPreview";
import { MediaDetails } from "@/components/media/MediaDetails";

interface MediaDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MediaDetailPage({ params }: MediaDetailPageProps) {
  const { id } = await params;

  const [item] = await db
    .select()
    .from(media)
    .where(and(eq(media.id, id), isNull(media.deletedAt)))
    .limit(1);

  if (!item) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/admin/media"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Biblioteca
        </Link>
      </div>

      <PageHeader title={item.originalName} description={`ID: ${item.id}`} />

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Vista Previa">
          <MediaDetailPreview
            url={item.url}
            thumbnailUrl={item.thumbnailUrl}
            mimeType={item.mimeType}
            mediaType={item.mediaType}
            filename={item.filename}
          />
        </SectionCard>
        <SectionCard title="Detalles">
          <MediaDetails
            filename={item.filename}
            originalName={item.originalName}
            mimeType={item.mimeType}
            mediaType={item.mediaType}
            size={item.size}
            width={item.width}
            height={item.height}
            altText={item.altText}
            createdAt={item.createdAt}
            updatedAt={item.updatedAt}
          />
        </SectionCard>
      </div>
    </div>
  );
}
