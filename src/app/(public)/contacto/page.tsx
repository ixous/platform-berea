import { PageBanner } from "@/components/public/PageBanner";
import { MapPin, Clock, Phone, Mail, MessageCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Cont\u00e1ctanos. Informaci\u00f3n de contacto, ubicaci\u00f3n y horarios de Centro Cristiano Berea en Mexicali, Baja California.",
};

export default function ContactoPage() {
  return (
    <>
      <PageBanner title="Contacto" subtitle="Nos encantar\u00eda saber de ti." />

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-berea-navy">
                Informaci\u00f3n de contacto
              </h2>
              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-berea-gold" />
                  <div>
                    <p className="font-medium text-berea-navy">Direcci\u00f3n</p>
                    <p className="text-sm text-berea-muted">
                      Mexicali, Baja California, M\u00e9xico
                    </p>
                    <p className="text-xs italic text-berea-muted">
                      La direcci\u00f3n exacta ser\u00e1 administrada desde el CMS.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-berea-gold" />
                  <div>
                    <p className="font-medium text-berea-navy">Tel\u00e9fono</p>
                    <p className="text-sm text-berea-muted">[Pendiente de configuraci\u00f3n]</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-berea-gold" />
                  <div>
                    <p className="font-medium text-berea-navy">Correo electr\u00f3nico</p>
                    <p className="text-sm text-berea-muted">[Pendiente de configuraci\u00f3n]</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-berea-gold" />
                  <div>
                    <p className="font-medium text-berea-navy">WhatsApp</p>
                    <p className="text-sm text-berea-muted">[Pendiente de configuraci\u00f3n]</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-berea-navy">Horarios</h2>
              <div className="mt-8 space-y-4">
                {[
                  { day: "Domingo", times: "10:00 AM y 12:30 PM", type: "Servicios" },
                  { day: "Mi\u00e9rcoles", times: "7:00 PM", type: "Servicio General" },
                ].map((h) => (
                  <div
                    key={h.day}
                    className="flex items-center gap-3 rounded-lg border border-berea-border bg-white p-4"
                  >
                    <Clock className="h-5 w-5 shrink-0 text-berea-gold" />
                    <div>
                      <p className="font-medium text-berea-navy">{h.day}</p>
                      <p className="text-sm text-berea-muted">
                        {h.times} &middot; {h.type}
                      </p>
                    </div>
                  </div>
                ))}
                <p className="text-xs italic text-berea-muted">
                  Los horarios ser\u00e1n completamente administrables desde el CMS.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 rounded-lg border border-berea-border bg-berea-light p-8">
            <h2 className="text-xl font-bold text-berea-navy">Formulario de contacto</h2>
            <p className="mt-2 text-sm text-berea-muted">
              El formulario de contacto estar\u00e1 disponible pr\u00f3ximamente. Mientras tanto,
              puedes comunicarte con nosotros por los canales indicados arriba.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-md border border-berea-border bg-white px-4 py-3">
                <span className="text-sm text-berea-muted">Nombre</span>
              </div>
              <div className="rounded-md border border-berea-border bg-white px-4 py-3">
                <span className="text-sm text-berea-muted">Correo electr\u00f3nico</span>
              </div>
              <div className="rounded-md border border-berea-border bg-white px-4 py-3 sm:col-span-2">
                <span className="text-sm text-berea-muted">Mensaje</span>
              </div>
            </div>
            <p className="mt-4 text-xs italic text-berea-muted">
              El backend del formulario se implementar\u00e1 en una fase posterior.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
