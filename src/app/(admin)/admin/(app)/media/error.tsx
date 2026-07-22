"use client";

import { ErrorState } from "@/components/shared/ErrorState";
import { useEffect } from "react";

export default function MediaError({
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
      title="Error en Biblioteca Multimedia"
      message="Ocurrió un error al cargar la biblioteca multimedia."
      onRetry={reset}
    />
  );
}
