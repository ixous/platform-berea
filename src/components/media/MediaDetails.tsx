import { formatFileSize } from "@/lib/utils";

interface MediaDetailsProps {
  filename: string;
  originalName: string;
  mimeType: string;
  mediaType: string;
  size: number;
  width?: number | null;
  height?: number | null;
  altText?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MediaDetails({
  filename,
  originalName,
  mimeType,
  mediaType,
  size,
  width,
  height,
  altText,
  createdAt,
  updatedAt,
}: MediaDetailsProps) {
  return (
    <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
      <div>
        <dt className="text-xs font-medium text-muted-foreground">Nombre</dt>
        <dd className="text-sm">{filename}</dd>
      </div>
      <div>
        <dt className="text-xs font-medium text-muted-foreground">Original</dt>
        <dd className="text-sm">{originalName}</dd>
      </div>
      <div>
        <dt className="text-xs font-medium text-muted-foreground">Tipo</dt>
        <dd className="text-sm">{mediaType}</dd>
      </div>
      <div>
        <dt className="text-xs font-medium text-muted-foreground">MIME</dt>
        <dd className="text-sm">{mimeType}</dd>
      </div>
      <div>
        <dt className="text-xs font-medium text-muted-foreground">Tamaño</dt>
        <dd className="text-sm">{formatFileSize(size)}</dd>
      </div>
      {width && height ? (
        <div>
          <dt className="text-xs font-medium text-muted-foreground">Dimensiones</dt>
          <dd className="text-sm">
            {width} &times; {height} px
          </dd>
        </div>
      ) : (
        <div>
          <dt className="text-xs font-medium text-muted-foreground">Dimensiones</dt>
          <dd className="text-sm text-muted-foreground">—</dd>
        </div>
      )}
      {altText && (
        <div className="sm:col-span-2">
          <dt className="text-xs font-medium text-muted-foreground">Alt Text</dt>
          <dd className="text-sm">{altText}</dd>
        </div>
      )}
      <div>
        <dt className="text-xs font-medium text-muted-foreground">Creado</dt>
        <dd className="text-sm">{formatDate(new Date(createdAt))}</dd>
      </div>
      <div>
        <dt className="text-xs font-medium text-muted-foreground">Actualizado</dt>
        <dd className="text-sm">{formatDate(new Date(updatedAt))}</dd>
      </div>
    </dl>
  );
}
