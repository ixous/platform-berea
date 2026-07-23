import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-berea-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-16 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Centro Cristiano Berea"
                width={52}
                height={52}
                className="h-11 w-11 rounded-full object-contain lg:h-[52px] lg:w-[52px]"
              />
              <h3 className="text-lg font-bold">Centro Cristiano Berea</h3>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-white/60">
              Pastores C&eacute;sar y Claudia Villanueva
            </p>
            <p className="mt-6 text-sm leading-relaxed text-white/60">
              &ldquo;Y todo lo que hagan, h&aacute;ganlo de coraz&oacute;n, como para el
              Se&ntilde;or y no para los hombres.&rdquo;
            </p>
            <p className="mt-4 text-sm font-medium text-berea-gold">Colosenses 3:23</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-berea-gold">
              Enlaces
            </h4>
            <div className="mt-3 h-0.5 w-8 rounded-full bg-berea-gold/30" />
            <nav className="mt-6 flex flex-col gap-3">
              {[
                { href: "/quienes-somos", label: "Quienes Somos" },
                { href: "/ministerios-activos", label: "Ministerios Activos" },
                { href: "/devocionales", label: "Devocionales" },
                { href: "/eventos", label: "Eventos" },
                { href: "/donaciones", label: "Donaciones" },
                { href: "/contacto", label: "Contacto" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/60 transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-berea-gold">
              Horarios
            </h4>
            <div className="mt-3 h-0.5 w-8 rounded-full bg-berea-gold/30" />
            <div className="mt-6 space-y-4 text-sm text-white/60">
              <p>
                <span className="font-medium text-white">Domingo:</span> 11:00 AM a 1:00 PM
              </p>
              <p>
                <span className="font-medium text-white">Mi&eacute;rcoles:</span> Escuela de L&iacute;deres 8:00 PM
              </p>
              <p>
                <span className="font-medium text-white">Jueves:</span> Escuela de Ministerios 8:00 PM
              </p>
              <p className="text-xs italic text-white/40">Duraci&oacute;n aproximada: 2 horas</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-berea-gold">
              Contacto
            </h4>
            <div className="mt-3 h-0.5 w-8 rounded-full bg-berea-gold/30" />
            <div className="mt-6 space-y-5 text-sm text-white/60">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-berea-gold/60" />
                <span className="break-words">
                  C. Tercera 109<br />
                  Zona Urbana Xochimilco<br />
                  Mexicali, Baja California<br />
                  C.P. 21380
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-berea-gold/60" />
                <a href="tel:+526865556149" className="transition-all duration-200 hover:translate-x-0.5 hover:text-white">
                  686 555 6149
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-berea-gold/60" />
                <a
                  href="mailto:centrocristianobereamxli@gmail.com"
                  className="break-all transition-all duration-200 hover:translate-x-0.5 hover:text-white"
                >
                  centrocristianobereamxli@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-white/10 pt-8 text-center text-xs text-white/40">
          &copy; {new Date().getFullYear()} Centro Cristiano Berea. Todos los derechos reservados.
          <span className="mx-2">&middot;</span>
          Desarrollado por Fixit Soluciones.
        </div>
      </div>
    </footer>
  );
}
