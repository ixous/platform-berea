import { db } from "@/lib/db";
import { events, eventRegistrations } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/rbac";
import { redirect, notFound } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import Image from "next/image";
import { PrintControls } from "./print-controls";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reporte Oficial de Asistencia — Centro Cristiano Berea",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EventRegistrationsPdfPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");

  const allowed = await hasPermission("event-registrations.manage");
  if (!allowed) redirect("/admin");

  const { id: eventId } = await params;

  const [event] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);

  if (!event) {
    notFound();
  }

  const registrations = await db
    .select()
    .from(eventRegistrations)
    .where(eq(eventRegistrations.eventId, eventId))
    .orderBy(asc(eventRegistrations.createdAt));

  const totalRegistrations = registrations.length;
  const totalPeople = registrations.reduce((acc, cur) => acc + (Number(cur.guests) || 1), 0);
  const confirmedPeople = registrations
    .filter((r) => r.status === "confirmed")
    .reduce((acc, cur) => acc + (Number(cur.guests) || 1), 0);

  const statusLabel: Record<string, string> = {
    confirmed: "Confirmado",
    cancelled: "Cancelado",
    attended: "Asistió",
    "no-show": "No asistió",
  };

  const statusBadgeStyle: Record<string, string> = {
    confirmed: "bg-emerald-50 text-emerald-800 border-emerald-200",
    cancelled: "bg-rose-50 text-rose-800 border-rose-200",
    attended: "bg-blue-50 text-blue-800 border-blue-200",
    "no-show": "bg-amber-50 text-amber-800 border-amber-200",
  };

  const eventDateFormatted = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(event.startDate));

  const generatedDateFormatted = new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());

  return (
    <div className="min-h-screen bg-slate-100/60 print:bg-white text-slate-800 antialiased font-sans">
      <PrintControls eventId={eventId} />

      <main className="mx-auto max-w-5xl my-6 p-6 sm:p-10 bg-white shadow-xl print:shadow-none print:my-0 print:p-0 print:max-w-none rounded-2xl print:rounded-none border border-slate-200 print:border-none">
        {/* Encabezado Institucional */}
        <header className="border-b-2 border-[#D4AF37] pb-6">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="Centro Cristiano Berea"
                  fill
                  sizes="80px"
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B38728]">
                  Iglesia Cristiana Evangélica
                </p>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
                  CENTRO CRISTIANO BEREA
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mexicali, Baja California · centrocristianoberea.org
                </p>
              </div>
            </div>

            <div className="text-right border-l border-slate-200 pl-6 hidden sm:block print:block">
              <span className="inline-block rounded-full bg-[#0F172A] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#D4AF37]">
                Control Oficial
              </span>
              <p className="text-xs font-semibold text-slate-700 mt-2">
                Lista de Registro y Asistencia
              </p>
              <p className="text-[11px] text-slate-500">Emisión: {generatedDateFormatted}</p>
            </div>
          </div>
        </header>

        {/* Ficha Ejecutiva del Evento */}
        <section className="mt-6 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/70 p-5 border border-slate-200 print:bg-slate-50/80">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-wider font-bold text-[#B38728]">
                Detalles del Evento
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] mt-0.5">{event.title}</h2>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-xs">
              <span className="text-slate-500 block font-medium">Fecha</span>
              <span className="font-bold text-slate-900 capitalize mt-0.5 block">
                {eventDateFormatted}
              </span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-xs">
              <span className="text-slate-500 block font-medium">Horario</span>
              <span className="font-bold text-slate-900 mt-0.5 block">
                {event.time || "No especificado"}
              </span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-xs">
              <span className="text-slate-500 block font-medium">Ubicación</span>
              <span className="font-bold text-slate-900 mt-0.5 block truncate">
                {event.location || "Auditorio Principal CCB"}
              </span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-xs">
              <span className="text-slate-500 block font-medium">Cupo Límite</span>
              <span className="font-bold text-slate-900 mt-0.5 block">
                {event.capacity ? `${event.capacity} personas` : "Abierto (Sin límite)"}
              </span>
            </div>
          </div>

          {/* Métricas destacadas */}
          <div className="mt-4 flex flex-wrap items-center gap-4 pt-3 border-t border-slate-200/70 text-xs">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#0F172A]"></span>
              <span className="text-slate-600 font-medium">Registros (Titulares):</span>
              <strong className="text-slate-900 font-bold">{totalRegistrations}</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#B38728]"></span>
              <span className="text-slate-600 font-medium">
                Personas Esperadas (con acompañantes):
              </span>
              <strong className="text-slate-900 font-bold">{totalPeople}</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-600"></span>
              <span className="text-slate-600 font-medium">Lugares Confirmados:</span>
              <strong className="text-emerald-700 font-bold">{confirmedPeople}</strong>
            </div>
          </div>
        </section>

        {/* Tabla de Asistentes */}
        <section className="mt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0F172A] text-white">
                  <th className="py-2.5 px-3 font-semibold text-center w-10 border border-[#1E293B]">
                    #
                  </th>
                  <th className="py-2.5 px-3 font-semibold border border-[#1E293B]">
                    Nombre del Asistente
                  </th>
                  <th className="py-2.5 px-3 font-semibold border border-[#1E293B]">Teléfono</th>
                  <th className="py-2.5 px-3 font-semibold border border-[#1E293B]">
                    Correo Electrónico
                  </th>
                  <th className="py-2.5 px-3 font-semibold text-center w-20 border border-[#1E293B]">
                    Lugares
                  </th>
                  <th className="py-2.5 px-3 font-semibold text-center w-28 border border-[#1E293B]">
                    Estado
                  </th>
                  <th className="py-2.5 px-3 font-semibold text-center w-28 border border-[#1E293B]">
                    Check-in
                  </th>
                  <th className="py-2.5 px-3 font-semibold border border-[#1E293B]">Notas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {registrations.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-8 text-center text-slate-500 italic border border-slate-200"
                    >
                      Aún no hay personas registradas para este evento.
                    </td>
                  </tr>
                ) : (
                  registrations.map((reg, index) => {
                    const isEven = index % 2 === 0;
                    return (
                      <tr
                        key={reg.id}
                        className={`${
                          isEven ? "bg-white" : "bg-slate-50/70"
                        } print:break-inside-avoid border border-slate-200`}
                      >
                        <td className="py-2 px-2.5 text-center font-bold text-slate-500 border-r border-slate-200">
                          {index + 1}
                        </td>
                        <td className="py-2 px-3 font-bold text-slate-900 border-r border-slate-200">
                          {reg.name}
                        </td>
                        <td className="py-2 px-3 text-slate-700 font-mono text-[11px] border-r border-slate-200">
                          {reg.phone || "—"}
                        </td>
                        <td className="py-2 px-3 text-slate-600 border-r border-slate-200 truncate max-w-[180px]">
                          {reg.email}
                        </td>
                        <td className="py-2 px-2.5 text-center font-bold text-slate-800 border-r border-slate-200">
                          {reg.guests || 1}
                        </td>
                        <td className="py-2 px-2 text-center border-r border-slate-200">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              statusBadgeStyle[reg.status] ||
                              "bg-slate-100 text-slate-700 border-slate-200"
                            }`}
                          >
                            {statusLabel[reg.status] || reg.status}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-center border-r border-slate-200">
                          <div className="inline-flex items-center justify-center h-4 w-4 border-2 border-slate-400 rounded-sm"></div>
                        </td>
                        <td className="py-2 px-3 text-slate-500 text-[11px] italic max-w-[150px] truncate">
                          {reg.notes || "—"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Sección de Firmas y Validación Institucional */}
        <footer className="mt-12 pt-8 border-t border-slate-300 print:break-inside-avoid">
          <div className="grid grid-cols-2 gap-12 text-center">
            <div>
              <div className="border-b border-slate-400 pb-1 mx-auto max-w-[240px]"></div>
              <p className="text-xs font-bold text-slate-800 mt-2">Pastoral / Liderazgo Berea</p>
              <p className="text-[11px] text-slate-500">Firma de Recepción</p>
            </div>
            <div>
              <div className="border-b border-slate-400 pb-1 mx-auto max-w-[240px]"></div>
              <p className="text-xs font-bold text-slate-800 mt-2">Administración y Registro</p>
              <p className="text-[11px] text-slate-500">Firma y Control de Acceso</p>
            </div>
          </div>

          <div className="mt-8 text-center border-t border-slate-200 pt-4 text-[11px] text-slate-500">
            <p className="font-semibold text-slate-600">
              &quot;Haced todo decentemente y con orden.&quot; — 1 Corintios 14:40
            </p>
            <p className="mt-1 text-[10px] text-slate-400">
              Centro Cristiano Berea · Documento Oficial Generado Automáticamente ·{" "}
              {generatedDateFormatted}
            </p>
          </div>
        </footer>
      </main>

      <style>{`
        @media print {
          @page {
            size: letter portrait;
            margin: 10mm 10mm 10mm 10mm;
          }
          body {
            background-color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}
