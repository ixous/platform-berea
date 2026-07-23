import { db } from "@/lib/db";
import { contact } from "@/lib/db/schema";
import { PageBanner } from "@/components/public/PageBanner";
import { ContentBlock } from "@/components/public/ContentBlock";
import { ContactForm } from "@/components/public/ContactForm";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { MapPin, Clock, Phone, Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contáctanos. Información de contacto, ubicación y horarios de Centro Cristiano Berea en Mexicali, Baja California.",
  openGraph: {
    title: "Contacto | Centro Cristiano Berea",
    description:
      "Contáctanos. Información de contacto, ubicación y horarios de Centro Cristiano Berea en Mexicali, Baja California.",
  },
};

async function getContact() {
  const [row] = await db.select().from(contact).limit(1);
  return row;
}

type Schedules = { schedules?: { day?: string; time?: string }[] };

export default async function ContactoPage() {
  const info = await getContact();

  const scheduleData: Schedules = (info?.schedules as Schedules) ?? {};
  const schedules = scheduleData.schedules?.length
    ? scheduleData.schedules
    : [
        { day: "Domingo", time: "11:00 AM a 1:00 PM" },
        { day: "Miércoles", time: "Escuela de Líderes 8:00 PM" },
        { day: "Jueves", time: "Escuela de Ministerios 8:00 PM" },
      ];

  return (
    <>
      <PageBanner
        title="Contacto"
        subtitle="Nos encantaría saber de ti."
        backgroundImage="/images/banner-contacto.png"
      />

      <ContentBlock variant="warm">
        <ScrollReveal animation="fade-up">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-16 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-berea-navy">
                  Información de contacto
                </h2>
                <div className="mt-4 h-1 w-10 rounded-full bg-berea-gold" />
                <div className="mt-8 space-y-6">
                  {[
                    {
                      icon: MapPin,
                      label: "Dirección",
                      value:
                        "C. Tercera 109, Zona Urbana Xochimilco, Mexicali, Baja California, C.P. 21380",
                    },
                    {
                      icon: Phone,
                      label: "Teléfono",
                      value: info?.phone || "686 555 6149",
                    },
                    {
                      icon: Mail,
                      label: "Correo electrónico",
                      value: info?.email || "centrocristianobereamxli@gmail.com",
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-berea-navy/5">
                        <item.icon className="h-5 w-5 text-berea-gold" />
                      </div>
                      <div>
                        <p className="font-semibold text-berea-navy">{item.label}</p>
                        <p className="mt-0.5 text-sm text-berea-muted">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight text-berea-navy">Horarios</h2>
                <div className="mt-4 h-1 w-10 rounded-full bg-berea-gold" />
                <div className="mt-8 space-y-4">
                  {schedules.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 rounded-xl border border-berea-border bg-white p-5 transition-shadow hover:shadow-md"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-berea-navy/5">
                        <Clock className="h-5 w-5 text-berea-gold" />
                      </div>
                      <div>
                        <p className="font-semibold text-berea-navy">{h.day}</p>
                        <p className="text-sm text-berea-muted">{h.time}</p>
                      </div>
                    </div>
                  ))}
                  <p className="text-xs italic text-berea-muted">Duración aproximada: 2 horas</p>
                </div>
              </div>
            </div>

            <div className="mt-20 rounded-2xl border border-berea-border bg-white p-10 shadow-sm">
              <h2 className="text-xl font-bold text-berea-navy">Envíanos un mensaje</h2>
              <p className="mt-2 text-sm text-berea-muted">
                Completa el formulario y te responderemos a la brevedad.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </ContentBlock>
    </>
  );
}
