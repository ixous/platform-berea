import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PublicNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 animate-fade-in">
      <div className="text-center">
        <p className="text-8xl font-bold text-berea-navy/10">404</p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-berea-navy sm:text-3xl">
          P&aacute;gina no encontrada
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-berea-muted">
          Lo sentimos, la p&aacute;gina que buscas no existe o ha sido movida.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-berea-gold px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-berea-gold/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          >
            Ir al inicio
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
