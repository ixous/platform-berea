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
    <div className="flex min-h-[60vh] items-center justify-center px-4 animate-fade-in">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-berea-navy/5">
          <span className="text-3xl font-bold text-berea-gold/40">!</span>
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-berea-navy sm:text-3xl">
          Algo sali&oacute; mal
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-berea-muted">
          Ocurri&oacute; un error inesperado. Por favor, intenta de nuevo o regresa al inicio.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={reset}
            className="rounded-lg bg-berea-navy px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="rounded-lg border border-berea-border bg-white px-6 py-3 text-sm font-semibold text-berea-navy shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
