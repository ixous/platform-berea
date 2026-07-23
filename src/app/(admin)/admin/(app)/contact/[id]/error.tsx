"use client";

import { ErrorState } from "@/components/shared/ErrorState";
import { useEffect } from "react";

export default function ContactDetailError({
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
      title="Error al cargar solicitud"
      message={error.message || "Ocurrió un error."}
      onRetry={reset}
    />
  );
}
