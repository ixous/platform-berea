"use client";

import { ErrorState } from "@/components/shared/ErrorState";
import { useEffect } from "react";

export default function AdminError({
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
      title="Error en el Panel"
      message="Ocurrió un error inesperado en el panel administrativo."
      onRetry={reset}
    />
  );
}
