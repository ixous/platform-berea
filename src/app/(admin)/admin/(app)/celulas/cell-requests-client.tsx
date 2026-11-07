"use client";

import { useState, useTransition } from "react";
import { updateCellRequestStatus, type CellRequestItem } from "@/actions/cells";
import {
  Users,
  Phone,
  MapPin,
  Calendar,
  MessageCircle,
  Download,
  FileText,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

interface Props {
  initialItems: CellRequestItem[];
  total: number;
}

export function CellRequestsClient({ initialItems, total }: Props) {
  const [items, setItems] = useState<CellRequestItem[]>(initialItems);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (
    id: string,
    newStatus: "pending" | "contacted" | "assigned" | "integrated" | "archived"
  ) => {
    startTransition(async () => {
      const res = await updateCellRequestStatus(id, newStatus);
      if (res.success) {
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
      }
    });
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.phone.includes(search) ||
      item.neighborhood.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" ? true : item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = items.filter((i) => i.status === "pending").length;
  const contactedCount = items.filter((i) => i.status === "contacted").length;
  const integratedCount = items.filter(
    (i) => i.status === "integrated" || i.status === "assigned"
  ).length;

  const statusBadge: Record<string, { label: string; className: string }> = {
    pending: { label: "Pendiente", className: "bg-amber-100 text-amber-800 border-amber-200" },
    contacted: { label: "Contactado", className: "bg-blue-100 text-blue-800 border-blue-200" },
    assigned: {
      label: "Asignado a Célula",
      className: "bg-purple-100 text-purple-800 border-purple-200",
    },
    integrated: {
      label: "Integrado",
      className: "bg-emerald-100 text-emerald-800 border-emerald-200",
    },
    archived: { label: "Archivado", className: "bg-slate-100 text-slate-700 border-slate-200" },
  };

  return (
    <div className="space-y-6">
      {/* Barra superior de métricas y acciones */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] flex items-center gap-2">
            <Users className="h-6 w-6 text-[#B38728]" />
            Interesados en Células (WhatsApp)
          </h1>
          <p className="text-sm text-site-muted mt-1">
            Prospectos capturados a través del embudo de la página web que buscan una célula
            cercana.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/celulas/pdf"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs sm:text-sm font-semibold text-amber-900 shadow-xs hover:bg-amber-100 transition-colors"
          >
            <FileText className="h-4 w-4 text-amber-600" />
            Descargar PDF Oficial
          </Link>
          <a
            href="/api/celulas/export"
            className="inline-flex items-center gap-1.5 rounded-xl border border-site-line bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-site-ink shadow-xs hover:bg-slate-50 transition-colors"
          >
            <Download className="h-4 w-4 text-site-muted" />
            Exportar Excel
          </a>
        </div>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-site-line bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-site-muted">
            <span>Total Capturados</span>
            <Sparkles className="h-4 w-4 text-[#B38728]" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-site-ink">{total}</p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-800">
            <span>Por Contactar</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-amber-900">{pendingCount}</p>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-blue-800">
            <span>En Contacto</span>
            <Phone className="h-4 w-4 text-blue-600" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-blue-900">{contactedCount}</p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-800">
            <span>Asignados / En Célula</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-emerald-900">{integratedCount}</p>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-site-muted">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, teléfono o colonia..."
            className="block w-full rounded-xl border border-site-line bg-white pl-10 pr-3.5 py-2.5 text-sm text-site-ink outline-none transition-colors focus:border-[#B38728] focus:ring-2 focus:ring-[#B38728]/20"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-site-line bg-white px-3.5 py-2.5 text-sm text-site-ink outline-none focus:border-[#B38728] focus:ring-2 focus:ring-[#B38728]/20"
        >
          <option value="all">Todos los estados</option>
          <option value="pending">Pendientes de contactar</option>
          <option value="contacted">Contactados</option>
          <option value="assigned">Asignados a Célula</option>
          <option value="integrated">Integrados exitosamente</option>
          <option value="archived">Archivados</option>
        </select>
      </div>

      {/* Tabla de Resultados */}
      <div className="rounded-2xl border border-site-line bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-site-line text-xs font-bold uppercase tracking-wider text-site-muted">
              <tr>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Nombre</th>
                <th className="py-3 px-4">WhatsApp</th>
                <th className="py-3 px-4">Colonia / Zona</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-site-line">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-site-muted">
                    <Users className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                    No hay solicitudes registradas con los filtros actuales.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const cleanPhone = item.phone.replace(/\D/g, "");
                  const is10Digit = cleanPhone.length === 10;
                  const intlPhone = is10Digit ? `52${cleanPhone}` : cleanPhone;
                  const waUrl = `https://wa.me/${intlPhone}?text=${encodeURIComponent(
                    `¡Hola ${item.name}! Te escribimos de Centro Cristiano Berea respecto a tu solicitud para integrarte a una célula en la zona de ${item.neighborhood}. ¿Cómo estás?`
                  )}`;

                  const badge = statusBadge[item.status] || {
                    label: item.status,
                    className: "bg-slate-100 text-slate-700",
                  };

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-xs text-site-muted whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            {new Date(item.createdAt).toLocaleDateString("es-MX", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-site-ink block">{item.name}</span>
                        {item.email && (
                          <span className="text-xs text-site-muted block truncate max-w-[180px]">
                            {item.email}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#25D366] hover:underline bg-[#25D366]/10 px-2.5 py-1 rounded-full"
                          title="Enviar mensaje por WhatsApp"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>{item.phone}</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </a>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-xs text-slate-700 font-medium">
                          <MapPin className="h-3.5 w-3.5 text-[#B38728] shrink-0" />
                          <span>{item.neighborhood}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-xs text-site-muted">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 font-medium text-slate-800">
                          {item.cellType || "Familiar"}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <select
                          value={item.status}
                          disabled={isPending}
                          onChange={(e) =>
                            handleStatusChange(
                              item.id,
                              e.target.value as
                                "pending" | "contacted" | "assigned" | "integrated" | "archived"
                            )
                          }
                          className={`text-xs font-bold rounded-lg border px-2.5 py-1 outline-none transition-all cursor-pointer ${badge.className}`}
                        >
                          <option value="pending">Pendiente</option>
                          <option value="contacted">Contactado</option>
                          <option value="assigned">Asignado a Célula</option>
                          <option value="integrated">Integrado</option>
                          <option value="archived">Archivado</option>
                        </select>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg bg-[#25D366] px-2.5 py-1.5 text-xs font-bold text-white hover:bg-[#20ba59] transition-colors"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>Escribir</span>
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
