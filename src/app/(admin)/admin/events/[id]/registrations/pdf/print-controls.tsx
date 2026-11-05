"use client";

import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  eventId: string;
}

export function PrintControls({ eventId }: Props) {
  return (
    <div className="print:hidden border-b border-site-line bg-white/90 backdrop-blur sticky top-0 z-50 px-4 py-3 shadow-sm">
      <div className="mx-auto max-w-5xl flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/admin/events/${eventId}/registrations`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-site-muted hover:text-site-ink transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Registros
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs text-site-muted hidden sm:inline">
            💡 En la ventana de impresión, selecciona <strong>&quot;Guardar como PDF&quot;</strong>{" "}
            para compartirlo por WhatsApp.
          </span>
          <button
            onClick={() => window.print()}
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#1E293B] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Printer className="h-4 w-4 text-[#D4AF37]" />
            Guardar como PDF / Imprimir
          </button>
        </div>
      </div>
    </div>
  );
}
