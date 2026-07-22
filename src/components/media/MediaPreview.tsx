import { File, Film } from "lucide-react";

interface MediaPreviewProps {
  url: string;
  thumbnailUrl?: string | null;
  mimeType: string;
  mediaType: string;
  filename: string;
}

export function MediaPreview({
  url,
  thumbnailUrl,
  mimeType,
  mediaType,
  filename,
}: MediaPreviewProps) {
  const src = thumbnailUrl || url;

  if (mediaType === "image" || mimeType.startsWith("image/")) {
    return (
      <img
        src={src}
        alt={filename}
        className="max-h-full max-w-full rounded object-contain"
        loading="lazy"
      />
    );
  }

  if (mediaType === "video" || mimeType.startsWith("video/")) {
    return (
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <Film className="h-10 w-10" />
        <span className="text-xs">Video</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 text-muted-foreground">
      <File className="h-10 w-10" />
      <span className="text-xs">Documento</span>
    </div>
  );
}

export function MediaDetailPreview({
  url,
  thumbnailUrl,
  mimeType,
  mediaType,
  filename,
}: MediaPreviewProps) {
  const src = thumbnailUrl || url;

  if (mediaType === "video" || mimeType.startsWith("video/")) {
    return (
      <video controls className="max-h-96 w-full rounded-lg bg-black" preload="metadata">
        <source src={url} type={mimeType} />
      </video>
    );
  }

  if (mediaType === "image" || mimeType.startsWith("image/")) {
    return (
      <img src={src} alt={filename} className="max-h-96 max-w-full rounded-lg object-contain" />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
      <File className="h-16 w-16 text-muted-foreground" />
      <p className="mt-2 text-sm text-muted-foreground">{filename}</p>
      <p className="text-xs text-muted-foreground">{mimeType}</p>
    </div>
  );
}
