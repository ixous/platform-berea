import { db } from "@/lib/db";
import { cellRequests } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import Image from "next/image";
import { CellPrintControls } from "./print-controls";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reporte Oficial: Interesados en Células — Centro Cristiano Berea",
  robots: { index: false, follow: false },
};

export default async function CellRequestsPdfPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");

  const items = await db.select().from(cellRequests).orderBy(desc(cellRequests.createdAt));

  const total = items.length;
  const pendingCount = items.filter((i) => i.status === "pending").length;
  const assignedCount = items.filter(
    (i) => i.status === "assigned" || i.status === "integrated"
  ).length;

  const generatedDateFormatted = new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());

  const statusLabel: Record<string, string> = {
    pending: "Pendiente",
    contacted: "Contactado",
    assigned: "Asignado",
    integrated: "Integrado",
    archived: "Archivado",
  };

  return (
    <div className="min-h-screen bg-slate-100/60 print:bg-white text-slate-800 antialiased font-sans">
      <CellPrintControls />

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
                  Ministerio de Grupos Pequeños
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
                Control Pastoral
              </span>
              <p className="text-xs font-semibold text-slate-700 mt-2">
                Seguimiento de Células (WhatsApp)
              </p>
              <p className="text-[11px] text-slate-500">Emisión: {generatedDateFormatted}</p>
            </div>
          </div>
        </header>

        {/* Resumen de Métricas */}
        <section className="mt-6 rounded-xl bg-slate-50 p-4 border border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-slate-500 block font-medium">
                Total de Personas Registradas
              </span>
              <span className="text-lg font-bold text-slate-900">{total} prospectos</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Por Contactar</span>
              <span className="text-lg font-bold text-amber-700">{pendingCount} personas</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Asignados / En Célula</span>
              <span className="text-lg font-bold text-emerald-700">{assignedCount} integrados</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Ciudad</span>
              <span className="text-lg font-bold text-slate-900">Mexicali, B.C.</span>
            </div>
          </div>
        </section>

        {/* Tabla de Personas */}
        <section className="mt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0F172A] text-white">
                  <th className="py-2.5 px-3 font-semibold text-center w-10 border border-[#1E293B]">
                    #
                  </th>
                  <th className="py-2.5 px-3 font-semibold border border-[#1E293B]">Fecha</th>
                  <th className="py-2.5 px-3 font-semibold border border-[#1E293B]">
                    Nombre Completo
                  </th>
                  <th className="py-2.5 px-3 font-semibold border border-[#1E293B]">WhatsApp</th>
                  <th className="py-2.5 px-3 font-semibold border border-[#1E293B]">
                    Colonia / Zona
                  </th>
                  <th className="py-2.5 px-3 font-semibold border border-[#1E293B]">Tipo</th>
                  <th className="py-2.5 px-3 font-semibold text-center border border-[#1E293B]">
                    Estado
                  </th>
                  <th className="py-2.5 px-3 font-semibold text-center border border-[#1E293B]">
                    Célula Asignada / Firma
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-8 text-center text-slate-500 italic border border-slate-200"
                    >
                      Aún no hay personas registradas en el embudo de células.
                    </td>
                  </tr>
                ) : (
                  items.map((r, index) => {
                    const isEven = index % 2 === 0;
                    return (
                      <tr
                        key={r.id}
                        className={`${
                          isEven ? "bg-white" : "bg-slate-50/70"
                        } print:break-inside-avoid border border-slate-200`}
                      >
                        <td className="py-2 px-2.5 text-center font-bold text-slate-500 border-r border-slate-200">
                          {index + 1}
                        </td>
                        <td className="py-2 px-3 text-slate-600 border-r border-slate-200 whitespace-nowrap">
                          {new Date(r.createdAt).toLocaleDateString("es-MX", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </td>
                        <td className="py-2 px-3 font-bold text-slate-900 border-r border-slate-200">
                          {r.name}
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px] text-slate-700 border-r border-slate-200 whitespace-nowrap">
                          {r.phone}
                        </td>
                        <td className="py-2 px-3 text-slate-800 font-medium border-r border-slate-200">
                          {r.neighborhood}
                        </td>
                        <td className="py-2 px-3 text-slate-600 border-r border-slate-200">
                          {r.cellType || "Familiar"}
                        </td>
                        <td className="py-2 px-2 text-center border-r border-slate-200">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                            {statusLabel[r.status] || r.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-400 border-r border-slate-200 text-center min-w-[140px]">
                          [
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          ]
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Firmas de Control */}
        <footer className="mt-12 pt-8 border-t border-slate-300 print:break-inside-avoid">
          <div className="grid grid-cols-2 gap-12 text-center">
            <div>
              <div className="border-b border-slate-400 pb-1 mx-auto max-w-[240px]"></div>
              <p className="text-xs font-bold text-slate-800 mt-2">
                Pastor / Coordinación de Células
              </p>
              <p className="text-[11px] text-slate-500">Supervisión Pastoral Berea</p>
            </div>
            <div>
              <div className="border-b border-slate-400 pb-1 mx-auto max-w-[240px]"></div>
              <p className="text-xs font-bold text-slate-800 mt-2">Líder de Red / Asignación</p>
              <p className="text-[11px] text-slate-500">Seguimiento e Integración a Hogares</p>
            </div>
          </div>

          <div className="mt-8 text-center border-t border-slate-200 pt-4 text-[11px] text-slate-500">
            <p className="font-semibold text-slate-600">
              &quot;Y todos los días, en el templo y por las casas, no cesaban de enseñar y predicar
              a Jesucristo.&quot; — Hechos 5:42
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
            size: letter landscape;
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
