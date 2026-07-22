"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function PublicError({
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
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-berea-navy sm:text-4xl">
          Algo sali&oacute; mal
        </h1>
        <p className="mx-auto mt-4 max-w-md text-berea-muted">
          Ocurri&oacute; un error inesperado. Por favor, intenta de nuevo o regresa al inicio.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={reset}
            className="rounded-md bg-berea-navy px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="rounded-md border border-berea-border bg-white px-5 py-2.5 text-sm font-medium text-berea-navy transition-colors hover:bg-berea-light"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
