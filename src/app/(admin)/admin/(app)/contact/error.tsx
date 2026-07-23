"use client";

import { ErrorState } from "@/components/shared/ErrorState";
import { useEffect } from "react";

export default function ContactError({
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
      title="Error al cargar solicitudes"
      message={error.message || "Ocurrió un error al cargar la bandeja de entrada."}
      onRetry={reset}
    />
  );
}
