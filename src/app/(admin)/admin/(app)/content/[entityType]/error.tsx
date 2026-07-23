"use client";

import { ErrorState } from "@/components/shared/ErrorState";
import { useEffect } from "react";

export default function EntityListError({
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
      title="Error al cargar registros"
      message={error.message || "Ocurrió un error."}
      onRetry={reset}
    />
  );
}
