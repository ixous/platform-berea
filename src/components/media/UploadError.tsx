"use client";

interface UploadErrorProps {
  message: string;
  onDismiss?: () => void;
}

export function UploadError({ message, onDismiss }: UploadErrorProps) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
      <p className="flex-1">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 rounded-sm text-destructive/70 transition-colors hover:text-destructive"
          aria-label="Cerrar error"
        >
          &times;
        </button>
      )}
    </div>
  );
}
