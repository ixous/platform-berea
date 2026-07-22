"use client";

interface UploadProgressProps {
  filename: string;
}

export function UploadProgress({ filename }: UploadProgressProps) {
  return (
    <div className="flex items-center gap-3 rounded-md border bg-card p-3">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{filename}</p>
        <p className="text-xs text-muted-foreground">Subiendo...</p>
      </div>
    </div>
  );
}
