import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-berea-border bg-berea-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold">Centro Cristiano Berea</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              &ldquo;Y todo lo que hagan, h&aacute;ganlo de coraz&oacute;n, como para el
              Se&ntilde;or y no para los hombres.&rdquo;
            </p>
            <p className="mt-2 text-sm font-medium text-berea-gold">
              Colosenses 3:23
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-berea-gold">
              Enlaces
            </h4>
            <nav className="mt-4 flex flex-col gap-2">
              <Link href="/quienes-somos" className="text-sm text-white/70 transition-colors hover:text-white">
                Quienes Somos
              </Link>
              <Link href="/ministerios-activos" className="text-sm text-white/70 transition-colors hover:text-white">
                Ministerios Activos
              </Link>
              <Link href="/devocionales" className="text-sm text-white/70 transition-colors hover:text-white">
                Devocionales
              </Link>
              <Link href="/eventos" className="text-sm text-white/70 transition-colors hover:text-white">
                Eventos
              </Link>
              <Link href="/donaciones" className="text-sm text-white/70 transition-colors hover:text-white">
                Donaciones
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-berea-gold">
              Horarios
            </h4>
            <div className="mt-4 space-y-2 text-sm text-white/70">
              <p>
                <span className="font-medium text-white">Domingo:</span> 10:00 AM y 12:30 PM
              </p>
              <p>
                <span className="font-medium text-white">Mi&eacute;rcoles:</span> 7:00 PM
              </p>
              <p className="mt-3 text-xs italic text-white/50">
                Los horarios ser&aacute;n administrables desde el CMS.
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-berea-gold">
              Contacto
            </h4>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-berea-gold" />
                <span>
                  Mexicali, Baja California, M&eacute;xico
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-berea-gold" />
                <span>[Tel&eacute;fono pendiente]</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-berea-gold" />
                <span>[Correo pendiente]</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-white/50">
          &copy; {new Date().getFullYear()} Centro Cristiano Berea. Todos los derechos reservados.
          <span className="mx-2">&middot;</span>
          Desarrollado por Fixit Soluciones.
        </div>
      </div>
    </footer>
  );
}
