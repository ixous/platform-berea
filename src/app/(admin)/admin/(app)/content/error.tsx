"use client";

import { ErrorState } from "@/components/shared/ErrorState";
import { useEffect } from "react";

export default function ContentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      title="Error en Gestión de Contenido"
      message={error.message || "Ocurrió un error al cargar el contenido."}
      onRetry={reset}
    />
  );
}
