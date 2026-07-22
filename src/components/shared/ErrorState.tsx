"use client";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Error inesperado",
  message = "Ocurrió un error al cargar esta sección.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="max-w-sm rounded-xl border bg-card p-8 text-center shadow-sm">
        <h3 className="text-lg font-semibold text-destructive">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
}
