import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Music2,
} from "lucide-react";

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

export function PublicFooter() {
  return (
    <footer className="relative border-t border-white/10 bg-section-navy text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,162,39,0.03),transparent_40%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
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
              &ldquo;Y todo lo que hagan, h&aacute;ganlo de coraz&oacute;n,
              como para el Se&ntilde;or y no para los hombres.&rdquo;
            </p>
            <p className="mt-4 text-sm font-medium text-berea-gold">
              Colosenses 3:23
            </p>
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
                <span className="font-medium text-white">Domingo:</span> 11:00
                AM a 1:00 PM
              </p>
              <p>
                <span className="font-medium text-white">Mi&eacute;rcoles:</span>{" "}
                Escuela de L&iacute;deres 8:00 PM
              </p>
              <p>
                <span className="font-medium text-white">Jueves:</span> Escuela
                de Ministerios 8:00 PM
              </p>
              <p className="text-xs italic text-white/40">
                Duraci&oacute;n aproximada: 2 horas
              </p>
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
                  C. Tercera 109
                  <br />
                  Zona Urbana Xochimilco
                  <br />
                  Mexicali, Baja California
                  <br />
                  C.P. 21380
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-berea-gold/60" />
                <a
                  href="tel:+526865556149"
                  className="transition-all duration-200 hover:translate-x-0.5 hover:text-white"
                >
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

        <div className="mt-16 flex justify-center gap-4">
          <a
            href="https://www.facebook.com/centrocristianobereamxli?locale=es_LA"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition-all duration-300 hover:bg-berea-gold/20 hover:border-berea-gold/30 hover:text-berea-gold hover:-translate-y-1"
            aria-label="Facebook"
          >
            <FacebookIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          </a>
          <a
            href="https://www.instagram.com/centrocristianoberea/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition-all duration-300 hover:bg-berea-gold/20 hover:border-berea-gold/30 hover:text-berea-gold hover:-translate-y-1"
            aria-label="Instagram"
          >
            <InstagramIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          </a>
          <a
            href="https://www.tiktok.com/@centrocristianobe"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition-all duration-300 hover:bg-berea-gold/20 hover:border-berea-gold/30 hover:text-berea-gold hover:-translate-y-1"
            aria-label="TikTok"
          >
            <Music2 className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          </a>
        </div>

        <div className="mt-8 border-t border-white/10 pt-8 text-center text-xs text-white/40">
          &copy; {new Date().getFullYear()} Centro Cristiano Berea. Todos los
          derechos reservados.
          <span className="mx-2">&middot;</span>
          Desarrollado por Fixit Soluciones.
        </div>
      </div>
    </footer>
  );
}
