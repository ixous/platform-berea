import Link from "next/link";
import { MediaPreview } from "./MediaPreview";
import { formatFileSize } from "@/lib/utils";

interface MediaCardProps {
  id: string;
  filename: string;
  mimeType: string;
  mediaType: string;
  url: string;
  thumbnailUrl?: string | null;
  size: number;
}

export function MediaCard({
  id,
  filename,
  mimeType,
  mediaType,
  url,
  thumbnailUrl,
  size,
}: MediaCardProps) {
  return (
    <Link
      href={`/admin/media/${id}`}
      className="group block rounded-lg border bg-card transition-shadow hover:shadow-md"
    >
      <div className="flex h-40 items-center justify-center rounded-t-lg bg-muted/30 p-3">
        <MediaPreview
          url={url}
          thumbnailUrl={thumbnailUrl}
          mimeType={mimeType}
          mediaType={mediaType}
          filename={filename}
        />
      </div>
      <div className="border-t p-3">
        <p className="truncate text-sm font-medium group-hover:text-primary">{filename}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {mediaType} &middot; {formatFileSize(size)}
        </p>
      </div>
    </Link>
  );
}
